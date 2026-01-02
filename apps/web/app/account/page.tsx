"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, ArrowRight, Wallet, MessageSquare, ShoppingBag } from "lucide-react";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { safeFetch } from "@/lib/safe-fetch";

interface SpareChangeBalance {
  balanceCents: number;
  currency: string;
}

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { formatCurrency: formatCurrencyContext, convert } = useCurrency();
  const [spareChangeBalance, setSpareChangeBalance] = useState<SpareChangeBalance | null>(null);
  const [loadingSpareChange, setLoadingSpareChange] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchSpareChange = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        const data = await safeFetch<SpareChangeBalance>(`${apiUrl}/spare-change`, {
          headers: {
            "x-user-email": user.primaryEmailAddress?.emailAddress || "",
          },
          showToast: false,
        });
        setSpareChangeBalance(data);
      } catch (error) {
        console.error("Failed to fetch Spare Change balance:", error);
      } finally {
        setLoadingSpareChange(false);
      }
    };

    fetchSpareChange();
  }, [user, isLoaded]);

  const formatCurrency = (cents: number) => {
    const amountUSD = cents / 100;
    const convertedAmount = convert(amountUSD);
    return formatCurrencyContext(convertedAmount);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Account' }]} />
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Account</h1>
        <p className="text-sm font-medium text-gray-500">Manage your account settings</p>
      </div>

      {/* Continue Shopping Link */}
      <Link href="/" className="block group">
        <div className="bg-black text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-colors"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 group-hover:bg-white/20 p-3 rounded-xl transition-colors">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Continue Shopping</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Browse more destinations</p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform relative z-10" />
        </div>
      </Link>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Spare Change Balance Card */}
      <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-2xl relative overflow-hidden group hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 bg-black text-white px-4 py-1.5 text-xs font-bold uppercase rounded-bl-xl">
            Wallet
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-xl">
                        <Wallet className="h-6 w-6 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Spare Change Balance</h2>
                </div>
                <div>
                    {loadingSpareChange ? (
                        <div className="h-12 w-48 bg-gray-100 animate-pulse rounded-lg"></div>
                    ) : (
                        <p className="text-5xl font-bold tracking-tight text-black">
                            {spareChangeBalance ? formatCurrency(spareChangeBalance.balanceCents) : "$0.00"}
                        </p>
                    )}
                    <p className="text-sm font-medium text-gray-500 mt-2 max-w-md">
                        Store credit for future purchases. Non-expiring.
                    </p>
                </div>
            </div>
            <Link href="/account/spare-change" className="inline-block w-full md:w-auto">
                <Button variant="outline" className="border-gray-300 rounded-full font-bold w-full md:w-auto hover:bg-black hover:text-white transition-all px-6">
                    View Spare Change Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Affiliate Program Card */}
        <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-2xl hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <DollarSign className="h-6 w-6 text-primary-dark" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Affiliate Program</h2>
                </div>
                <p className="font-medium text-sm text-gray-600 leading-relaxed">
                    Earn <span className="font-bold text-primary-dark bg-primary/10 px-1.5 py-0.5 rounded">10% COMMISSION</span> on all referrals. Share your link and start earning real cash today.
                </p>
            </div>
            <div className="mt-8">
                <Link href="/account/affiliate" className="inline-block w-full">
                    <Button className="bg-black text-white hover:bg-gray-800 rounded-full font-bold w-full h-12 shadow-md hover:shadow-lg transition-all">
                        Affiliate Dashboard
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>

        {/* Support Tickets Card */}
        <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-2xl hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-xl">
                        <MessageSquare className="h-6 w-6 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Support Tickets</h2>
                </div>
                <p className="font-medium text-sm text-gray-600 leading-relaxed">
                    Need help? Track your existing requests or submit a new inquiry to our support team.
                </p>
            </div>
            <div className="mt-8 flex gap-3">
                <Link href="/account/support" className="flex-1">
                    <Button variant="outline" className="border-gray-300 bg-white text-black hover:bg-gray-50 rounded-full font-bold w-full h-12">
                        My Tickets
                    </Button>
                </Link>
                <Link href="/support/contact" className="flex-1">
                    <Button className="bg-black text-white hover:bg-gray-800 rounded-full font-bold w-full h-12 shadow-md hover:shadow-lg transition-all">
                        New Ticket
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
