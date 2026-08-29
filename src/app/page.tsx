import {
  Activity,
  Flame,
  Gauge,
  MapPin,
  Mic,
  Timer,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { ModeShowcase } from "@/components/landing/mode-showcase";
import { PaceTimeline } from "@/components/landing/pace-timeline";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const heroStats = [
  { label: "Aim pace", value: "5:00", unit: "/km" },
  { label: "Current", value: "4:44", unit: "/km" },
  { label: "PB delta", value: "−0:19", unit: "faster" },
];

const features = [
  {
    icon: Gauge,
    title: "Aim pace, set once",
    description:
      "Pick the pace that beats your PB and how often you want to hear about it. Everything else reacts to that number.",
  },
  {
    icon: Mic,
    title: "Two voices, one job",
    description:
      "Drop off pace and your arch-enemy closes in. Hold it and someone who loves you talks you through the last kilometre.",
  },
  {
    icon: MapPin,
    title: "Knows where you are",
    description:
      "Narration is location aware, so the hill, the bridge and the last corner all get their own line.",
  },
  {
    icon: TrendingUp,
    title: "Proof, not vibes",
    description:
      "The post-run timeline marks every prompt against your pace, so you can see exactly what moved you.",
  },
  {
    icon: Flame,
    title: "Streaks that mean something",
    description:
      "A streak counts only when you hold your aim pace. Slow weeks stay honest.",
  },
  {
    icon: Trophy,
    title: "Every PB, logged",
    description:
      "Distance, split and voice mode for each personal best, side by side with the run that beat it.",
  },
];

const steps = [
  {
    title: "Set your aim",
    description:
      "Target pace, prompt cadence, and the two voices that will ride with you.",
  },
  {
    title: "Run it",
    description:
      "GPS watches your pace in real time and cues the right voice at the right metre.",
  },
  {
    title: "See what moved you",
    description:
      "Your pace timeline, every prompt marked, and the seconds you took off your PB.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-xl">
              <Activity className="size-4.5" strokeWidth={2.75} />
            </span>
            Peanut Butter
          </span>
          <nav className="text-muted-foreground hidden items-center gap-8 text-sm md:flex">
            <a href="#voices" className="hover:text-foreground transition-colors">
              Voices
            </a>
            <a href="#proof" className="hover:text-foreground transition-colors">
              Proof
            </a>
            <a href="#how" className="hover:text-foreground transition-colors">
              How it works
            </a>
          </nav>
          <Button size="sm" className="rounded-full px-5" asChild>
            <a href="#waitlist">Get early access</a>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden">
          <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
          <div
            className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Badge
                variant="secondary"
                className="rounded-full border-primary/30 bg-primary/10 text-primary px-3 py-1"
              >
                <Timer className="size-3.5" />
                Voice-led pace coaching
              </Badge>
              <h1 className="mt-6 text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Be your
                <br />
                <span className="text-primary">personal best.</span>
              </h1>
              <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed text-pretty">
                Peanut Butter puts two voices on your run. Drift under your aim
                pace and your arch-enemy gains ground. Hold it, and someone who
                loves you carries you to the PB.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="rounded-full px-7" asChild>
                  <a href="#waitlist">Chase a PB</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7"
                  asChild
                >
                  <a href="#voices">Hear the voices</a>
                </Button>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="bg-card px-5 py-4">
                    <dt className="text-eyebrow text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 font-mono text-2xl tracking-tight tabular-nums">
                      {stat.value}
                      <span className="text-muted-foreground ml-1 text-xs font-sans">
                        {stat.unit}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="glow-primary bg-card relative overflow-hidden rounded-[2.5rem] border p-6">
                <div className="flex items-center justify-between">
                  <span className="text-eyebrow text-muted-foreground">
                    In run · 3.42 km
                  </span>
                  <span className="text-primary flex items-center gap-1.5 text-xs font-medium">
                    <span className="bg-primary size-1.5 animate-pulse rounded-full" />
                    Live
                  </span>
                </div>

                <div className="mt-8 text-center">
                  <p className="font-mono text-6xl leading-none tracking-tighter tabular-nums">
                    4:44
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    current pace /km
                  </p>
                  <div className="bg-secondary mt-6 h-2 overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-[78%] rounded-full" />
                  </div>
                  <p className="text-muted-foreground mt-2 font-mono text-xs tabular-nums">
                    78% to PB pace
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="bg-secondary/60 flex items-start gap-3 rounded-2xl border-l-2 px-4 py-3 border-l-[var(--ally)]">
                    <span className="text-eyebrow text-muted-foreground mt-0.5 font-mono">
                      3.4
                    </span>
                    <p className="text-sm text-pretty">
                      &ldquo;You&apos;re 19 seconds up. Finish it.&rdquo;
                    </p>
                  </div>
                  <div className="bg-secondary/40 flex items-start gap-3 rounded-2xl border-l-2 px-4 py-3 border-l-[var(--rival)]">
                    <span className="text-eyebrow text-muted-foreground mt-0.5 font-mono">
                      2.1
                    </span>
                    <p className="text-muted-foreground text-sm text-pretty">
                      &ldquo;Slowing already? I&apos;m 40 metres back.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="voices" className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="text-center">
            <p className="text-eyebrow text-primary">Two poles</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
              One is chasing. One is cheering.
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-pretty">
              Distance is pace. Slow down and the arch-enemy&apos;s voice gets
              closer; hold your aim and the other voice takes over.
            </p>
          </div>
          <div className="mt-12">
            <ModeShowcase />
          </div>
        </section>

        <section id="proof" className="border-y bg-card/30">
          <div className="mx-auto w-full max-w-5xl px-6 py-24">
            <div className="text-center">
              <p className="text-eyebrow text-primary">The north star</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
                See exactly what moved your pace.
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-pretty">
                Every prompt is marked on your post-run pace timeline. If a
                taunt or a word of encouragement changed your split, it shows.
              </p>
            </div>
            <div className="mt-12">
              <PaceTimeline />
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto w-full max-w-6xl px-6 py-24">
          <h2 className="text-4xl font-semibold tracking-tight text-balance">
            Three steps, one run.
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="bg-card space-y-3 px-7 py-8">
                <span className="text-primary/40 font-mono text-4xl tabular-nums">
                  0{index + 1}
                </span>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground text-sm text-pretty">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="bg-card/60 hover:border-primary/40 transition-colors"
              >
                <CardHeader>
                  <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="mt-4 text-base">{title}</CardTitle>
                  <CardDescription className="sr-only">{title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="waitlist" className="relative overflow-hidden border-t">
          <div
            className="pointer-events-none absolute -bottom-52 left-1/2 size-[40rem] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-xl px-6 py-24 text-center">
            <p className="text-eyebrow text-primary">Early access</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
              Your next PB is the first one we log.
            </h2>
            <p className="text-muted-foreground mt-4 text-pretty">
              Leave your email and we&apos;ll tell you when the first routes go
              live.
            </p>
            <div className="mt-10 text-left">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-foreground flex items-center gap-2 font-medium">
            <Activity className="text-primary size-4" strokeWidth={2.75} />
            Peanut Butter
          </span>
          <span>Be your personal best. Run responsibly, look up.</span>
        </div>
      </footer>
    </div>
  );
}
