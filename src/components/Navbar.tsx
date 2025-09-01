"use client";

import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function Navbar() {

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="w-full bg-[#0D47A1] text-white p-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold text-white flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <span>ToDo-AI</span>
        </Link>
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-blue-200 transition">
          Tasks
        </Link>
        <Link href="/terms" className="hover:text-blue-200 transition">
          Terms
        </Link>
        <Link href="/privacy" className="hover:text-blue-200 transition">
          Privacy
        </Link>
        <button
          onClick={handleLogout}
          className="bg-[#D32F2F] text-white px-3 py-1 rounded font-bold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

