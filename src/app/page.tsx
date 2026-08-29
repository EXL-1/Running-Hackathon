import { Footprints, Ghost, HeartHandshake, Mic, Trophy, Zap } from "lucide-react";

import { ModeShowcase } from "@/components/landing/mode-showcase";
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
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: Mic,
    title: "Voices in your ears",
    description:
      "Your run is narrated in real time. Pick who is chasing you, and hear them react to your pace, splits and shortcuts.",
  },
  {
    icon: Zap,
    title: "Chases and challenges",
    description:
      "Sprint intervals become escapes. Slow down and they gain on you; speed up and you break away.",
  },
  {
    icon: Trophy,
    title: "Points and streaks",
    description:
      "Every escape banks points. Keep a streak alive across the week to unlock new voices and routes.",
  },
];

const steps = [
  {
    title: "Pick your voice",
    description: "Choose Chase mode or Cheer mode before you head out.",
  },
  {
    title: "Start running",
    description:
      "Your phone tracks pace and distance, and the story reacts as you move.",
  },
  {
    title: "Escape or finish strong",
    description:
      "Outrun what is behind you, or get talked through the last kilometre.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 font-semibold">
            <Footprints className="size-5" />
            Runaway
          </span>
          <Button size="sm" asChild>
            <a href="#waitlist">Join the waitlist</a>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-5xl px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-6">
            Built at the Brussels hackathon
          </Badge>
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
            Run away from your ex.
            <br />
            Or run home to your mum.
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-pretty">
            Runaway turns your run into a chase. One mode puts your ex&apos;s voice
            behind you and dares you to escape. The other puts your mum in your
            ear, cheering you all the way to the finish.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#waitlist">Get early access</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#modes">See both modes</a>
            </Button>
          </div>
        </section>

        <Separator />

        <section id="modes" className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Two ways to run
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-center text-pretty">
            Same run, very different company.
          </p>
          <div className="mt-10">
            <ModeShowcase />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <Ghost className="text-muted-foreground size-5" />
                <CardTitle>Chase mode</CardTitle>
                <CardDescription>
                  They are 40 metres behind you and gaining. Every time your pace
                  drops, they get closer and louder.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <HeartHandshake className="text-muted-foreground size-5" />
                <CardTitle>Cheer mode</CardTitle>
                <CardDescription>
                  No one is chasing you. You get encouragement, pacing tips and a
                  reminder to drink some water.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="space-y-2">
                <span className="bg-muted flex size-8 items-center justify-center rounded-full text-sm font-medium">
                  {index + 1}
                </span>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-muted-foreground text-sm text-pretty">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <Separator />

        <section className="mx-auto w-full max-w-5xl px-6 py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="text-muted-foreground size-5" />
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm text-pretty">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        <section id="waitlist" className="mx-auto w-full max-w-xl px-6 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Be first to be chased
          </h2>
          <p className="text-muted-foreground mt-3 text-center text-pretty">
            Leave your email and we will let you know when the first routes go
            live.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto w-full max-w-5xl px-6 py-6 text-sm">
          Runaway — a hackathon project. Run responsibly, look where you are
          going.
        </div>
      </footer>
    </div>
  );
}
