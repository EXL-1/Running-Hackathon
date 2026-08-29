"use client";

import { Pause, Play, Volume2, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { coachVoiceClipPath, coachVoices, type CoachId } from "@shared/voices";

/** Landing-page framing for each voice; the lines themselves are shared. */
const blurbs: Partial<Record<CoachId, { tag: string; brief: string }>> = {
  "ex-female": {
    tag: "Most played",
    brief: "Approval, but only on her terms.",
  },
  "ex-male": {
    tag: "Gaslighting, but cardio",
    brief: "Certain you said a slower target. You didn't.",
  },
  mum: {
    tag: "Emotional damage: affectionate",
    brief: "Worried, proud, and asking about water.",
  },
  sergeant: {
    tag: "Volume warning",
    brief: "No excuses. None. Not even that one.",
  },
  nan: {
    tag: "Fan favourite",
    brief: "Sweet as anything. Absolutely feral about splits.",
  },
};

const voices = coachVoices
  .filter((voice) => voice.id in blurbs)
  .map((voice) => ({
    ...voice,
    tag: blurbs[voice.id]?.tag ?? "",
    brief: blurbs[voice.id]?.brief ?? "",
  }));

type Voice = (typeof voices)[number];

const SILENT_PREVIEW_MS = 2600;
const TICK_MS = 60;

export function VoiceSampler() {
  const [activeId, setActiveId] = useState(voices[0].id);
  const [playingId, setPlayingId] = useState<CoachId | null>(null);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  /** Set once a clip request fails, e.g. no API key configured on the server. */
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const ticks = useRef(0);

  const active = voices.find((voice) => voice.id === activeId) ?? voices[0];
  const line = active.lines[lineIndex % active.lines.length];

  useEffect(() => {
    const playback = audio;
    const interval = timer;

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }

      playback.current?.pause();
    };
  }, []);

  function stop() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }

    if (audio.current) {
      audio.current.pause();
      audio.current.src = "";
      audio.current = null;
    }

    setPlayingId(null);
    setProgress(0);
  }

  /** Waveform-only stand-in, used when the server can't produce audio. */
  function playSilently(voice: Voice) {
    ticks.current = 0;
    timer.current = setInterval(() => {
      ticks.current += 1;
      const ratio = (ticks.current * TICK_MS) / SILENT_PREVIEW_MS;

      if (ratio >= 1) {
        stop();
        return;
      }

      setProgress(ratio);
    }, TICK_MS);

    setPlayingId(voice.id);
  }

  function play(voice: Voice) {
    if (playingId === voice.id) {
      stop();
      return;
    }

    stop();
    setActiveId(voice.id);

    const next = voice.id === active.id ? lineIndex + 1 : 0;
    setLineIndex(next);

    if (audioUnavailable) {
      playSilently(voice);
      return;
    }

    const element = new Audio(
      coachVoiceClipPath(voice.id, next % voice.lines.length),
    );

    element.addEventListener("timeupdate", () => {
      if (element.duration > 0) {
        setProgress(element.currentTime / element.duration);
      }
    });
    element.addEventListener("ended", () => stop());
    element.addEventListener("error", () => {
      setAudioUnavailable(true);
      stop();
      playSilently(voice);
    });

    audio.current = element;
    setPlayingId(voice.id);

    void element.play().catch(() => {
      setAudioUnavailable(true);
      stop();
      playSilently(voice);
    });
  }

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
                  {voice.lines.length} lines
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
              <span>&ldquo;{line}&rdquo;</span>
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
            {audioUnavailable
              ? "Audio is offline right now, so this is the silent preview. Real ElevenLabs playback returns as soon as the voices are back."
              : "Real ElevenLabs voices. Press play again for the next line — cloning someone who genuinely annoys you comes later."}
          </p>
        </div>
      </div>
    </div>
  );
}
