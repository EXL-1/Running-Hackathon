"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="border-primary/30 bg-primary/10 text-primary rounded-2xl border px-4 py-4 text-center text-sm font-medium">
        You&apos;re on the list. Start warming up.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-eyebrow text-muted-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="bg-card h-12 rounded-full px-5"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 w-full rounded-full">
        Join the waitlist
      </Button>
      <p className="text-muted-foreground text-center text-xs">
        Nothing is stored yet — this form is a prototype.
      </p>
    </form>
  );
}
