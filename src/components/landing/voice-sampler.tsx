"use client";

import { Pause, Play, Volume2, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Voice = {
  id: string;
  name: string;
  tag: string;
  pole: "rival" | "ally";
  brief: string;
  duration: string;
  lines: string[];
};

const voices: Voice[] = [
  {
    id: "ex-female",
    name: "The Ex (female)",
    tag: "Most played",
    pole: "rival",
    brief: "Approval, but only on her terms.",
    duration: "0:07",
    lines: [
      "You've never been fit enough for me. But keep going, it's sweet.",
      "I'd say I'm proud of you, but you'd only slow down.",
      "See, you can do it. You just needed me to be disappointed first.",
    ],
  },
  {
    id: "ex-male",
    name: "The Ex (male)",
    tag: "Gaslighting, but cardio",
    pole: "rival",
    brief: "Certain you said a slower target. You didn't.",
    duration: "0:07",
    lines: [
      "You said five minutes a kilometre. No — you said five thirty. I remember.",
      "Calm down. I'm being supportive. This is supportive.",
      "That wasn't your PB. You're thinking of a different run.",
    ],
  },
  {
    id: "mum",
    name: "Mum",
    tag: "Emotional damage: affectionate",
    pole: "ally",
    brief: "Worried, proud, and asking about water.",
    duration: "0:09",
    lines: [
      "Have you had water? No? Have water.",
      "You're doing so well. I've told the whole street.",
      "One more kilometre and then a proper dinner, please.",
    ],
  },
  {
    id: "sergeant",
    name: "Drill Sergeant",
    tag: "Volume warning",
    pole: "rival",
    brief: "No excuses. None. Not even that one.",
    duration: "0:05",
    lines: [
      "That hill has a name and the name is YOURS.",
      "You slowed down. I felt it. The satellites felt it.",
      "Move those legs before I come round there.",
    ],
  },
  {
    id: "nan",
    name: "Nan, Unhinged",
    tag: "Fan favourite",
    pole: "ally",
    brief: "Sweet as anything. Absolutely feral about splits.",
    duration: "0:08",
    lines: [
      "Lovely form, darling. Now destroy him.",
      "I've put a fiver on you. Do not embarrass me.",
      "There's a scone at the end of this. Earn the scone.",
    ],
  },
];

const PREVIEW_MS = 2600;
const TICK_MS = 60;

export function VoiceSampler() {
  const [activeId, setActiveId] = useState(voices[0].id);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const ticks = useRef(0);

  const active = voices.find((voice) => voice.id === activeId) ?? voices[0];

  useEffect(
    () => () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    },
    [],
  );

  function stop() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setPlayingId(null);
    setProgress(0);
  }

  function play(voice: Voice) {
    if (playingId === voice.id) {
      stop();
      return;
    }

    stop();
    setActiveId(voice.id);
    setPlayingId(voice.id);

    ticks.current = 0;
    timer.current = setInterval(() => {
      ticks.current += 1;
      const ratio = (ticks.current * TICK_MS) / PREVIEW_MS;

      if (ratio >= 1) {
        stop();
        return;
      }

      setProgress(ratio);
    }, TICK_MS);
  }

  const lineIndex = Math.min(
    active.lines.length - 1,
    Math.floor(progress * active.lines.length),
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <ul className="divide-border bg-card/60 divide-y overflow-hidden rounded-3xl border">
        {voices.map((voice) => {
          const isPlaying = playingId === voice.id;
          const accent =
            voice.pole === "rival" ? "var(--rival)" : "var(--ally)";

          return (
            <li key={voice.id}>
              <button
                type="button"
                onClick={() => play(voice)}
                aria-pressed={isPlaying}
                className={cn(
                  "hover:bg-secondary/50 flex w-full items-center gap-4 px-5 py-4 text-left transition-colors",
                  voice.id === active.id && "bg-secondary/40",
                )}
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `color-mix(in oklab, ${accent} 18%, transparent)`,
                    color: accent,
                  }}
                >
                  {isPlaying ? (
                    <Pause className="size-4.5" />
                  ) : (
                    <Play className="size-4.5" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base">{voice.name}</span>
                    <Badge
                      variant="secondary"
                      className="bg-secondary/70 text-muted-foreground rounded-full px-2 py-0 text-[0.65rem] font-medium"
                    >
                      {voice.tag}
                    </Badge>
                  </span>
                  <span className="text-muted-foreground mt-0.5 block truncate text-sm">
                    {voice.brief}
                  </span>
                </span>
                <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                  {voice.duration}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="bg-card flex flex-col gap-6 rounded-3xl border p-6">
        <div className="flex items-center justify-between">
          <span className="text-eyebrow text-muted-foreground">
            Now previewing
          </span>
          <span
            className="text-xs font-medium"
            style={{
              color: active.pole === "rival" ? "var(--rival)" : "var(--ally)",
            }}
          >
            {active.pole === "rival" ? "Chasing you" : "Cheering you"}
          </span>
        </div>

        <div>
          <p className="font-display text-3xl leading-tight">{active.name}</p>
          <p className="text-muted-foreground mt-1 text-sm text-pretty">
            {active.brief}
          </p>
        </div>

        <div className="bg-secondary/50 rounded-2xl px-5 py-4">
          <div className="flex h-10 items-end gap-1">
            {Array.from({ length: 32 }).map((_, index) => {
              const reached = playingId !== null && index / 32 <= progress;
              const height = Math.round(
                18 + Math.abs(Math.sin(index * 1.7)) * 82,
              );

              return (
                <span
                  key={index}
                  className="flex-1 rounded-full transition-[height,background-color] duration-150"
                  style={{
                    height: `${playingId === null ? height * 0.5 : height}%`,
                    backgroundColor: reached
                      ? active.pole === "rival"
                        ? "var(--rival)"
                        : "var(--ally)"
                      : "color-mix(in oklab, var(--foreground) 14%, transparent)",
                  }}
                />
              );
            })}
          </div>
          <p className="mt-4 min-h-12 text-sm leading-relaxed text-pretty">
            {playingId === null ? (
              <span className="text-muted-foreground">
                Press play on a voice. Nothing bad will happen, probably.
              </span>
            ) : (
              <span>&ldquo;{active.lines[lineIndex]}&rdquo;</span>
            )}
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <Button
            className="w-full rounded-full"
            onClick={() => play(active)}
            variant={playingId === active.id ? "outline" : "default"}
          >
            <Volume2 className="size-4" />
            {playingId === active.id ? "Stop the voice" : `Hear ${active.name}`}
          </Button>
          <p className="text-muted-foreground flex items-start gap-2 text-xs leading-relaxed">
            <Wand2 className="mt-0.5 size-3.5 shrink-0" />
            Placeholder preview. Real audio arrives with the ElevenLabs
            integration, along with cloning the voice of someone who genuinely
            annoys you.
          </p>
        </div>
      </div>
    </div>
  );
}
