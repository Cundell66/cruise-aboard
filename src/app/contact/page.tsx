import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, Send, MapPin } from "lucide-react";
import { SITE_CONFIG, CONTACT_LINKS } from "@/lib/site-config";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary/90 mb-2 text-center">
        Get in touch
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        The quickest way to reach Charlie is WhatsApp or Messenger — that's where
        most customers message anyway. Prefer email? The form on the homepage
        works too, or drop us a line below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {CONTACT_LINKS.whatsappHref && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-xl">
                <MessageCircle className="h-5 w-5 text-primary" /> WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-3">Fastest for a quick question or a quote request.</p>
              <Link
                href={CONTACT_LINKS.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90"
              >
                Message on WhatsApp
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <Send className="h-5 w-5 text-primary" /> Messenger
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">Already in the Facebook group? Messenger is easiest.</p>
            <Link
              href={CONTACT_LINKS.messengerHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90"
            >
              Message on Messenger
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <Mail className="h-5 w-5 text-primary" /> Email
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-3">For detailed enquiries, forms and paperwork.</p>
            <a
              href={CONTACT_LINKS.emailHref}
              className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90"
            >
              {SITE_CONFIG.email}
            </a>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-2xl">
            <MapPin className="h-6 w-6 text-primary" /> Where we are
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Cruise Aboard is based in the UK, sailing mainly from Southampton.
            You won't find a high-street shop — nearly all our customers come
            through the <strong>{SITE_CONFIG.groupMembers}-member</strong> MSC Cruises
            UK Forum Facebook group and word of mouth. That's how we like it:
            one person, one phone, no call centres.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
