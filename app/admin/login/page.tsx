'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase/client';

// Define strict validation schema using Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setErrorMessage('Invalid email or password');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0f0f0f] px-4 font-sans">
      <div className="w-full max-w-[400px] rounded-lg border border-[rgba(245,241,234,0.08)] bg-[#161616] p-10 shadow-2xl">
        {/* Header Block */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-[0.2em] text-[#c9a96e]">
            NOBILITAS
          </h1>
          <p className="mt-1 text-[0.8rem] uppercase tracking-[0.1em] text-[#666]">
            Admin Panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} method="POST" className="mt-8 space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[0.75rem] font-medium tracking-wider text-[#8a8a8a] uppercase">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@nobilitas.com"
              disabled={isLoading}
              className="w-full rounded border border-[rgba(245,241,234,0.08)] bg-[#1c1c1c] px-4 py-3 text-[0.9rem] text-[#f5f1ea] transition-colors focus:border-[#c9a96e] focus:outline-none disabled:opacity-50"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-[0.75rem] text-[#ef4444]">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-[0.75rem] font-medium tracking-wider text-[#8a8a8a] uppercase">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full rounded border border-[rgba(245,241,234,0.08)] bg-[#1c1c1c] px-4 py-3 text-[0.9rem] text-[#f5f1ea] transition-colors focus:border-[#c9a96e] focus:outline-none disabled:opacity-50"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-[0.75rem] text-[#ef4444]">{errors.password.message}</p>
            )}
          </div>

          {/* Submission Error Display */}
          {errorMessage && (
            <div className="rounded bg-[rgba(239,68,68,0.1)] p-3 text-center border border-[rgba(239,68,68,0.2)]">
              <p className="text-[0.8rem] text-[#ef4444] font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-[#c9a96e] py-3 text-center text-[0.9rem] font-bold text-[#0f0f0f] transition-all hover:bg-[#b8935d] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
