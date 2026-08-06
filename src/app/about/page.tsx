import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Users, MessageCircle, TrendingUp } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary/90 mb-2 text-center">
        Meet Charlie
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Cruise Aboard is one person: me. That's the point. When you book with me,
        you get the same person every time. No call centres, no hand-offs, no
        chasing.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-2xl">
            <Anchor className="h-6 w-6 text-primary" /> The short version
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            I run <strong>Cruise Aboard</strong>, MSC cruises from Southampton,
            and a handful of fly-cruises when the right one comes up. I'm a
            specialist, not a supermarket: 99% of what I book is MSC, so I know
            the ships, the cabins and the quirks better than anyone on a general
            travel website.
          </p>
          <p>
            You might know me as <strong>Charlie</strong>. That's what customers
            call me, that's how I sign my emails, and that's how you'll get me.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <Users className="h-5 w-5 text-primary" /> The group
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="text-3xl font-bold text-primary font-headline">{SITE_CONFIG.groupMembers}</p>
            <p className="mt-1">members in my MSC Cruises UK Forum Facebook group, one of the UK's biggest.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <TrendingUp className="h-5 w-5 text-primary" /> Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="text-3xl font-bold text-primary font-headline">{SITE_CONFIG.bookingsThisYear}</p>
            <p className="mt-1">cruises booked this year, and counting. Mostly people who found me through the group.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <MessageCircle className="h-5 w-5 text-primary" /> The list
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="text-3xl font-bold text-primary font-headline">{SITE_CONFIG.emailList}</p>
            <p className="mt-1">cruise fans on my mailing list, first to hear about the best deals.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-2xl">
            <Anchor className="h-6 w-6 text-primary" /> Why book with Charlie?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>1. <strong>One person, start to finish.</strong> I quote, I book, I sort the parking, I'm there on the day.</p>
          <p>2. <strong>Real MSC knowledge.</strong> The best cabins, the deck quirks, the Voyager Club tricks. I know them, and I'll tell you honestly.</p>
          <p>3. <strong>No price games.</strong> You'll see lead-in prices on the site, and I'll always tell you what the real deal is before you commit, including when booking direct with MSC genuinely makes more sense.</p>
          <p>4. <strong>Stress-free by design.</strong> Big family booking with three cabins and granny in tow? That's exactly the sort of thing I sort out every week.</p>
        </CardContent>
      </Card>
    </main>
  );
}
