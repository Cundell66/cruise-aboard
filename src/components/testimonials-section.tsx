import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import testimonialsData from "../../content/testimonials.json";

interface Testimonial {
  quote: string;
  name: string;
  details: string;
}

const testimonials: Testimonial[] = testimonialsData.testimonials;

function Stars() {
  return (
    <div className="flex gap-1 mb-3" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary/90 mb-3">
            Customers love Cruise Aboard
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
            Real reviews from real cruisers in the group.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card key={t.name} className="bg-card border shadow-sm flex flex-col">
              <CardContent className="pt-6 flex flex-col flex-grow">
                <Stars />
                <p className="text-foreground/90 italic mb-4 flex-grow">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-primary">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.details}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
