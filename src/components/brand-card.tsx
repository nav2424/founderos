import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@/lib/types";

interface BrandCardProps {
  brand: Brand;
  taskCount?: number;
  goalCount?: number;
}

export function BrandCard({ brand, taskCount = 0, goalCount = 0 }: BrandCardProps) {
  const revenue =
    brand.monthly_revenue >= 1000
      ? `$${(brand.monthly_revenue / 1000).toFixed(0)}k/mo`
      : `$${brand.monthly_revenue}/mo`;

  return (
    <Link href={`/brands/${brand.id}`}>
      <Card className="group transition-colors hover:border-emerald-500/30 hover:bg-zinc-900/60">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                {brand.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                {brand.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{brand.stage}</Badge>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {revenue}
            </span>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-zinc-500">
            <span>{taskCount} active tasks</span>
            <span>{goalCount} goals</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
