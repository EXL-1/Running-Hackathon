const sources = [
  {
    app: "WhatsApp",
    steps:
      "Open the chat, hold the voice note, tap Share (iOS) or Forward → Save (Android) and send it to yourself or to Files.",
  },
  {
    app: "iMessage / Voice Memos",
    steps:
      "Hold the audio message, tap Save, then find it in Voice Memos and share it as a file.",
  },
  {
    app: "Instagram / Messenger",
    steps:
      "Screen-record the voice note, then save the recording — the audio comes across with it.",
  },
  {
    app: "Anything else",
    steps: "Any mp3, m4a, wav or ogg file works. So does a video.",
  },
];

export function VoiceSampleHelp() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="text-muted-foreground">
        Peanut Butter needs one clip of them talking — a voice note is perfect. Save it
        to your phone or computer, then drop it in below.
      </p>
      <ul className="divide-border divide-y">
        {sources.map((source) => (
          <li key={source.app} className="py-2">
            <p className="font-medium">{source.app}</p>
            <p className="text-muted-foreground">{source.steps}</p>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground">
        Only upload a voice you have permission to use. The clip stays private —
        we send it to ElevenLabs to build the voice and nothing else.
      </p>
    </div>
  );
}
