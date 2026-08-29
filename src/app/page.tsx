import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Running Hackathon</CardTitle>
          <CardDescription>
            Next.js, TypeScript, Tailwind and shadcn/ui are wired up.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Your name" />
          <Button className="w-full">Get started</Button>
        </CardContent>
      </Card>
    </main>
  );
}
