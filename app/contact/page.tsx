import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Placeholder: In a real app, send to backend/email service
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    setSubmitting(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-8 text-foreground">
      <h1 className="mb-6 text-3xl font-bold text-primary-600">Contact Us</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <Input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="primary" disabled={submitting} className="w-full">
          {submitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </main>
  );
}
