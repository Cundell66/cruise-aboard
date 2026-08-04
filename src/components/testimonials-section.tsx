import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  details: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Charlie sorted our family of five across three cabins, the parking, everything. I genuinely didn't have to do anything but turn up at Southampton.",
    name: "The Wilson family",
    details: "Family cruise, MSC Virtuosa",
  },
  {
    quote: "Booked direct with MSC the first time. Second time I asked Charlie for a quote and got the same cruise with better service and a better price.",
    name: "Margaret H.",
    details: "Northern Europe, balcony cabin",
  },
  {
    quote: "I asked a question in the Facebook group at 9pm and had a quote by the morning. That's just not happening anywhere else.",
    name: "Dave & Sue",
    details: "Norwegian Fjords",
  },
];

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
