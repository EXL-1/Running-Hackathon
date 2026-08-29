import { Card, CardContent } from "@/components/ui/card";

type Sample = { km: number; pace: number };
type Marker = { km: number; voice: "rival" | "ally"; label: string };

const AIM_PACE = 300;
const MIN_PACE = 270;
const MAX_PACE = 330;

const samples: Sample[] = [
  { km: 0, pace: 306 },
  { km: 0.5, pace: 312 },
  { km: 1, pace: 318 },
  { km: 1.5, pace: 310 },
  { km: 2, pace: 301 },
  { km: 2.5, pace: 296 },
  { km: 3, pace: 292 },
  { km: 3.5, pace: 298 },
  { km: 4, pace: 289 },
  { km: 4.5, pace: 284 },
  { km: 5, pace: 279 },
];

const markers: Marker[] = [
  { km: 1, voice: "rival", label: "“I’m gaining on you.”" },
  { km: 2.5, voice: "ally", label: "“That’s the pace. Hold it.”" },
  { km: 3.5, voice: "rival", label: "“Ten metres closer.”" },
  { km: 4.5, voice: "ally", label: "“PB is yours. Go.”" },
];

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = 16;

function x(km: number) {
  return PADDING + (km / 5) * (WIDTH - PADDING * 2);
}

function y(pace: number) {
  const ratio = (pace - MIN_PACE) / (MAX_PACE - MIN_PACE);
  return PADDING + ratio * (HEIGHT - PADDING * 2);
}

function paceAt(km: number) {
  const sample = samples.find((item) => item.km === km);
  return sample ? sample.pace : AIM_PACE;
}

const line = samples.map((s) => `${x(s.km)},${y(s.pace)}`).join(" ");
const area = `${line} ${x(5)},${HEIGHT - PADDING} ${x(0)},${HEIGHT - PADDING}`;

export function PaceTimeline() {
  return (
    <Card className="glow-primary overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b px-6 py-5">
          <div>
            <p className="text-eyebrow text-muted-foreground">Last run</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">
              5.00 km · 24:41
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-eyebrow text-muted-foreground">Avg pace</p>
              <p className="mt-1 font-mono text-lg tabular-nums">4:56 /km</p>
            </div>
            <div>
              <p className="text-eyebrow text-muted-foreground">vs PB</p>
              <p className="text-primary mt-1 font-mono text-lg tabular-nums">
                −0:19
              </p>
            </div>
          </div>
        </div>

        <div className="px-2 pt-4">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-56 w-full"
            role="img"
            aria-label="Pace timeline with voice prompt markers"
          >
            <defs>
              <linearGradient id="paceFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.28"
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <polygon points={area} fill="url(#paceFill)" />

            <line
              x1={PADDING}
              x2={WIDTH - PADDING}
              y1={y(AIM_PACE)}
              y2={y(AIM_PACE)}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 6"
              strokeWidth="1"
            />
            <text
              x={PADDING + 4}
              y={y(AIM_PACE) - 8}
              textAnchor="start"
              className="fill-muted-foreground font-mono text-[11px]"
            >
              aim 5:00 /km
            </text>

            <polyline
              points={line}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {markers.map((marker) => (
              <g key={`${marker.km}-${marker.voice}`}>
                <line
                  x1={x(marker.km)}
                  x2={x(marker.km)}
                  y1={y(paceAt(marker.km))}
                  y2={HEIGHT - PADDING}
                  stroke={
                    marker.voice === "rival" ? "var(--rival)" : "var(--ally)"
                  }
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />
                <circle
                  cx={x(marker.km)}
                  cy={y(paceAt(marker.km))}
                  r="6"
                  fill="var(--card)"
                  stroke={
                    marker.voice === "rival" ? "var(--rival)" : "var(--ally)"
                  }
                  strokeWidth="3"
                />
              </g>
            ))}
          </svg>
        </div>

        <ul className="grid gap-px border-t bg-border sm:grid-cols-2">
          {markers.map((marker) => (
            <li
              key={marker.label}
              className="bg-card flex items-center gap-3 px-6 py-4"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    marker.voice === "rival" ? "var(--rival)" : "var(--ally)",
                }}
              />
              <span className="text-muted-foreground w-14 shrink-0 font-mono text-xs tabular-nums">
                {marker.km.toFixed(1)} km
              </span>
              <span className="text-sm text-pretty">{marker.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
