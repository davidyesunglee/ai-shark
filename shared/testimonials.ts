// Real customer testimonials only — never publish invented quotes.
// Add entries here as beta users / customers provide them (with permission),
// and the landing page testimonial section will appear automatically.

export interface Testimonial {
  quote: string;
  name: string; // e.g. "Maria G."
  role: string; // e.g. "Owner, coffee roastery — Austin, TX"
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "AI Shark found discrepancies in my business plan and suggested improvements that increased my evaluation score!",
    name: "Vince",
    role: "Founder",
  },
  {
    quote: "Their evaluation was quick and powerful. Helped me get approved!",
    name: "Ethan",
    role: "Owner, personal services",
  },
  {
    quote:
      "Really helped improve my business plan and offered examples that helped grow my business operations. Now funding is within reach!",
    name: "Earl",
    role: "Tech student & founder",
  },
];
