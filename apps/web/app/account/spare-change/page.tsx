"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { safeFetch } from "@/lib/safe-fetch";

interface SpareChangeBalance {
  balanceCents: number;
  currency: string;
}

interface SpareChangeTransaction {
  id: string;
  type: "credit" | "debit";
  amountCents: number;
  reason: string;
  metadata?: any;
  createdAt: string;
}

export default function SpareChangePage() {
  const { user, isLoaded } = useUser();
  const { formatCurrency: formatCurrencyContext, convert } = useCurrency();
  const [balance, setBalance] = useState<SpareChangeBalance | null>(null);
  const [transactions, setTransactions] = useState<SpareChangeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        
        const [balanceData, transactionsData] = await Promise.all([
          safeFetch<SpareChangeBalance>(`${apiUrl}/spare-change`, {
            headers: {
              "x-user-email": user.primaryEmailAddress?.emailAddress || "",
            },
            showToast: false,
          }),
          safeFetch<{ transactions: SpareChangeTransaction[]; total: number; totalPages: number }>(
            `${apiUrl}/spare-change/transactions?page=${page}&pageSize=50`,
            {
              headers: {
                "x-user-email": user.primaryEmailAddress?.emailAddress || "",
              },
              showToast: false,
            }
          ),
        ]);

        setBalance(balanceData);
        setTransactions(transactionsData.transactions);
        setTotalPages(transactionsData.totalPages);
      } catch (error) {
        console.error("Failed to fetch Spare Change data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded, page]);

  const formatCurrency = (cents: number) => {
    const amountUSD = cents / 100;
    const convertedAmount = convert(amountUSD);
    return formatCurrencyContext(convertedAmount);
  };

  const getReasonLabel = (reason: string, metadata?: any) => {
    if (reason.startsWith('ORDER_PAYMENT_')) {
      const orderId = reason.replace('ORDER_PAYMENT_', '');
      const planName = metadata?.planName || metadata?.plan?.name;
      if (planName) return `Payment for ${planName}`;
      return `Order Payment (${orderId.substring(0, 8)}...)`;
    }

    if (reason === 'admin_manual_credit' || reason === 'manual_adjustment') {
      const adminReason = metadata?.reason;
      if (adminReason && adminReason !== 'admin_manual_credit') return `Admin Credit: ${adminReason}`;
      return 'Admin Manual Credit';
    }

    if (reason === 'AFFILIATE_COMMISSION_TO_SPARE_CHANGE' || reason === 'affiliate_conversion') {
      return 'Affiliate Commission Conversion';
    }

    if (reason.startsWith('ORDER_REFUND') || reason === 'refund' || reason === 'ORDER_REFUND_SPARE_CHANGE') {
      const orderId = metadata?.orderId;
      const planName = metadata?.planName;
      if (planName) return `Refund: ${planName}`;
      if (orderId) return `Refund for Order (${orderId.substring(0, 8)}...)`;
      return 'Order Refund';
    }

    if (reason === 'ORDER_REFUND_SPARE_CHANGE') {
      const orderId = metadata?.orderId;
      if (orderId) return `Refund to Spare Change (Order ${orderId.substring(0, 8)}...)`;
      return 'Refund to Spare Change';
    }

    const labels: Record<string, string> = {
      refund: 'Refund',
      purchase: 'Purchase',
    };

    return labels[reason] || reason.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoaded || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <Skeleton className="h-10 w-48 bg-gray-200 rounded-none" />
        <Skeleton className="h-64 w-full bg-gray-200 rounded-none" />
        <Skeleton className="h-96 w-full bg-gray-200 rounded-none" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 text-center">
        <h1 className="text-3xl font-black uppercase text-black mb-4">Please sign in</h1>
        <p className="text-gray-500 font-mono">You must be signed in to access your Spare Change.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Back Button */}
      <Link
        href="/account"
        className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-4 font-bold text-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Account
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-2">Spare Change History</h1>
        <p className="text-gray-500 font-medium text-lg">
          Store credit for future purchases & refunds
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Available Balance</p>
          <p className="text-6xl font-bold tracking-tight text-black">
            {balance ? formatCurrency(balance.balanceCents) : "$0.00"}
          </p>
        </div>
        <div className="bg-primary/10 p-6 rounded-2xl relative z-10">
            <DollarSign className="h-12 w-12 text-primary-dark" />
        </div>
        {/* Background decoration */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-gray-50 to-transparent -z-0" />
      </div>

      {/* Transactions */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 p-6 bg-gray-50/50">
          <h3 className="text-xl font-bold text-black">Transaction History</h3>
        </div>
        
        {transactions.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-medium">No transactions yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 w-32">Date</th>
                    <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 w-32">Type</th>
                    <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 w-32">Amount</th>
                    <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-600 font-medium text-sm whitespace-nowrap">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`rounded-full font-bold uppercase text-[10px] px-3 py-1 shadow-none border-0 ${
                            transaction.type === "credit"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {transaction.type === "credit" ? "Credit" : "Debit"}
                        </Badge>
                      </td>
                      <td className={`py-4 px-6 font-bold text-sm ${
                        transaction.type === "credit" 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(Math.abs(transaction.amountCents))}
                      </td>
                      <td className="py-4 px-6 text-gray-900 text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold">{getReasonLabel(transaction.reason, transaction.metadata)}</span>
                          {transaction.metadata?.orderId && !transaction.metadata?.planName && (
                            <span className="text-xs text-gray-400 font-mono mt-1 uppercase">
                              ID: {transaction.metadata.orderId.substring(0, 8)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50/50">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-200 bg-white rounded-full font-bold hover:bg-gray-100 px-6"
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-gray-200 bg-white rounded-full font-bold hover:bg-gray-100 px-6"
              >
                Next
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}
