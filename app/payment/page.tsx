"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const [method, setMethod] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handlePay = async () => {
    // Placeholder: In real implementation, call backend/payment API
    toast.success(`Payment of ${amount} via ${method} is not yet integrated.`);
    // Optionally redirect to a confirmation page
    router.push('/');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#0d9488' }}>
        Payment Checkout
      </h1>
      <div className="w-full max-w-sm space-y-4">
        <label className="block">
          <span className="text-gray-700">Amount (PKR)</span>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Payment Method</span>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-primary-600 focus:ring-primary-600"
            value={method}
            onChange={e => setMethod(e.target.value as any)}
          >
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">EasyPaisa</option>
          </select>
        </label>
        <Button variant="primary" className="w-full" onClick={handlePay} disabled={!amount}>
          Pay Now
        </Button>
      </div>
    </main>
  );
}
