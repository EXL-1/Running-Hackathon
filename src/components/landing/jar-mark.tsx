import { cn } from "@/lib/utils";

/** The Peanut Butter jar-on-legs mark, mirroring the iOS JarLogo component. */
export function JarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={cn("size-8", className)}
      fill="none"
    >
      <g stroke="var(--jam)" strokeWidth="2.6" strokeLinecap="round">
        <path d="M3 15h6" />
        <path d="M1 22h5" />
        <path d="M4 29h6" />
      </g>
      <rect
        x="15"
        y="4"
        width="20"
        height="5.5"
        rx="2.2"
        fill="var(--roast)"
        transform="rotate(-8 25 6.75)"
      />
      <path
        d="M15 12h18a3 3 0 0 1 3 3v18a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V15a3 3 0 0 1 3-3Z"
        fill="var(--jam)"
      />
      <path
        d="M15 12h18a3 3 0 0 1 3 3v6H12v-6a3 3 0 0 1 3-3Z"
        fill="var(--butter)"
      />
      <g stroke="var(--roast)" strokeWidth="3" strokeLinecap="round">
        <path d="M19 38l-4 7" />
        <path d="M29 38l5 6" />
      </g>
    </svg>
  );
}
