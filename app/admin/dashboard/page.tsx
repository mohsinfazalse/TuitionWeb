import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton';

interface DashboardStats {
  totalUsers: number;
  totalTutors: number;
  pendingVerifications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        router.push('/auth/login');
        return;
      }
      // Ensure admin role
      const { data: adminInfo, error: adminErr } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.user.id)
        .single();
      if (adminErr || adminInfo?.role !== 'admin') {
        toast.error('Access denied');
        router.push('/');
        return;
      }

      const [{ count: usersCount }, { count: tutorsCount }, { count: pendingCount }] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('tutor_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('tutor_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending')
      ]);

      setStats({
        totalUsers: usersCount ?? 0,
        totalTutors: tutorsCount ?? 0,
        pendingVerifications: pendingCount ?? 0,
      });
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded border p-4 bg-background">
          <h2 className="text-lg font-medium">Total Users</h2>
          <p className="mt-2 text-3xl font-semibold text-primary-600">{stats.totalUsers}</p>
        </div>
        <div className="rounded border p-4 bg-background">
          <h2 className="text-lg font-medium">Total Tutors</h2>
          <p className="mt-2 text-3xl font-semibold text-primary-600">{stats.totalTutors}</p>
        </div>
        <div className="rounded border p-4 bg-background">
          <h2 className="text-lg font-medium">Pending Verifications</h2>
          <p className="mt-2 text-3xl font-semibold text-primary-600">{stats.pendingVerifications}</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => router.push('/admin/verification')}
          >
            Review Verifications
          </Button>
        </div>
      </div>
    </div>
  );
}
