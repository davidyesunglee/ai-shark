import { expect, test, type Page } from "@playwright/test";

const user = {
  id: "e2e-user",
  email: "customer@example.com",
  firstName: "Test",
  lastName: "Customer",
  emailVerified: true,
};

const products = {
  products: [
    {
      id: "prod_subscription",
      name: "Iteration Plan",
      description: "Monthly plan",
      metadata: { tier: "subscription", credits: "2" },
      prices: [
        {
          id: "price_subscription",
          unit_amount: 699,
          currency: "usd",
          recurring: { interval: "month" },
        },
      ],
    },
    {
      id: "prod_one_time",
      name: "One-Time Evaluation",
      description: "Single report",
      metadata: { tier: "one_time", credits: "1" },
      prices: [
        {
          id: "price_one_time",
          unit_amount: 1399,
          currency: "usd",
          recurring: null,
        },
      ],
    },
  ],
};

async function mockAuth(page: Page, authenticated: boolean) {
  await page.route("**/api/auth/user", (route) =>
    route.fulfill({
      status: authenticated ? 200 : 401,
      contentType: "application/json",
      body: JSON.stringify(authenticated ? user : { message: "Unauthorized" }),
    }),
  );
}

test.describe("signup", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page, false);
    await page.goto("/signup");
  });

  test("validates passwords and requires terms acceptance", async ({ page }) => {
    const submit = page.getByTestId("button-signup");
    await expect(submit).toBeDisabled();

    await page.getByTestId("input-email").fill("new@example.com");
    await page.getByTestId("input-password").fill("password1");
    await page.getByTestId("input-confirm-password").fill("different1");
    await page.getByTestId("checkbox-terms").click();
    await submit.click();
    await expect(page.getByText("Passwords don't match", { exact: true })).toBeVisible();

    await page.getByTestId("input-password").fill("short");
    await page.getByTestId("input-confirm-password").fill("short");
    await submit.click();
    await expect(page.getByText("Password too short", { exact: true })).toBeVisible();
  });

  test("submits only after terms are accepted", async ({ page }) => {
    let signupBody: unknown;
    await page.route("**/api/auth/signup", async (route) => {
      signupBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(user),
      });
    });

    await page.getByTestId("input-first-name").fill("Test");
    await page.getByTestId("input-last-name").fill("Customer");
    await page.getByTestId("input-email").fill("customer@example.com");
    await page.getByTestId("input-password").fill("password1");
    await page.getByTestId("input-confirm-password").fill("password1");
    await page.getByTestId("checkbox-terms").click();
    await page.getByTestId("button-signup").click();

    await expect.poll(() => signupBody).toEqual({
      email: "customer@example.com",
      password: "password1",
      firstName: "Test",
      lastName: "Customer",
    });
    await expect(page).toHaveURL(/\/register$/);
  });
});

test("pricing routes signed-out customers to login", async ({ page }) => {
  await mockAuth(page, false);
  await page.route("**/api/products", (route) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify(products) }),
  );

  await page.goto("/pricing");
  await page.getByTestId("button-select-subscription").click();
  await expect(page).toHaveURL(/\/login$/);
});

test("pricing initiates checkout for signed-in customers", async ({ page }) => {
  await mockAuth(page, true);
  await page.route("**/api/products", (route) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify(products) }),
  );
  await page.route("**/api/billing/status", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ tier: "free", creditsRemaining: 0, hasActiveSubscription: false }),
    }),
  );

  let checkoutBody: unknown;
  await page.route("**/api/checkout/create-session", async (route) => {
    checkoutBody = route.request().postDataJSON();
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ url: "/stripe-test/checkout" }),
    });
  });

  await page.goto("/pricing");
  await page.getByTestId("button-select-subscription").click();
  await expect.poll(() => checkoutBody).toEqual({
    priceId: "price_subscription",
    mode: "subscription",
  });
  await expect(page).toHaveURL(/\/stripe-test\/checkout$/);
});

test("active subscribers can open Stripe billing settings", async ({ page }) => {
  await mockAuth(page, true);
  await page.route("**/api/registration/status", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ isRegistered: true }),
    }),
  );
  await page.route("**/api/billing/status", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        tier: "subscription",
        creditsRemaining: 2,
        hasActiveSubscription: true,
      }),
    }),
  );
  await page.route("**/api/assessments", (route) =>
    route.fulfill({ contentType: "application/json", body: "[]" }),
  );

  let portalRequested = false;
  await page.route("**/api/billing/portal", async (route) => {
    portalRequested = true;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ url: "/stripe-test/portal" }),
    });
  });

  await page.goto("/dashboard");
  const manageBilling = page.getByTestId("button-manage-billing");
  await expect(manageBilling).toBeVisible();
  await manageBilling.click();
  await expect.poll(() => portalRequested).toBe(true);
  await expect(page).toHaveURL(/\/stripe-test\/portal$/);
});

test("free-score results expose a working unsubscribe link", async ({ page }) => {
  await mockAuth(page, false);
  await page.route("**/api/teaser", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        overallScore: 62,
        lenderReadinessGrade: "C",
        summary: "Your plan has a workable foundation.",
        topWeaknesses: ["Cash flow assumptions need support."],
        unsubscribeUrl: "/api/unsubscribe?token=e2e-token",
      }),
    }),
  );
  await page.route("**/api/unsubscribe?token=e2e-token", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h2>You're unsubscribed</h2>",
    }),
  );

  await page.goto("/");
  await page.getByTestId("input-teaser-email").fill("lead@example.com");
  await page
    .getByTestId("input-file-upload")
    .setInputFiles({ name: "plan.txt", mimeType: "text/plain", buffer: Buffer.from("Business plan") });
  await page.getByTestId("button-analyze").click();

  const unsubscribe = page.getByTestId("link-teaser-unsubscribe");
  await expect(unsubscribe).toBeVisible();
  await expect(unsubscribe).toHaveAttribute("href", "/api/unsubscribe?token=e2e-token");
  await unsubscribe.click();
  await expect(page.getByRole("heading", { name: "You're unsubscribed" })).toBeVisible();
});