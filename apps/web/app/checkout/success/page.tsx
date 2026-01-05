'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useUser();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Only fire Google Ads conversion event if we have a valid session_id
    // This ensures we only track actual successful checkouts
    if (sessionId && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17809762142/17nICLP7stIbEN7OraxC',
        'value': 1.0,
        'currency': 'USD'
      });
    }

    // Get email for guest access
    // Priority: authenticated user email > stored guest email > URL param
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('guest_checkout_email') : null;
    const emailParam = searchParams.get('email');
    
    if (user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else if (emailParam) {
      setEmail(emailParam);
      // Store for future use
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_checkout_email', emailParam);
      }
    }
  }, [sessionId, user, searchParams]);

  // Build link to my-esims with email if available (for guest access)
  const myEsimsLink = email ? `/my-esims?email=${encodeURIComponent(email)}` : '/my-esims';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4 py-8">
      <div className="h-24 w-24 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center shadow-lg">
        <CheckCircle2 className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Payment Successful!</h1>
      <p className="text-gray-600 text-sm md:text-base max-w-md leading-relaxed">
        Your eSIM order has been confirmed. You will receive an email with installation instructions shortly.
      </p>
      <Link href={myEsimsLink}>
        <Button className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-6 text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
          View My eSIMs
        </Button>
      </Link>
    </div>
  );
}
