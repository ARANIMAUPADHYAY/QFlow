const tones = {
  sage: "bg-sage/70 text-ink",
  peach: "bg-peach/80 text-ink",
  mustard: "bg-mustard/80 text-ink",
  cream: "bg-cream text-ink-soft",
  closed: "bg-line text-ink-soft",
} as const;

export function Badge({
  children,
  tone = "sage",
}: {
  children: string;
  tone?: keyof typeof tones;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
