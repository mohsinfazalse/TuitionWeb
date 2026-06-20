import { supabase } from '@/lib/supabaseClient';
import TutorCard from '@/components/ui/tutorCard';
import { Skeleton } from '@/components/ui/skeleton';

// Force server‑side rendering for SEO
export const dynamic = 'force-dynamic';

export default async function TutorsPage() {
  // Fetch only verified tutors
  const { data: tutors, error } = await supabase
    .from('tutor_profiles')
    .select('id, full_name as name, profile_picture as avatar_url, hourly_rate, avg_rating')
    .eq('verification_status', 'approved');

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load tutors. Please try again later.
      </div>
    );
  }

  if (!tutors || tutors.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        No tutors available at the moment.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Available Tutors
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </div>
  );
}
