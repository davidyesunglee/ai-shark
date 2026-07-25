import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@shared/testimonials";

// Renders nothing until real testimonials are added to shared/testimonials.ts.
export function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12" aria-labelledby="customer-testimonials-title">
      <h2 id="customer-testimonials-title" className="mb-8 text-center text-2xl font-bold md:text-3xl">
        What business owners say
      </h2>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name + t.quote.slice(0, 20)}>
            <CardContent className="p-5">
              <Quote className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
              <blockquote className="text-sm">{t.quote}</blockquote>
              <footer className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{t.name}</span> — {t.role}
              </footer>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
