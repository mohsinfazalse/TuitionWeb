"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch user role
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        // Fallback to student dashboard if role not found
        router.push('/student/dashboard');
        return;
      }

      if (data.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.role === 'tutor') {
        router.push('/tutor/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    };

    checkUserAndRedirect();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="text-lg font-medium text-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
