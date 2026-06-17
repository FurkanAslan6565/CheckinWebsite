import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-blue-50 text-[hsl(var(--accent-blue))]",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 font-[family-name:var(--font-heading)]">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "text-xs font-medium",
                changeType === "positive" && "text-emerald-600",
                changeType === "negative" && "text-red-600",
                changeType === "neutral" && "text-slate-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
