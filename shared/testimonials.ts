// Real customer testimonials only — never publish invented quotes.
// Add entries here as beta users / customers provide them (with permission),
// and the landing page testimonial section will appear automatically.

export interface Testimonial {
  quote: string;
  name: string; // e.g. "Maria G."
  role: string; // e.g. "Owner, coffee roastery — Austin, TX"
}

export const testimonials: Testimonial[] = [];
