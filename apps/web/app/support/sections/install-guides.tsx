"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, CheckCircle2, Smartphone, AlertTriangle, ChevronDown, QrCode } from "lucide-react";
import Link from "next/link";

export function InstallGuides() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Example activation code format: LPA:1$SMDP_ADDRESS$ACTIVATION_CODE
  const exampleFullAc = "LPA:1$rsp-eu.redteamobile.com$451F9802E6";
  // Extract SM-DP+ Address (everything up to the last $)
  const exampleSmdp = exampleFullAc.substring(0, exampleFullAc.lastIndexOf('$'));
  // Extract Activation Code (everything after the last $)
  const exampleAc = exampleFullAc.substring(exampleFullAc.lastIndexOf('$') + 1);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-gray-600 font-medium">
          Follow these step-by-step guides to install your eSIM on your device. Installation usually takes less than 5 minutes.
        </p>
        <Link href="/support/device-check" className="inline-block mt-4">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full font-bold px-6 shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
            <Smartphone className="h-4 w-4 mr-2" />
            Check if your device supports eSIM
          </Button>
        </Link>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* iPhone Installation */}
        <AccordionItem value="iphone" className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
          <AccordionTrigger className="text-black text-lg md:text-xl font-bold px-6 py-5 hover:bg-gray-50 hover:no-underline [&[data-state=open]]:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-left">iPhone Installation Guide</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-8 pt-4">
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6 space-y-8">
                
                {/* Before You Begin */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Before You Begin
                  </h4>
                  <ul className="list-disc list-inside text-sm text-blue-800 space-y-1.5 ml-1">
                    <li>Ensure your iPhone is unlocked and supports eSIM (iPhone XS and newer).</li>
                    <li>Make sure you have a stable Wi-Fi or cellular data connection.</li>
                    <li>Have your eSIM QR code or activation details ready.</li>
                  </ul>
                </div>

                {/* Method 1: QR Code */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Method 1: Install using QR Code (Recommended)
                  </h3>
                  <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-40px)] before:w-0.5 before:bg-gray-100">
                    
                    {/* Step 1 */}
                    <div className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-md z-10">1</div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-black font-bold mb-1">Access Cellular Settings</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Open <strong className="text-black">Settings</strong> &gt; <strong className="text-black">Cellular</strong> (or <strong className="text-black">Mobile Data</strong>) &gt; <strong className="text-black">Add eSIM</strong>.
                        </p>
                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm">
                          <Image
                            src="/install-guides/iphone-step1-cellular-add-esim.webp"
                            alt="iPhone Settings - Cellular - Add eSIM"
                            width={400}
                            height={800}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-md z-10">2</div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-black font-bold mb-1">Scan QR Code</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Select <strong className="text-black">Use QR Code</strong> and scan the code provided in your Cheap eSIMs account.
                        </p>
                        <div className="mt-3 space-y-3">
                          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm">
                            <Image
                              src="/install-guides/iphone-step2-setup-cellular-qr.webp"
                              alt="iPhone Set Up Cellular - Use QR Code option"
                              width={400}
                              height={800}
                              className="w-full h-auto"
                            />
                          </div>
                          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm">
                            <Image
                              src="/install-guides/iphone-step2-scan-qr-code.webp"
                              alt="iPhone Scan QR Code screen"
                              width={400}
                              height={800}
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-md z-10">3</div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-black font-bold mb-1">Label Your eSIM</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Give your new eSIM a name like "Travel" or "Cheap eSIMs" to identify it easily.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-md z-10">4</div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-black font-bold mb-1">Set Default Line Preferences</h4>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-gray-600 text-sm mb-3">
                          <li><strong className="text-black">Default Line:</strong> Primary (for calls/SMS)</li>
                          <li><strong className="text-black">Cellular Data:</strong> Select your new eSIM</li>
                        </ul>
                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm">
                          <Image
                            src="/install-guides/iphone-step4-cellular-data-selection.webp"
                            alt="iPhone Cellular Data - Select Travel eSIM"
                            width={400}
                            height={800}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-md z-10">5</div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-black font-bold mb-1">Configure Network Settings</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Go to <strong className="text-black">Settings</strong> &gt; <strong className="text-black">Cellular</strong> &gt; Select your new eSIM:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-1 mb-3">
                          <li>Turn <strong className="text-black">Data Roaming</strong> ON.</li>
                          <li>Ensure <strong className="text-black">Network Selection</strong> is set to Automatic.</li>
                          <li>In <strong className="text-black">Voice & Data</strong>, select LTE or 5G.</li>
                        </ul>
                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm">
                          <Image
                            src="/install-guides/iphone-step5-data-roaming-settings.webp"
                            alt="iPhone eSIM Settings - Data Roaming toggle"
                            width={400}
                            height={800}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="w-full h-px bg-gray-200"></div>

                {/* Method 2: Manual */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-6">Method 2: Manual Entry (Alternative)</h3>
                  <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-40px)] before:w-0.5 before:bg-gray-100">
                    <p className="text-gray-600 text-sm pl-12 mb-4">If you cannot scan the QR code, enter details manually.</p>
                    
                    <div className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-md z-10">1</div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-black font-bold mb-1">Enter Details Manually</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Go to <strong className="text-black">Settings</strong> &gt; <strong className="text-black">Cellular</strong> &gt; <strong className="text-black">Add eSIM</strong> &gt; <strong className="text-black">Enter Details Manually</strong>.
                        </p>
                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm w-full">
                          <Image
                            src="/install-guides/enter-details-manually-esim-iphone-3bb03a24.webp"
                            alt="iPhone Enter Details Manually eSIM screen"
                            width={400}
                            height={800}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-md z-10">2</div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-black font-bold mb-1">Copy & Paste Info</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Copy the SM-DP+ Address and Activation Code from your Cheap eSIMs account:
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase block mb-1">SM-DP+ Address</span>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                              <code className="text-sm text-black font-mono truncate mr-2">
                                {exampleSmdp}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(exampleSmdp, "smdp")}
                                className="h-8 w-8 p-0 hover:bg-gray-200 rounded-md text-gray-500 hover:text-black"
                              >
                                {copied === "smdp" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Activation Code</span>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                              <code className="text-sm text-black font-mono truncate mr-2">
                                {exampleAc}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(exampleAc, "ac")}
                                className="h-8 w-8 p-0 hover:bg-gray-200 rounded-md text-gray-500 hover:text-black"
                              >
                                {copied === "ac" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-md z-10">3</div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-black font-bold mb-1">Finish Setup</h4>
                        <p className="text-gray-600 text-sm">
                          Follow the prompts to label your plan and configure network settings as shown in Method 1 (Steps 3-5).
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 mt-4">
              <div className="flex gap-3">
                <div className="p-1 bg-yellow-100 rounded-full h-fit">
                  <AlertTriangle className="h-4 w-4 text-yellow-700" />
                </div>
                <div>
                  <h4 className="text-yellow-900 font-bold mb-1 text-sm">Important Notes</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Ensure you have a stable internet connection (Wi-Fi recommended)</li>
                    <li>• Keep your phone unlocked during installation</li>
                    <li>• Some iPhone models may require iOS 12.1 or later</li>
                    <li>• China/Hong Kong iPhone models may not support eSIM</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-2 border-t border-gray-100 text-center">
              <Link href="/support?tab=troubleshooting">
                <Button variant="link" className="text-primary-dark font-bold hover:underline">
                  Having issues? Check Troubleshooting →
                </Button>
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Android Installation */}
        <AccordionItem value="android" className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
          <AccordionTrigger className="text-black text-lg md:text-xl font-bold px-6 py-5 hover:bg-gray-50 hover:no-underline [&[data-state=open]]:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-left">Android Installation Guide <span className="text-gray-500 font-normal text-base hidden sm:inline">(Samsung, Google Pixel, etc.)</span></span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-8 pt-4">
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6 space-y-8">
                <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-40px)] before:w-0.5 before:bg-gray-100">
                <div className="flex gap-4 relative">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-md z-10">
                    1
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-black font-bold mb-2">Scan QR Code</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      For most Android devices with eSIM support:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm ml-1">
                      <li>Open <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Settings</strong></li>
                      <li>Tap <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Connections</strong> or <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Network & Internet</strong></li>
                      <li>Tap <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">SIM card manager</strong> or <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Mobile networks</strong></li>
                      <li>Tap <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Add mobile plan</strong> or <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Add eSIM</strong></li>
                      <li>Select <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Scan QR code</strong> and scan the QR code</li>
                      <li>Follow the on-screen instructions</li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-md z-10">
                    2
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-black font-bold mb-2">Samsung Devices</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      For Samsung Galaxy devices:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm ml-1">
                      <li>Open <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Settings</strong> → <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Connections</strong></li>
                      <li>Tap <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">SIM card manager</strong></li>
                      <li>Tap <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Add mobile plan</strong></li>
                      <li>Select <strong className="text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">Add using QR code</strong></li>
                      <li>Scan the QR code from your Cheap eSIMs account</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 mt-4">
                <div className="flex gap-3">
                  <div className="p-1 bg-yellow-100 rounded-full h-fit">
                    <AlertTriangle className="h-4 w-4 text-yellow-700" />
                  </div>
                  <div>
                    <h4 className="text-yellow-900 font-bold mb-1 text-sm">Dual SIM Behavior</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• You can use both physical SIM and eSIM simultaneously</li>
                      <li>• Choose which SIM to use for calls, messages, and data</li>
                      <li>• Some Android devices may require you to set a default data SIM</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-2 border-t border-gray-100 text-center">
                <Link href="/support?tab=troubleshooting">
                  <Button variant="link" className="text-primary-dark font-bold hover:underline">
                    Having issues? Check Troubleshooting →
                  </Button>
                </Link>
              </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
