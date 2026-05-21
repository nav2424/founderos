"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFounderStore } from "@/store/use-founder-store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const resetToSeed = useFounderStore((s) => s.resetToSeed);
  const supabaseReady = isSupabaseConfigured();

  async function handleSignOut() {
    if (supabaseReady) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
  }

  return (
    <AppShell title="Settings" subtitle="Account & data">
      <div className="max-w-lg space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400">
              {supabaseReady
                ? "Connected — data syncs when signed in."
                : "Not configured. Copy .env.example to .env.local and add your keys."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-zinc-400">
              Reset local data to Natural Scents sample seed (does not affect
              Supabase if synced).
            </p>
            <Button variant="outline" onClick={resetToSeed}>
              Reset to sample data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
