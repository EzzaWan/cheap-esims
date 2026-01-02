"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RefundPolicy() {
  return (
    <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-8 border-b border-gray-200 bg-gray-50">
          <h2 className="text-3xl font-bold text-black tracking-tight mb-2">Refund Policy</h2>
          <p className="text-gray-600 font-medium">
            We want you to be completely satisfied with your eSIM purchase. Please read our refund policy carefully.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-3">
              <div className="bg-green-100 p-1.5 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
              </div>
              Refund Conditions
            </h3>
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
              <p className="text-green-800 font-bold uppercase text-xs mb-3">Refunds are allowed ONLY if ALL of the following conditions are met:</p>
              <ul className="space-y-3 text-green-900 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-600">•</span>
                  <span><strong className="text-black">eSIM NOT installed:</strong> The eSIM profile has not been installed or activated on any device</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">•</span>
                  <span><strong className="text-black">No data used:</strong> Zero data consumption has occurred on the eSIM</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">•</span>
                  <span><strong className="text-black">eSIM ready but not activated:</strong> The eSIM must be ready for installation but not yet installed on any device</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">•</span>
                  <span><strong className="text-black">Refund requested within validity period:</strong> Request must be made before the eSIM's validity period expires</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-3">
              <div className="bg-red-100 p-1.5 rounded-full">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
              Non-Refundable Situations
            </h3>
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <p className="text-red-800 font-bold uppercase text-xs mb-3">Refunds will NOT be provided in the following situations:</p>
              <ul className="space-y-3 text-red-900 text-sm">
                <li className="flex gap-2">
                  <span className="text-red-600">•</span>
                  <span><strong className="text-black">eSIM already activated:</strong> Once the eSIM is installed and activated on a device</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">•</span>
                  <span><strong className="text-black">Data has been used:</strong> Any data consumption has occurred, even if minimal</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">•</span>
                  <span><strong className="text-black">Wrong device:</strong> You purchased for a device that doesn't support eSIM</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">•</span>
                  <span><strong className="text-black">Wrong country/region:</strong> You purchased an eSIM for a different country than needed</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">•</span>
                  <span><strong className="text-black">Poor local coverage:</strong> Network coverage issues at your location</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">•</span>
                  <span><strong className="text-black">Validity expired:</strong> The eSIM's validity period has expired</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">•</span>
                  <span><strong className="text-black">Change of mind:</strong> Simply deciding you don't need the eSIM anymore after purchase</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-3">
              <div className="bg-yellow-100 p-1.5 rounded-full">
                <AlertTriangle className="h-5 w-5 text-yellow-700" />
              </div>
              Refund Process
            </h3>
            <div className="bg-white border border-gray-200 p-6 rounded-xl relative shadow-sm">
              <div className="absolute top-4 right-4 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Step by Step</div>
              <ol className="list-decimal list-inside space-y-4 text-gray-600 text-sm ml-2">
                <li>
                  <strong className="text-black">Submit refund request:</strong> Contact our support team via the contact form with your order ID and reason
                </li>
                <li>
                  <strong className="text-black">Email verification:</strong> We'll verify your email address matches the order
                </li>
                <li>
                  <strong className="text-black">Review period:</strong> Our team will review your request within 24-48 hours
                </li>
                <li>
                  <strong className="text-black">Refund processing:</strong> If approved, refund will be processed within 3-5 business days
                </li>
                <li>
                  <strong className="text-black">Refund method:</strong> Refunds are issued to the original payment method used for purchase
                </li>
              </ol>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-black mb-4">Important Notes</h3>
            <div className="space-y-3 text-gray-600 text-sm p-5 border-l-4 border-gray-300 bg-gray-50 rounded-r-xl">
              <p>
                All refund requests are reviewed on a case-by-case basis. We reserve the right to deny refunds that don't meet our policy criteria.
              </p>
              <p>
                Refunds may take 3-5 business days to appear in your account after approval, depending on your bank or payment provider.
              </p>
              <p>
                If you're unsure about device compatibility or coverage, please use our device checker and coverage information before purchasing.
              </p>
              <p>
                Once an eSIM is activated and data is used, we cannot process a refund as the service has been consumed.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-4 font-medium">
              Need to request a refund or have questions about our policy?
            </p>
            <Link href="/support/contact">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full font-bold px-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
