"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, FileText, Wrench, Smartphone, DollarSign, Scale, Mail, Users, ArrowRight } from "lucide-react";
import { InstallGuides } from "./sections/install-guides";
import { Troubleshooting } from "./sections/troubleshooting";
import { RefundPolicy } from "./sections/refund-policy";
import { TermsOfService } from "./sections/terms";

function SupportContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>(tabParam || "install");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="min-h-screen py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-3">Help Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Find answers, installation guides, and get support for your eSIM.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0">
            <TabsList className="flex w-max md:w-full md:grid md:grid-cols-6 gap-2 bg-gray-100/50 p-1.5 rounded-2xl h-auto border border-gray-200">
              <TabsTrigger value="install" className="rounded-xl py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all text-gray-500">
                <FileText className="h-4 w-4 mr-2" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="rounded-xl py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all text-gray-500">
                <Wrench className="h-4 w-4 mr-2" />
                Fixes
              </TabsTrigger>
              <TabsTrigger value="device" className="rounded-xl py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all text-gray-500">
                <Smartphone className="h-4 w-4 mr-2" />
                Device
              </TabsTrigger>
              <TabsTrigger value="refund" className="rounded-xl py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all text-gray-500">
                <DollarSign className="h-4 w-4 mr-2" />
                Refunds
              </TabsTrigger>
              <TabsTrigger value="terms" className="rounded-xl py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all text-gray-500">
                <Scale className="h-4 w-4 mr-2" />
                Terms
              </TabsTrigger>
              <TabsTrigger value="contact" className="rounded-xl py-2.5 text-sm font-bold data-[state=active]:bg-black data-[state=active]:text-white transition-all text-gray-500 hover:text-gray-900">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-[400px]">
            <TabsContent value="install" className="mt-0 focus-visible:outline-none">
              <InstallGuides />
            </TabsContent>

            <TabsContent value="troubleshooting" className="mt-0 focus-visible:outline-none">
              <Troubleshooting />
            </TabsContent>

            <TabsContent value="device" className="mt-0 space-y-6 focus-visible:outline-none">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      <Smartphone className="h-8 w-8 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Device Compatibility Checker</h2>
                  </div>
                  <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl">
                    Check if your device supports eSIM technology before purchasing a plan. Most modern phones from Apple, Samsung, and Google are compatible.
                  </p>
                  <Link href="/support/device-check">
                    <Button className="w-full md:w-auto bg-black text-white hover:bg-gray-800 rounded-full font-bold px-8 py-6 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                      Check Compatibility <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
            </TabsContent>

            <TabsContent value="refund" className="mt-0 focus-visible:outline-none">
              <RefundPolicy />
            </TabsContent>

            <TabsContent value="terms" className="mt-0 focus-visible:outline-none">
              <TermsOfService />
            </TabsContent>

            <TabsContent value="affiliate-terms" className="mt-0 focus-visible:outline-none">
                {/* Keep existing affiliate content but styled if needed later */}
            </TabsContent>

            <TabsContent value="contact" className="mt-0 space-y-6 focus-visible:outline-none">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      <Mail className="h-8 w-8 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Contact Support</h2>
                  </div>
                  <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl">
                    Need help with your eSIM or account? Send us a message and we'll get back to you as soon as possible.
                  </p>
                  <Link href="/support/contact">
                    <Button className="w-full md:w-auto bg-black text-white hover:bg-gray-800 rounded-full font-bold px-8 py-6 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                      Open Contact Form <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-6 md:py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-black uppercase text-black mb-2">HELP CENTER</h1>
            <p className="text-sm md:text-base text-gray-600 font-mono uppercase">
              FIND ANSWERS, INSTALLATION GUIDES, AND GET SUPPORT
            </p>
          </div>
        </div>
      </div>
    }>
      <SupportContent />
    </Suspense>
  );
}
