
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship } from "lucide-react";

const video = {
  ship: 'MSC Virtuosa',
  src: 'https://iframe.mediadelivery.net/embed/58732/3c61795a-5d9d-42f0-8e69-bb760aa53c0b?autoplay=true&loop=true&muted=true&preload=true&responsive=true',
};

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
              [Placeholder for details about MSC Virtuosa. You can describe the ship's features, amenities, dining options, entertainment, and more here.]
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
