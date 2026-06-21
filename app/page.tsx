import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <section className="text-center max-w-2xl px-4 py-12">
        <h1 className="text-5xl font-bold mb-4" style={{ color: '#0d9488' }}>
          Elevate Your Learning Experience
        </h1>
        <p className="text-lg mb-6">
          Connect with expert tutors, schedule sessions, and track progress—all in one premium platform.
        </p>
        <Link href="/signup">
          <Button variant="primary" className="px-8 py-3 text-lg">
            Get Started
          </Button>
        </Link>
      </section>
      <section className="w-full flex justify-center mt-8">
        <Image
          src="/hero.png"
          alt="Student with laptop illustration"
          width={800}
          height={500}
          priority
          className="object-contain"
        />
      </section>
    </main>
  );
}
