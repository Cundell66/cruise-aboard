import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import testimonialsData from "../../content/testimonials.json";

interface Testimonial {
  quote: string;
  name: string;
  details: string;
}

const testimonials: Testimonial[] = testimonialsData.testimonials;

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="mb-16">
      <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary/90 mb-8">
        What customers say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <Card key={t.name} className="bg-card border shadow-sm">
            <CardContent className="pt-6">
              <Quote className="h-6 w-6 text-accent mb-3" />
              <p className="text-foreground/90 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-semibold text-primary">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
