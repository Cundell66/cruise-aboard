
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <Users className="h-8 w-8 text-primary" />
            About Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to Cruise Aboard!
          </p>
          <p>
            Cruise Aboard is a leading provider of exceptional cruise holidays, offering expertly curated packages tailored to your specific needs. Since our founding, our mission has been to deliver unparalleled value and a seamless booking experience.
          </p>
          <p>
            We are specialists in crafting comprehensive cruise packages that include everything from flights and hotel stays to exclusive tours. Our team of seasoned cruise experts has built strong, direct partnerships with major cruise lines, airlines, and hotels, enabling us to secure exclusive deals and competitive pricing that a standard search engine can't match.
          </p>
          <p>
            Our success is built on a foundation of trust and client satisfaction, evidenced by our 90% rebooking rate and a business model driven entirely by word-of-mouth referrals. We don't rely on advertising; we rely on results.
          </p>
          <p>
            At Cruise Aboard, you will always be connected with a dedicated professional, not an automated system. Our commitment to personal service ensures that every inquiry is handled with the expertise and attention it deserves, guaranteeing a stress-free journey from the moment you book until you return home.          
          </p>
       </CardContent>
      </Card>
    </main>
  );
}
