import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

// Zod schemas for student and tutor
const studentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const tutorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  hourlyRate: z.coerce.number().min(5),
  // video upload will be handled later
});

type StudentForm = z.infer<typeof studentSchema>;
type TutorForm = z.infer<typeof tutorSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'tutor'>('student');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentForm | TutorForm>({
    resolver: zodResolver(role === 'student' ? studentSchema : tutorSchema),
  });

  const onSubmit = async (data: any) => {
    // Sign up with Supabase Auth
    const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { role, name: data.name },
      },
    });
    if (signUpError) {
      toast.error(signUpError.message);
      return;
    }
    const userId = signUpData.user?.id;
    if (!userId) {
      toast.error('Unable to retrieve user ID after sign‑up');
      return;
    }
    // If tutor, handle video upload first
    let introVideoUrl: string | null = null;
    if (role === 'tutor' && data.introVideo && data.introVideo[0]) {
      const file = data.introVideo[0];
      // Enforce size limit (~50 MB)
      const MAX_SIZE = 50 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        toast.error('Intro video exceeds 50 MB size limit');
        return;
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_intro.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('intro-videos')
        .upload(fileName, file);
      if (uploadError) {
        toast.error('Video upload failed: ' + uploadError.message);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from('intro-videos')
        .getPublicUrl(fileName);
      introVideoUrl = publicUrlData?.publicUrl || null;
    }

    // Insert profile row based on role
    if (role === 'student') {
      await supabase.from('student_profiles').insert({
        user_id: userId,
        name: data.name,
      });
    } else {
      await supabase.from('tutor_profiles').insert({
        user_id: userId,
        name: data.name,
        hourly_rate: data.hourlyRate,
        intro_video_url: introVideoUrl,
        verification_status: 'pending',
      });
    }
    toast.success('Account created! Please check your email to confirm.');
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-primary-600 text-center">Sign Up</h2>
        <div className="flex justify-center space-x-4">
          <Button
            variant={role === 'student' ? 'primary' : 'secondary'}
            onClick={() => setRole('student')}
          >
            Student
          </Button>
          <Button
            variant={role === 'tutor' ? 'primary' : 'secondary'}
            onClick={() => setRole('tutor')}
          >
            Tutor
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Name"
            {...register('name')}
            error={errors.name?.message?.toString()}
          />
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            error={errors.email?.message?.toString()}
          />
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            error={errors.password?.message?.toString()}
          />
          {role === 'tutor' && (
          <>
            <Input
              type="number"
              placeholder="Hourly Rate (USD)"
              {...register('hourlyRate')}
              error={errors.hourlyRate?.message?.toString()}
            />
            <p className="text-sm text-gray-500 mb-2">
              Please upload a short introductory video (max 2 minutes, approx 50 MB).
            </p>
            <Input
              type="file"
              accept="video/*"
              {...register('introVideo')}
            />
          </>
        )}
          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating account…' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
}
