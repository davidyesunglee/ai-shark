import { ShieldCheck, FileX2, EyeOff } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "256-bit encryption",
    detail: "Your upload is encrypted in transit",
  },
  {
    icon: FileX2,
    title: "Analyzed, never stored",
    detail: "Free preview files are discarded after scoring",
  },
  {
    icon: EyeOff,
    title: "Confidential",
    detail: "Never shared with lenders — used only to generate your score",
  },
];

export function TrustBadges() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      role="list"
      aria-label="Security and privacy guarantees"
      data-testid="trust-badges"
    >
      {BADGES.map(({ icon: Icon, title, detail }) => (
        <div
          key={title}
          role="listitem"
          className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3"
        >
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold leading-tight">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
