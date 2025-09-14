
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
            Welcome to Get That Cruise!
          </p>
          <p>
            This is a placeholder page. You can add information about your company here.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
