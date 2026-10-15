"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, isLocalMode } from "@/lib/supabaseClient";
import Login from "./Login";
import Scheduler from "./Scheduler";

export default function App() {
  // Dates depend on the user's time zone, so render only in the browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <p className="p-6 text-center text-stone-500">Loading…</p>;
  if (isLocalMode) return <Scheduler localMode />;
  return <AuthGate />;
}

function AuthGate() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <p className="p-6 text-center text-stone-500">Loading…</p>;
  }
  if (!session) return <Login />;
  return (
    <Scheduler
      key={session.user.id}
      userEmail={session.user.email}
      onSignOut={() => getSupabase().auth.signOut()}
    />
  );
}
