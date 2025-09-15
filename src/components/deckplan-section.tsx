import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DeckplanSectionProps {
  pdfUrl: string;
}

export function DeckplanSection({ pdfUrl }: DeckplanSectionProps) {
  return (
    <Card className="mt-8 border-none shadow-none">
      <CardContent className="text-center p-6 bg-secondary/30 rounded-lg">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/80">
          Deckplans
        </h3>
        <h2 className="font-headline text-2xl font-bold text-primary/90 mt-2">
          Find your ideal cabin
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
          Use the deck plans to choose your favourite cabin. The plan allows you
          to pinpoint the locations, while the colours distinguish the cabin
          category.
        </p>
        <Button asChild size="lg" className="mt-6 bg-destructive text-destructive-foreground hover:bg-destructive/90">
          <Link href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <FileText className="mr-2 h-5 w-5" />
            Open Deckplans
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
