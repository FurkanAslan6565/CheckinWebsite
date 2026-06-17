import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-[120px] px-3.5 py-2.5 rounded-xl border bg-white text-slate-900 text-sm resize-y",
            "placeholder:text-slate-400 transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]/20 focus:border-[hsl(var(--accent-blue))]",
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
