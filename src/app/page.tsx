import Link from "next/link";
import { ArrowRight, BarChart3, CheckSquare, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  let isLoggedIn = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Supabase not configured — show public landing
  }

  if (isLoggedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">FounderOS</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-400">
            Web app · Solo founder command center
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Run every brand from one browser dashboard
          </h1>
          <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
            FounderOS is a web-based operating system for managing goals, tasks,
            KPIs, ideas, reminders, and weekly reviews across all your brands —
            no install required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Open in browser <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: CheckSquare,
              title: "Tasks & priorities",
              desc: "Kanban, impact scoring, multi-brand filters",
            },
            {
              icon: Target,
              title: "Goals & KPIs",
              desc: "Track revenue, growth metrics, and what matters",
            },
            {
              icon: BarChart3,
              title: "Weekly execution",
              desc: "Reviews, reminders, playbooks, quick capture",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
            >
              <Icon className="h-5 w-5 text-emerald-400" />
              <h3 className="mt-3 font-medium">{title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-600">
        Use in Chrome, Safari, or any browser — desktop or mobile.
      </footer>
    </div>
  );
}
