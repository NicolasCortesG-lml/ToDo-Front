"use client";

import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function Navbar() {

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login"; // Redirige al login después de cerrar sesión
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
          Tareas
        </Link>
        <Link href="/terms" className="hover:text-blue-200 transition">
          Términos
        </Link>
        <Link href="/privacy" className="hover:text-blue-200 transition">
          Política
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

