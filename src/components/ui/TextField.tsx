import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({ label, id, className = "", ...props }: TextFieldProps) {
  const fieldId = id ?? props.name ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="block text-sm" htmlFor={fieldId}>
      <span className="mb-1.5 block font-medium text-ink-soft">{label}</span>
      <input
        id={fieldId}
        className={`w-full rounded-2xl border border-line bg-card px-4 py-3 text-base text-ink outline-none placeholder:text-olive/80 focus:border-sage-deep focus:ring-2 focus:ring-sage ${className}`}
        {...props}
      />
    </label>
  );
}
