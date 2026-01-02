"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Calendar, MessageCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { safeFetch } from "@/lib/safe-fetch";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface SupportTicketReply {
  id: string;
  message: string;
  isAdmin: boolean;
  adminEmail?: string | null;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  orderId: string | null;
  device: string | null;
  message: string;
  createdAt: string;
  SupportTicketReply: SupportTicketReply[];
}

export default function MySupportTicketsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await safeFetch<SupportTicket[]>(
        `${apiUrl}/support/tickets`,
        {
          headers: {
            "x-user-email": user?.primaryEmailAddress?.emailAddress || "",
          },
          showToast: false,
        }
      );
      setTickets(data || []);
    } catch (error) {
      console.error("Failed to fetch support tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-8">
         <Skeleton className="h-10 w-48 bg-gray-200 rounded-xl" />
         <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-40 w-full bg-gray-200 rounded-xl" />
            ))}
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Back Button */}
      <Link
        href="/account"
        className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-4 font-medium text-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Account
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2 flex items-center gap-3">
            My Tickets
          </h1>
          <p className="text-gray-500 text-lg">
            View all your support tickets and responses from our team
          </p>
        </div>
        <Link href="/support/contact">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-lg shadow-primary/20 transition-all">
            <Mail className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6 font-medium">You don't have any support tickets yet.</p>
            <Link href="/support/contact">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                Create Support Ticket
              </Button>
            </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => router.push(`/account/support/${ticket.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-8">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
                        Ticket #{ticket.id.substring(0, 8)}
                    </h3>
                    
                    {ticket.SupportTicketReply && ticket.SupportTicketReply.length > 0 && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full border-0 font-bold text-[10px] px-2.5 py-0.5">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {ticket.SupportTicketReply.length} {ticket.SupportTicketReply.length === 1 ? "reply" : "replies"}
                      </Badge>
                    )}
                    
                    {ticket.orderId && (
                      <Badge variant="outline" className="border-gray-200 text-gray-500 rounded-full font-mono text-[10px] px-2.5 py-0.5">
                        Order: {ticket.orderId.substring(0, 8)}...
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm pl-0">
                    {ticket.message}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-400 uppercase">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    {ticket.device && (
                      <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                        <span>{ticket.device}</span>
                      </div>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-300 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
