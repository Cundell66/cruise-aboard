
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface ShipStat {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface ShipStatsProps {
  title: string;
  subtitle: string;
  stats: ShipStat[];
}

export function ShipStats({ title, subtitle, stats }: ShipStatsProps) {
  return (
    <Card className="mt-8 border-none shadow-none">
      <CardHeader className="text-center p-2">
        <CardTitle className="font-headline text-2xl font-semibold text-primary/90">
          {title}
        </CardTitle>
        <p className="text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <stat.icon className="h-10 w-10 text-primary mb-3" />
              <p className="font-headline text-3xl font-bold text-primary/90">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
