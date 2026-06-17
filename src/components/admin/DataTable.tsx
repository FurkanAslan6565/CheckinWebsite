"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage,
  onRowClick,
}: DataTableProps<T>) {
  const t = useTranslations("admin.common");
  const message = emptyMessage ?? t("empty");

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
        <p className="text-slate-500">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors duration-150",
                  onRowClick && "cursor-pointer hover:bg-slate-50/80"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-6 py-4 text-sm", col.className)}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
