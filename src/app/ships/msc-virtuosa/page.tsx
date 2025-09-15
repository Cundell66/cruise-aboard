
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipStats } from "@/components/ship-stats";
import { Ship, Users, BedDouble, UserCog, Gauge, Ruler, Weight } from "lucide-react";
import { DeckplanSection } from "@/components/deckplan-section";

const video = {
  ship: 'MSC Virtuosa',
  src: 'https://iframe.mediadelivery.net/embed/58732/3c61795a-5d9d-42f0-8e69-bb760aa53c0b?autoplay=true&loop=true&muted=true&preload=true&responsive=true',
};

const shipStats = [
    { icon: Users, value: "6,334", label: "Number of passengers" },
    { icon: BedDouble, value: "2,421", label: "Number of cabins" },
    { icon: UserCog, value: "1,704", label: "Crew members" },
    { icon: Gauge, value: "22 knots", label: "Maximum Speed" },
    { icon: Ruler, value: "331 / 43 / 65", label: "Length (m) / Beam (m) / Height (m)" },
    { icon: Weight, value: "181,541 tons", label: "Gross tonnage" },
];

export default function MscVirtuosaPage() {
  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <Ship className="h-8 w-8 text-primary" />
            MSC Virtuosa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src={video.src}
              className="absolute top-0 left-0 h-full w-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer"
            ></iframe>
          </div>
          <div className="text-muted-foreground space-y-4">
            <h2 className="font-headline text-2xl font-semibold text-primary/90 mt-6">About the Ship</h2>
            <p>
            <strong>Masterpiece at Sea</strong>
            </p>
            <p>
              MSC Virtuosa’s namesake comes from the word virtuoso, meaning someone highly skilled in any field of activity, and so MSC Virtuosa was named to pay homage to the skill and expertise of the MSC Cruises architects.
              <br />
              MSC Virtuosa belongs to the “Meraviglia Class”, where the impressive array of onboard experiences come together in perfect harmony with the space and the destinations, to deliver the ultimate cruise holiday experience.
              <br />
              In addition, MSC Virtuosa is featured with an advanced wastewater treatment system, and she is actively contributing to impactful environmental conservation and humanitarian programs at the MSC Foundation Centre on board.            </p>
          </div>
          <ShipStats 
            title="MSC Virtuosa in numbers"
            subtitle="Discover how many details make your experience so great."
            stats={shipStats}
          />
          <DeckplanSection pdfUrl="/msc-virtuosa-deckplan.pdf" />
        </CardContent>
      </Card>
    </main>
  );
}
