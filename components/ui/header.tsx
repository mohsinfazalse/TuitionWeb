// components/ui/header.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { supabase } from '@/lib/supabaseClient';

/**
 * Header with logo, navigation links and a dark‑mode toggle.
 */
export default function Header() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        if (!error && data) setRole(data.role);
      }
    };
    fetchRole();
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-background p-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-semibold text-foreground">
          Mini‑Tuition
        </Link>
      </div>
      <nav className="flex items-center gap-4">
        <Link href="/" className="text-foreground hover:underline">
          Home
        </Link>
        <Link href="/dashboard" className="text-foreground hover:underline">
          Dashboard
        </Link>
        <Link href="/faq" className="text-foreground hover:underline">
          FAQ
        </Link>
        {role === 'admin' && (
          <Link href="/admin/dashboard" className="text-foreground hover:underline">
            Admin
          </Link>
        )}
        <Button variant="secondary" onClick={toggleTheme} className="flex items-center gap-1">
          {theme === "dark" ? "Light" : "Dark"} Mode
        </Button>
      </nav>
    </header>
  );
}
