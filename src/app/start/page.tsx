import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { UsernameForm } from "@/components/player/username-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentPlayer } from "@/lib/player/current";

export const metadata: Metadata = {
  title: "Pick your username — Runaway",
};

export default async function StartPage() {
  if (await getCurrentPlayer()) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Pick your username</CardTitle>
          <CardDescription>
            Use the same one each time and your runs stay together. No password
            yet — accounts come later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsernameForm />
        </CardContent>
      </Card>
    </main>
  );
}
