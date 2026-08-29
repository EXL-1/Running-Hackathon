import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  pitch: string;
  cta: string;
  featured?: boolean;
  features: string[];
};

/** Placeholder pricing — numbers are made up until we work out what a taunt costs. */
const tiers: Tier[] = [
  {
    name: "Smooth",
    price: "£0",
    cadence: "forever",
    pitch: "For runners who are not ready to be shouted at yet.",
    cta: "Start free",
    features: [
      "GPS pace coaching",
      "Two starter voices: Mum and Classic Coach",
      "Post-run pace timeline",
      "One personal best on file",
    ],
  },
  {
    name: "Crunchy",
    price: "£6",
    cadence: "per month",
    pitch: "The Ex is unlocked. Your splits will never recover.",
    cta: "Get Crunchy",
    featured: true,
    features: [
      "Every voice, including The Ex and Drill Sergeant",
      "Arch-enemy proximity: they close in as you slow down",
      "Unlimited PBs, streaks that only count on-pace weeks",
      "Strava and Apple Health sync",
    ],
  },
  {
    name: "Extra Crunchy",
    price: "£12",
    cadence: "per month",
    pitch: "Clone a real voice. Regret it responsibly.",
    cta: "Go too far",
    features: [
      "Voice cloning via ElevenLabs, once that lands",
      "Both Exes, so you can be haunted in stereo",
      "Custom taunt scripts and landmark call-outs",
      "Four seats, for a family that races each other",
    ],
  },
];

export function PricingTable() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "bg-card/60 relative flex flex-col rounded-3xl border p-7",
            tier.featured && "glow-primary bg-card border-primary/40",
          )}
        >
          {tier.featured ? (
            <span className="bg-primary text-primary-foreground absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-medium">
              Most spread
            </span>
          ) : null}

          <p className="font-display text-2xl">{tier.name}</p>
          <p className="text-muted-foreground mt-1 text-sm text-pretty">
            {tier.pitch}
          </p>

          <p className="mt-6 flex items-baseline gap-2">
            <span className="font-mono text-4xl tracking-tight tabular-nums">
              {tier.price}
            </span>
            <span className="text-muted-foreground text-sm">
              {tier.cadence}
            </span>
          </p>

          <ul className="mt-7 flex-1 space-y-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <Check
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    tier.featured ? "text-primary" : "text-[var(--ally)]",
                  )}
                />
                <span className="text-pretty">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className="mt-8 rounded-full"
            variant={tier.featured ? "default" : "outline"}
            asChild
          >
            <a href="#waitlist">{tier.cta}</a>
          </Button>
        </div>
      ))}
    </div>
  );
}
