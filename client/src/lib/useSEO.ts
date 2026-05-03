import { useEffect } from "react";

export interface SEOOptions {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO(opts: SEOOptions) {
  useEffect(() => {
    const path = opts.canonical || window.location.pathname;
    const canonicalUrl = `https://aishark.org${path === "/" ? "/" : path}`;

    document.title = opts.title;

    if (opts.description) {
      setMeta("name", "description", opts.description);
      setMeta("property", "og:description", opts.ogDescription || opts.description);
      setMeta("name", "twitter:description", opts.ogDescription || opts.description);
    }

    setMeta("property", "og:title", opts.ogTitle || opts.title);
    setMeta("name", "twitter:title", opts.ogTitle || opts.title);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("name", "twitter:url", canonicalUrl);

    if (opts.ogImage) {
      setMeta("property", "og:image", opts.ogImage);
      setMeta("name", "twitter:image", opts.ogImage);
    }

    setMeta(
      "name",
      "robots",
      opts.noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    setCanonical(canonicalUrl);
  }, [opts.title, opts.description, opts.canonical, opts.ogTitle, opts.ogDescription, opts.ogImage, opts.noindex]);
}

// Lightweight client-side click tracking helper. Best-effort — never blocks UI.
export function trackClick(label: string, extra?: { path?: string }) {
  try {
    const path = extra?.path || window.location.pathname;
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, path }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

// Client-side SPA pageview tracker — needed because Wouter route changes
// don't trigger a fresh server request, so server middleware misses them.
// Sends a "visit" event for the new path. Best-effort, fire-and-forget.
let lastTrackedPath: string | null = null;
export function trackPageview(path: string) {
  try {
    if (path === lastTrackedPath) return;
    lastTrackedPath = path;
    fetch("/api/track-pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, referrer: document.referrer || null }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
