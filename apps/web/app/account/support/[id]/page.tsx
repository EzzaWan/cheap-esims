"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mail, Calendar, MessageCircle, User } from "lucide-react";
import { safeFetch } from "@/lib/safe-fetch";
import { useToast } from "@/components/ui/use-toast";

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

export default function SupportTicketDetailPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && params.id) {
      fetchTicket();
    }
  }, [user, params.id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const data = await safeFetch<SupportTicket>(
        `${apiUrl}/support/tickets/${params.id}`,
        {
          headers: {
            "x-user-email": user?.primaryEmailAddress?.emailAddress || "",
          },
          showToast: false,
        }
      );
      setTicket(data);
    } catch (error: any) {
      console.error("Failed to fetch ticket:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load ticket. Please try again.",
        variant: "destructive",
      });
      router.push("/account/support");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    if (replyMessage.trim().length < 10) {
      toast({
        title: "Error",
        description: "Message must be at least 10 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (replyMessage.trim().length > 1000) {
      toast({
        title: "Error",
        description: "Message must be no more than 1000 characters long.",
        variant: "destructive",
      });
      return;
    }

    setReplying(true);
    try {
      await safeFetch(
        `${apiUrl}/support/tickets/${params.id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": user?.primaryEmailAddress?.emailAddress || "",
          },
          body: JSON.stringify({
            message: replyMessage.trim(),
          }),
          errorMessage: "Failed to send reply. Please try again.",
        }
      );

      toast({
        title: "Success",
        description: "Your reply has been sent successfully.",
      });

      setReplyMessage("");
      // Refresh ticket to show new reply
      await fetchTicket();
    } catch (error: any) {
      console.error("Failed to send reply:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setReplying(false);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-500 font-mono font-bold uppercase text-sm">Loading ticket...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/account/support">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-full font-bold transition-all pl-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Support Ticket</h1>
          <p className="text-gray-500 text-sm font-medium">ID: {ticket.id.substring(0, 8)}...</p>
        </div>
      </div>

      {/* Original Message */}
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-200 p-6">
          <CardTitle className="text-gray-900 font-bold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Your Message
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6 mb-6 relative">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-black text-white hover:bg-gray-800 rounded-full font-bold px-3">You</Badge>
              <span className="text-xs font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-900 whitespace-pre-wrap text-sm leading-relaxed">{ticket.message}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ticket.orderId && (
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Order ID</p>
                <p className="text-gray-900 font-mono font-bold">{ticket.orderId}</p>
              </div>
            )}
            {ticket.device && (
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Device</p>
                <p className="text-gray-900 font-medium">{ticket.device}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200 p-6">
          <CardTitle className="text-gray-900 font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversation History ({ticket.SupportTicketReply?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 bg-gray-50/30">
          {ticket.SupportTicketReply && ticket.SupportTicketReply.length > 0 ? (
            ticket.SupportTicketReply.map((reply) => (
              <div
                key={reply.id}
                className={`flex flex-col ${reply.isAdmin ? "items-start" : "items-end"}`}
              >
                <div 
                  className={`max-w-[85%] p-5 shadow-sm ${
                    reply.isAdmin 
                      ? "bg-white border border-gray-200 rounded-2xl rounded-tl-none" 
                      : "bg-primary text-primary-foreground rounded-2xl rounded-tr-none shadow-md shadow-primary/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-black/5">
                    <span className="font-bold text-xs uppercase tracking-wide">
                      {reply.isAdmin ? (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-full h-5 px-2">SUPPORT</Badge>
                        </span>
                      ) : "You"}
                    </span>
                    <span className={`text-[10px] font-medium ${reply.isAdmin ? "text-gray-400" : "text-primary-foreground/70"}`}>
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{reply.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No responses yet</p>
              <p className="text-gray-400 text-xs mt-1">Our team will get back to you shortly.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200 p-6">
          <CardTitle className="text-gray-900 font-bold flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send a Reply
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="bg-white border-gray-200 text-gray-900 min-h-[150px] rounded-xl focus:ring-primary focus:border-primary transition-all p-4 resize-y"
              disabled={replying}
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className={`text-xs font-medium ${replyMessage.length > 1000 ? "text-red-500" : "text-gray-400"}`}>
                {replyMessage.length}/1000 characters
              </p>
              <Button
                onClick={handleReply}
                disabled={replying || !replyMessage.trim() || replyMessage.trim().length < 10}
                className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 rounded-full font-bold shadow-lg hover:shadow-xl transition-all h-12 px-8"
              >
                {replying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

