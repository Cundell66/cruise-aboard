import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipStats } from "@/components/ship-stats";
import { Ship, Users, BedDouble, UserCog, Gauge, Ruler, Weight } from "lucide-react";

// TODO(Connor): replace with the MSC Meraviglia video embed URL when provided
const video = {
  ship: 'MSC Meraviglia',
  src: '', // e.g. 'https://iframe.mediadelivery.net/embed/58732/<id>?autoplay=true&loop=true&muted=true&preload=true&responsive=true'
};

const shipStats = [
    { icon: Users, value: "4,475", label: "Number of passengers" },
    { icon: BedDouble, value: "2,244", label: "Number of cabins" },
    { icon: UserCog, value: "1,608", label: "Crew members" },
    { icon: Gauge, value: "22.7 knots", label: "Maximum Speed" },
    { icon: Ruler, value: "315.83 / 43 / 65.85", label: "Length (m) / Beam (m) / Height (m)" },
    { icon: Weight, value: "171,598 tons", label: "Gross tonnage" },
];

export default function MscMeravigliaPage() {
  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <Ship className="h-8 w-8 text-primary" />
            MSC Meraviglia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary/40">
            {video.src ? (
              <iframe
                src={video.src}
                className="absolute top-0 left-0 h-full w-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-headline text-xl font-semibold text-muted-foreground">
                  Ship video coming soon
                </p>
              </div>
            )}
          </div>
           <div className="text-muted-foreground space-y-4">
            <h2 className="font-headline text-2xl font-semibold text-primary/90 mt-6">About the Ship</h2>
            <p>
              <strong>The ship for all seasons</strong>
            </p>
            <p>
              MSC Meraviglia is packed with extraordinary features for the perfect experience at sea in any season. Enjoy outstanding dining options and out-of-this-world entertainment, with new panoramic areas, an innovative ocean-view aft lounge, a two-deck "inside promenade" with a 480m² LED dome, and a spectacular amusement area connected to an outdoor water park.
            </p>
          </div>
           <ShipStats 
            title="MSC Meraviglia in numbers"
            subtitle="Discover how many details make your experience so great."
            stats={shipStats}
          />
        </CardContent>
      </Card>

    </main>
  );
}
