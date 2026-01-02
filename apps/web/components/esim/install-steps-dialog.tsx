"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Smartphone,
  Settings,
  QrCode,
  Copy,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface InstallStepsDialogProps {
  activationCode?: string | null;
  smdpAddress?: string | null;
  trigger?: React.ReactNode;
}

export function InstallStepsDialog({
  activationCode,
  smdpAddress,
  trigger,
}: InstallStepsDialogProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeDevice, setActiveDevice] = useState<"ios" | "android" | null>(null);

  const extractSmdpFromAc = (ac: string | null | undefined): string | null => {
    if (!ac) return null;
    if (ac.includes("$")) {
      const parts = ac.split("$");
      return parts.length >= 2 ? parts[1] : null;
    }
    return null;
  };

  const extractActivationCodeFromAc = (ac: string | null | undefined): string | null => {
    if (!ac) return null;
    if (ac.includes("$")) {
      const parts = ac.split("$");
      return parts.length >= 3 ? parts[2] : null;
    }
    return ac;
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      toast({
        title: "Copied",
        description: "Copied to clipboard",
      });
    } catch (error) {
      console.error("Copy error:", error);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
      });
    }
  };

  const smdpFromAc = extractSmdpFromAc(activationCode || null);
  const activationCodeOnly = extractActivationCodeFromAc(activationCode || null);
  const displaySmdp = smdpAddress || smdpFromAc || "Not available";

  const defaultTrigger = (
    <Button className="bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all rounded-full shadow-sm flex items-center gap-2">
      <QrCode className="h-4 w-4" />
      How to Install
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-0 [&>button]:text-gray-500 [&>button]:hover:text-black [&>button]:rounded-full">
        <DialogHeader className="p-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">eSIM Installation Guide</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-2">
            Follow these step-by-step instructions to install your eSIM on your device.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="flex gap-4 p-1 bg-gray-100 rounded-full">
            <Button
              onClick={() => setActiveDevice("ios")}
              variant="ghost"
              className={`flex-1 rounded-full font-bold transition-all ${
                activeDevice === "ios" || !activeDevice
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-black hover:bg-gray-200"
              }`}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              iPhone
            </Button>
            <Button
              onClick={() => setActiveDevice("android")}
              variant="ghost"
              className={`flex-1 rounded-full font-bold transition-all ${
                activeDevice === "android" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-black hover:bg-gray-200"
              }`}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Android
            </Button>
          </div>

          {(!activeDevice || activeDevice === "ios") && (
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6 space-y-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Smartphone className="h-6 w-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">iPhone Installation</h3>
                </div>

                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-40px)] before:w-0.5 before:bg-gray-100">
                  {/* Step 1 */}
                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      1
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Access Cellular Settings</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Go to <strong className="text-gray-900">Settings</strong> &gt; <strong className="text-gray-900">Cellular</strong> (or Mobile Data) &gt; <strong className="text-gray-900">Add eSIM</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      2
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Scan QR Code</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Select <strong className="text-gray-900">Use QR Code</strong> and scan the code.
                      </p>
                      <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                         <p className="text-xs text-gray-500 font-bold uppercase mb-2">
                           Can't scan? <strong className="text-gray-900">Enter Details Manually</strong>:
                         </p>
                         <div className="space-y-3">
                           <div>
                             <div className="flex justify-between items-center mb-1">
                               <span className="text-xs text-gray-500 font-medium">SM-DP+:</span>
                               <button onClick={() => handleCopy(displaySmdp, "smdp")} className="text-xs text-primary hover:text-primary-dark font-bold uppercase transition-colors">
                                 {copied === "smdp" ? "Copied" : "Copy"}
                               </button>
                             </div>
                             <code className="text-xs text-gray-900 block truncate font-mono bg-white px-2 py-1 rounded border border-gray-200">{displaySmdp}</code>
                           </div>
                           
                           {activationCodeOnly && (
                             <div>
                               <div className="flex justify-between items-center mb-1">
                                 <span className="text-xs text-gray-500 font-medium">Code:</span>
                                 <button onClick={() => handleCopy(activationCodeOnly, "ac")} className="text-xs text-primary hover:text-primary-dark font-bold uppercase transition-colors">
                                   {copied === "ac" ? "Copied" : "Copy"}
                                 </button>
                               </div>
                               <code className="text-xs text-gray-900 block truncate font-mono bg-white px-2 py-1 rounded border border-gray-200">{activationCodeOnly}</code>
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      3
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Label Your eSIM</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Name your new plan (e.g., "Cheap eSIMs") to easily identify it.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      4
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Set Default Line</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                        <li><strong className="text-gray-900">Default Line:</strong> Primary (keep for calls/SMS)</li>
                        <li><strong className="text-gray-900">Cellular Data:</strong> Select your new eSIM</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      5
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Configure Network</h4>
                      <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                        In <strong className="text-gray-900">Settings</strong> &gt; <strong className="text-gray-900">Cellular</strong> &gt; Your eSIM:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                        <li>Toggle <strong className="text-gray-900">Data Roaming</strong> ON</li>
                        <li>Set <strong className="text-gray-900">Network Selection</strong> to Automatic</li>
                        <li>Ensure <strong className="text-gray-900">Voice & Data</strong> is LTE or 5G</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(!activeDevice || activeDevice === "android") && (
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6 space-y-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Smartphone className="h-6 w-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Android Installation (Samsung / Pixel)</h3>
                </div>

                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-40px)] before:w-0.5 before:bg-gray-100">
                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      1
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Open Settings</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Open the <strong className="text-gray-900">Settings</strong> app on your Android device.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      2
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Navigate to Connections</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Tap <strong className="text-gray-900">Connections</strong> (Samsung) or <strong className="text-gray-900">Network & internet</strong> (Pixel).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      3
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">SIM Manager</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Tap <strong className="text-gray-900">SIM Manager</strong> or <strong className="text-gray-900">SIMs</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      4
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Add eSIM</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Tap <strong className="text-gray-900">Add eSIM</strong> or <strong className="text-gray-900">Add mobile plan</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      5
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Scan QR Code or Enter Code</h4>
                      <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                        Choose one of these options:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2 text-sm">
                        <li>
                          <strong className="text-gray-900">Scan QR Code:</strong> Point your camera at the QR code
                        </li>
                        <li>
                          <strong className="text-gray-900">Enter Activation Code:</strong> Manually enter the activation code
                        </li>
                      </ul>
                      {activationCodeOnly && (
                        <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center justify-between gap-3">
                            <code className="text-sm text-gray-900 font-mono break-all flex-1 bg-white px-3 py-2 rounded border border-gray-200">
                              {activationCodeOnly}
                            </code>
                            <Button
                              size="sm"
                              onClick={() => handleCopy(activationCodeOnly, "ac")}
                              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-black rounded-full shadow-sm h-10 px-4"
                            >
                              {copied === "ac" ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
                      6
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <h4 className="text-gray-900 font-bold text-lg">Complete Setup</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Follow the on-screen prompts to complete the installation. Your eSIM will be activated once the download is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900 uppercase text-xs tracking-wider">Note:</strong> If you encounter any issues during installation, check our{" "}
              <a href="/support?tab=troubleshooting" className="underline hover:text-primary font-bold text-gray-900">
                troubleshooting guide
              </a>{" "}
              or{" "}
              <a href="/support/contact" className="underline hover:text-primary font-bold text-gray-900">
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


