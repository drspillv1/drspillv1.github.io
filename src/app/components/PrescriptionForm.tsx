import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function PrescriptionForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ff533cce/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ name, email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      setSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        setName('');
      }, 3000);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Prescription Pad */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-8 border-t-4 border-teal-500 relative">
        {/* Prescription Header */}
        <div className="border-b-2 border-zinc-800 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif text-xl text-white">Dr. Spill</h3>
              <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>License: #SP1LL2026</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Rx Symbol */}
        <div className="flex items-center gap-3 mb-6">
          <div className="text-4xl font-serif text-teal-400">℞</div>
          <div className="text-sm text-gray-300 italic">Prescription for Updates</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-mono">
              Patient Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="border-b-2 border-zinc-700 rounded-none border-x-0 border-t-0 px-0 focus-visible:ring-0 focus-visible:border-teal-500 bg-transparent font-mono text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-mono">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="border-b-2 border-zinc-700 rounded-none border-x-0 border-t-0 px-0 focus-visible:ring-0 focus-visible:border-teal-500 bg-transparent font-mono text-white placeholder:text-gray-500"
            />
          </div>

          <div className="pt-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-mono shadow-lg"
                disabled={submitted || isLoading}
              >
                {submitted ? '✓ Prescribed!' : isLoading ? 'Loading...' : 'Get Notified When We Launch'}
              </Button>
            </motion.div>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center mt-2"
            >
              {error}
            </motion.div>
          )}
        </form>

        {/* Doctor's signature */}
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <div className="text-right">
            <div className="font-serif text-lg text-gray-300 italic">Dr. Spill</div>
            <div className="text-xs text-gray-500 mt-1">Authorized Signature</div>
          </div>
        </div>

        {/* Prescription pad holes */}
        <div className="absolute left-4 top-8 bottom-8 flex flex-col justify-between">
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Success message */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-zinc-900/95 rounded-lg border border-zinc-800"
        >
          <div className="text-center">
            <div className="text-5xl mb-2">✓</div>
            <p className="text-lg font-medium text-teal-400">You're on the list!</p>
            <p className="text-sm text-gray-400 mt-1">We'll notify you when we launch.</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}