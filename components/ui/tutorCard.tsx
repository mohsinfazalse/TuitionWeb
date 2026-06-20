import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export type Tutor = {
  id: string;
  name: string;
  avatar_url?: string;
  hourly_rate: number;
  avg_rating?: number;
};

type TutorCardProps = {
  tutor: Tutor | null; // null indicates loading state
};

export const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  if (!tutor) {
    return (
      <div className="rounded-lg border p-4 bg-white shadow">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-1/2 mt-4" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 bg-white shadow hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        {tutor.avatar_url ? (
          <Image
            src={tutor.avatar_url}
            alt={tutor.name}
            width={96}
            height={96}
            className="rounded-full"
          />
        ) : (
          <Skeleton className="h-24 w-24 rounded-full" />
        )}
        <div>
          <h3 className="text-xl font-semibold text-primary-600">{tutor.name}</h3>
          <p className="text-gray-600">${tutor.hourly_rate}/hr</p>
        </div>
      </div>
      {tutor.avg_rating && (
        <p className="text-sm text-gray-500 mb-2">Rating: {tutor.avg_rating.toFixed(1)} ⭐</p>
      )}
      <Link href={`/tutors/${tutor.id}`} passHref>
        <Button variant="primary" className="w-full">View Profile</Button>
      </Link>
    </div>
  );
};
