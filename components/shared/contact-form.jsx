'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { api_v1 } from '@/lib/api';
import { useTheme } from '@/context/themeContext';
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export function ContactForm({ slug }) {
  const [status, setStatus] = useState({ type: '', message: '' });
  const { portfolioTheme } = useTheme();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const themeColor = portfolioTheme?.themeColor || '#000000';
  const accentColor = portfolioTheme?.accentColor || '#ffffff';

  const onSubmit = async (data) => {
    try {
      // Get slug from subdomain if not provided
      let portfolioSlug = slug;
      if (!portfolioSlug && typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        portfolioSlug = hostname.split('.')[0];
      }

      const endpoint = portfolioSlug 
        ? `/portfolio/${portfolioSlug}/contact/`
        : `/portfolio/contact/`;
      
      await api_v1.post(endpoint, data);

      setStatus({
        type: 'success',
        message: 'Message sent successfully! We will get back to you soon.',
      });
      form.reset();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {status.message && (
        <Alert variant={status.type === 'success' ? 'default' : 'destructive'}>
          <AlertTitle>
            {status.type === 'success' ? 'Success!' : 'Error'}
          </AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your message..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-xl h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            disabled={form.formState.isSubmitting}
            style={{
              backgroundColor: themeColor,
              color: accentColor,
            }}
          >
            {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Form>
    </div>
  );
}