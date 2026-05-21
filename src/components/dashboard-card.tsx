import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  empty?: boolean;
  emptyMessage?: string;
}

export function DashboardCard({
  title,
  action,
  children,
  className,
  empty,
  emptyMessage = "Nothing here yet",
}: DashboardCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-zinc-300">
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="text-sm text-zinc-600">{emptyMessage}</p>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
