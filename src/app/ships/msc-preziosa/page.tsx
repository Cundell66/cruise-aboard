
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipStats } from "@/components/ship-stats";
import { Ship, Users, BedDouble, UserCog, Gauge, Ruler, Weight } from "lucide-react";

const video = {
  ship: 'MSC Preziosa',
  src: 'https://iframe.mediadelivery.net/embed/58732/6bc430cb-6689-41e7-b5bb-1bbe3ddff9a5?autoplay=true&loop=true&muted=true&preload=true&responsive=true',
};

const shipStats = [
    { icon: Users, value: "4,345", label: "Number of passengers" },
    { icon: BedDouble, value: "1,751", label: "Number of cabins" },
    { icon: UserCog, value: "1,388", label: "Crew members" },
    { icon: Gauge, value: "24 knots", label: "Maximum Speed" },
    { icon: Ruler, value: "333 / 38 / 67", label: "Length (m) / Beam (m) / Height (m)" },
    { icon: Weight, value: "139,072 tons", label: "Gross tonnage" },
];

export default function MscPreziosaPage() {
  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <Ship className="h-8 w-8 text-primary" />
            MSC Preziosa
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
              [Placeholder for details about MSC Preziosa. You can describe the ship's features, amenities, dining options, entertainment, and more here.]
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.
            </p>
          </div>
          <ShipStats 
            title="MSC Preziosa in numbers"
            subtitle="Discover how many details make your experience so great."
            stats={shipStats}
          />
        </CardContent>
      </Card>
    </main>
  );
}
