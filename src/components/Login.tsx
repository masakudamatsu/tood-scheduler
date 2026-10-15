"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold tracking-tight">To Do Scheduler</h1>
      <p className="mt-1 text-stone-600">Plan each day without overloading it.</p>

      {status === "sent" ? (
        <div className="mt-8 rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
          <p className="font-medium">Check your email.</p>
          <p className="mt-1 text-sm text-stone-600">
            We sent a sign-in link to <strong>{email}</strong>. Open it on this device.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-3 text-sm text-teal-700 underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Email me a sign-in link"}
          </button>
          {status === "error" && <p className="text-sm text-red-700">{message}</p>}
        </form>
      )}
    </main>
  );
}
