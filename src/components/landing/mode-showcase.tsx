"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Line = { at: string; text: string };

const modes = {
  chase: {
    label: "Chase mode",
    tagline: "Your ex is 40m behind you.",
    tone: "Petty, relentless, weirdly motivating.",
    lines: [
      { at: "0.4 km", text: "Oh, you're running now? Since when?" },
      { at: "1.2 km", text: "I'm gaining. You always did start too fast." },
      { at: "2.0 km", text: "Nice split. Annoying. Keep it up and you lose me." },
      { at: "3.1 km", text: "Fine. You escaped. This time." },
    ] satisfies Line[],
  },
  cheer: {
    label: "Cheer mode",
    tagline: "Your mum is in your ear.",
    tone: "Encouraging, gentle, packs snacks.",
    lines: [
      { at: "0.4 km", text: "Look at you go, love. Shoulders down." },
      { at: "1.2 km", text: "Lovely pace. Have a sip of water for me." },
      { at: "2.0 km", text: "One more kilometre and you've beaten Tuesday." },
      { at: "3.1 km", text: "Done! I'm so proud of you. Stretch, please." },
    ] satisfies Line[],
  },
};

export function ModeShowcase() {
  const [mode, setMode] = useState<keyof typeof modes>("chase");

  return (
    <Tabs value={mode} onValueChange={(value) => setMode(value as keyof typeof modes)}>
      <TabsList className="mx-auto">
        <TabsTrigger value="chase">Chase mode</TabsTrigger>
        <TabsTrigger value="cheer">Cheer mode</TabsTrigger>
      </TabsList>

      {Object.entries(modes).map(([key, value]) => (
        <TabsContent key={key} value={key} className="mt-6">
          <Card>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{value.tagline}</Badge>
                <span className="text-muted-foreground text-sm">
                  {value.tone}
                </span>
              </div>
              <ul className="space-y-3">
                {value.lines.map((line) => (
                  <li key={line.at} className="flex items-start gap-3">
                    <span className="text-muted-foreground w-16 shrink-0 font-mono text-xs tabular-nums">
                      {line.at}
                    </span>
                    <p className="bg-muted rounded-lg px-3 py-2 text-sm text-pretty">
                      {line.text}
                    </p>
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
