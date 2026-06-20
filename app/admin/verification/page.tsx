import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton';

interface TutorProfile {
  user_id: string;
  name: string;
  intro_video_url: string | null;
  verification_status: string;
}

export default function AdminVerification() {
  const [pendingTutors, setPendingTutors] = useState<TutorProfile[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPending = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        router.push('/auth/login');
        return;
      }
      // Ensure user is admin
      const { data: adminCheck, error: adminErr } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.user.id)
        .single();
      if (adminErr || adminCheck?.role !== 'admin') {
        toast.error('Access denied');
        router.push('/');
        return;
      }
      const { data, error } = await supabase
        .from('tutor_profiles')
        .select('user_id, name, intro_video_url, verification_status')
        .eq('verification_status', 'pending');
      if (error) {
        toast.error('Failed to load pending tutors');
        return;
      }
      setPendingTutors(data);
    };
    fetchPending();
  }, []);

  const handleDecision = async (tutorId: string, decision: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('tutor_profiles')
      .update({ verification_status: decision })
      .eq('user_id', tutorId);
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Tutor ${decision}`);
      // Refresh list
      setPendingTutors(prev => (prev ? prev.filter(t => t.user_id !== tutorId) : prev));
    }
  };

  if (!pendingTutors) {
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Pending Tutor Verifications</h1>
      {pendingTutors.length === 0 ? (
        <p>No pending tutors.</p>
      ) : (
        <ul className="space-y-4">
          {pendingTutors.map(tutor => (
            <li key={tutor.user_id} className="rounded border p-4">
              <p className="mb-2">Name: {tutor.name}</p>
              {tutor.intro_video_url && (
                <video className="mb-2" src={tutor.intro_video_url} controls width="200" />
              )}
              <div className="flex space-x-2">
                <Button variant="primary" onClick={() => handleDecision(tutor.user_id, 'approved')}>
                  Approve
                </Button>
                <Button variant="secondary" onClick={() => handleDecision(tutor.user_id, 'rejected')}>
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
