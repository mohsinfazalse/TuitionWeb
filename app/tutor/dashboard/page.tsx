"use client";
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Request {
  id: string;
  student_id: string;
  status: string;
  created_at: string;
}

export default function TutorDashboard() {
  const [requests, setRequests] = useState<Request[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        router.push('/auth/login');
        return;
      }
      const { data, error } = await supabase
        .from('student_requests')
        .select('*')
        .eq('tutor_id', user.user.id);
      if (error) {
        toast.error('Failed to load requests');
        return;
      }
      setRequests(data);

      // Realtime subscription
      const channel = supabase
        .channel('public:student_requests')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'student_requests', filter: `tutor_id=eq.${user.user.id}` },
          payload => {
            if (payload.eventType === 'INSERT') {
              setRequests(prev => (prev ? [...prev, payload.new as Request] : [payload.new as Request]));
            } else if (payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
              // Re-fetch for consistency
              supabase
                .from('student_requests')
                .select('*')
                .eq('tutor_id', user.user.id)
                .then(({ data, error }) => {
                  if (!error && data) setRequests(data);
                });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, newStatus: 'accepted' | 'declined') => {
    const { error } = await supabase
      .from('student_requests')
      .update({ status: newStatus })
      .eq('id', requestId);
    if (error) {
      toast.error('Unable to update request');
    } else {
      toast.success(`Request ${newStatus}`);
    }
  };

  if (!requests) {
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
      <h1 className="mb-6 text-2xl font-bold">Incoming Requests</h1>
      {requests.length === 0 ? (
        <p>No requests at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map(req => (
            <li key={req.id} className="rounded border p-4">
              <p className="mb-2">Student ID: {req.student_id}</p>
              <p className="mb-2">Status: {req.status}</p>
              <p className="mb-2">Created: {new Date(req.created_at).toLocaleString()}</p>
              {req.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button variant="primary" onClick={() => handleAction(req.id, 'accepted')}>
                    Accept
                  </Button>
                  <Button variant="secondary" onClick={() => handleAction(req.id, 'declined')}>
                    Decline
                  </Button>
                </div>
              )}
              {req.status === 'accepted' && (
                <Button variant="primary" onClick={() => router.push(`/tutor/request/${req.id}`)}>
                  View Details
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
