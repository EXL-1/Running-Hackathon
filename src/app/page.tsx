import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-xl space-y-8">
        <div className="space-y-3">
          <Badge variant="secondary">Running Hackathon</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">
            Track your runs, together
          </h1>
          <p className="text-muted-foreground">
            Next.js, TypeScript, Tailwind CSS and shadcn/ui are wired up. Start
            building in{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
              src/app/page.tsx
            </code>
            .
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join the leaderboard</CardTitle>
            <CardDescription>
              Placeholder form to verify component styling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Runner name</Label>
              <Input id="name" placeholder="Ada Lovelace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Weekly distance (km)</Label>
              <Input id="distance" type="number" placeholder="42" />
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button>Save</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
