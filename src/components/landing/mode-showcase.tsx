"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Line = { at: string; pace: string; text: string };

const modes = {
  rival: {
    label: "Arch-enemy",
    tagline: "40 m behind and closing",
    tone: "Fires when your pace drops under your aim.",
    accent: "var(--rival)",
    lines: [
      { at: "0.4 km", pace: "5:12 /km", text: "Oh, you're running now? Since when?" },
      { at: "1.2 km", pace: "5:18 /km", text: "I'm gaining. You always did start too fast." },
      { at: "2.0 km", pace: "5:01 /km", text: "Nice split. Annoying. Keep it up and you lose me." },
      { at: "3.1 km", pace: "4:52 /km", text: "Fine. You escaped. This time." },
    ] satisfies Line[],
  },
  ally: {
    label: "Loved one",
    tagline: "PB in sight",
    tone: "Fires when you're on or ahead of your aim pace.",
    accent: "var(--ally)",
    lines: [
      { at: "0.4 km", pace: "4:58 /km", text: "Look at you go. Shoulders down, breathe." },
      { at: "1.2 km", pace: "4:55 /km", text: "That's your PB pace. Stay right there." },
      { at: "2.0 km", pace: "4:49 /km", text: "One more kilometre and Tuesday is history." },
      { at: "3.1 km", pace: "4:44 /km", text: "New personal best. I knew it." },
    ] satisfies Line[],
  },
};

export function ModeShowcase() {
  const [mode, setMode] = useState<keyof typeof modes>("rival");

  return (
    <Tabs value={mode} onValueChange={(value) => setMode(value as keyof typeof modes)}>
      <TabsList className="bg-secondary/60 mx-auto h-11 rounded-full p-1">
        <TabsTrigger value="rival" className="rounded-full px-6 text-sm">
          Arch-enemy
        </TabsTrigger>
        <TabsTrigger value="ally" className="rounded-full px-6 text-sm">
          Loved one
        </TabsTrigger>
      </TabsList>

      {Object.entries(modes).map(([key, value]) => (
        <TabsContent key={key} value={key} className="mt-8">
          <Card className="mx-auto max-w-2xl overflow-hidden py-0">
            <CardContent className="p-0">
              <div
                className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5"
                style={{
                  background: `linear-gradient(90deg, color-mix(in oklab, ${value.accent} 14%, transparent), transparent)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: value.accent }}
                  />
                  <div>
                    <p className="text-sm font-semibold">{value.tagline}</p>
                    <p className="text-muted-foreground text-xs">{value.tone}</p>
                  </div>
                </div>
                <span className="text-eyebrow text-muted-foreground">
                  {value.label} voice
                </span>
              </div>

              <ul className="divide-border divide-y">
                {value.lines.map((line) => (
                  <li key={line.at} className="flex items-start gap-4 px-6 py-4">
                    <span className="text-muted-foreground w-16 shrink-0 font-mono text-xs tabular-nums">
                      {line.at}
                    </span>
                    <p className="flex-1 text-sm text-pretty">{line.text}</p>
                    <span className="text-muted-foreground hidden shrink-0 font-mono text-xs tabular-nums sm:block">
                      {line.pace}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
