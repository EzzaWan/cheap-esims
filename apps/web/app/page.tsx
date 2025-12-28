"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { CountryCard } from "@/components/CountryCard";
import { CountrySkeleton } from "@/components/skeletons";
import { ArrowRight, Zap, Globe, Map, Shield, Lock, Clock, CheckCircle2, Star, Quote, Smartphone, Wifi, Plane, HelpCircle } from "lucide-react";
import { safeFetch } from "@/lib/safe-fetch";
import { getRegionForCountry, REGION_NAMES, Region } from "@/lib/regions";
import { Button } from "@/components/ui/button";
import { PlanCard, Plan } from "@/components/PlanCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { filterVisiblePlans } from "@/lib/plan-utils";
import { HomeReviewsSection } from "@/components/HomeReviewsSection";

interface Country {
  code: string;
  name: string;
  locationLogo?: string;
  type?: number; // 1 = country, 2 = region
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Country[]>([]);
  const [filtered, setFiltered] = useState<Country[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [popularPlans, setPopularPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const data = await safeFetch<any>(`${apiUrl}/countries`, { showToast: false });
        console.log('[HOME] Received countries data:', data);
        // Handle both array and { locationList: [...] } formats
        const locationArray = Array.isArray(data) ? data : (data.locationList || []);
        console.log('[HOME] Locations array:', locationArray.slice(0, 3));
        
        // Separate countries (type === 1) from regions (type === 2)
        // Explicitly filter: countries must be type === 1, regions must be type === 2
        const countriesList = locationArray.filter((item: Country) => item.type === 1); // Only countries
        const regionsList = locationArray.filter((item: Country) => item.type === 2); // Only regions
        
        const sortedCountries = countriesList.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        const sortedRegions = regionsList.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        
        setCountries(sortedCountries);
        setRegions(sortedRegions);
        setFiltered(sortedCountries);
        setFilteredRegions(sortedRegions);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch popular plans from popular countries
  useEffect(() => {
    if (search) return; // Don't fetch if searching
    
    const fetchPopularPlans = async () => {
      setLoadingPlans(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        // Popular countries: US, UK, France, Japan, Australia
        const popularCountries = ['US', 'GB', 'FR', 'JP', 'AU'];
        const allPlans: Plan[] = [];
        
        // Fetch plans from each popular country (limit to first 2 plans per country)
        for (const countryCode of popularCountries) {
          try {
            const data = await safeFetch<Plan[]>(`${apiUrl}/countries/${countryCode}/plans`, { showToast: false });
            if (Array.isArray(data) && data.length > 0) {
              // Filter visible plans and take first 2
              const visiblePlans = filterVisiblePlans(data).slice(0, 2);
              allPlans.push(...visiblePlans);
            }
          } catch (error) {
            console.error(`Failed to fetch plans for ${countryCode}:`, error);
          }
        }
        
        // Sort by price and take top 6
        const sorted = allPlans
          .sort((a, b) => a.price - b.price)
          .slice(0, 6);
        
        setPopularPlans(sorted);
      } catch (error) {
        console.error("Failed to fetch popular plans", error);
      } finally {
        setLoadingPlans(false);
      }
    };
    
    fetchPopularPlans();
  }, [search]);

  const countriesByRegion = useMemo(() => {
    const grouped: Record<Region, Country[]> = {
      "asia": [],
      "europe": [],
      "north-america": [],
      "south-america": [],
      "africa": [],
      "oceania": [],
      "global": [],
    };

    countries.forEach((country) => {
      const region = getRegionForCountry(country.code);
      if (region) {
        grouped[region].push(country);
      }
    });

    return grouped;
  }, [countries]);

  useEffect(() => {
    if (!search) {
      setFiltered(countries);
      setFilteredRegions(regions);
    } else {
      const lower = search.toLowerCase();
      setFiltered(countries.filter(c => c.name.toLowerCase().includes(lower)));
      setFilteredRegions(regions.filter(r => r.name.toLowerCase().includes(lower)));
    }
  }, [search, countries, regions]);

  const regionGroups: Region[] = ["asia", "europe", "north-america", "south-america", "africa", "oceania", "global"];

  return (
    <div className="flex flex-col min-h-screen">
       {/* Deal Finder / Hero Section */}
       <div className="bg-primary text-black border-b-4 border-black p-6 md:p-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
               <div className="inline-block bg-black text-white px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider">
                  Price Watch: Live
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                  Travel Data <br/>
                  Cheapest In <br/>
                  <span className="text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-stroke-2">The World.</span>
                </h1>
                <p className="text-lg font-bold max-w-md leading-tight">
                   Stop overpaying for roaming. Get instant eSIMs at wholesale prices.
                </p>
                <div className="bg-white border-2 border-black p-3 shadow-hard max-w-lg">
                   <SearchBar value={search} onChange={setSearch} placeholder="Where are you going?" />
                   <div className="mt-2 text-[10px] font-mono text-gray-500 uppercase flex justify-between">
                      <span>Instant Delivery</span>
                      <span>No Contracts</span>
                   </div>
                </div>
            </div>

            {/* Quick Region Links */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
                {regionGroups.slice(0, 4).map(region => (
                   <Link key={region} href={`/regions/${region}`} className="bg-white border-2 border-black p-3 shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-between group">
                      <div>
                         <span className="block text-[10px] font-mono text-gray-500 uppercase">Region</span>
                         <span className="font-black text-lg uppercase">{REGION_NAMES[region]}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 group-hover:text-primary transition-colors" />
                   </Link>
                ))}
            </div>
          </div>
       </div>

       <div className="bg-white max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 md:space-y-8">
          
          {/* Trust Badges & Guarantee Messaging */}
          {!search && (
            <div className="space-y-6">
              {/* Trust Badges - Neo-Brutalist Redesign */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border-4 border-black p-4 shadow-hard flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                  <div className="mb-3 p-3 bg-yellow-300 border-2 border-black rounded-full shadow-hard-sm group-hover:shadow-none transition-shadow">
                    <Lock className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-black mb-1">SSL Secured</h3>
                  <p className="text-xs font-mono font-bold text-gray-600 leading-tight">256-bit military-grade encryption protection.</p>
                </div>
                
                <div className="bg-white border-4 border-black p-4 shadow-hard flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                  <div className="mb-3 p-3 bg-cyan-300 border-2 border-black rounded-full shadow-hard-sm group-hover:shadow-none transition-shadow">
                    <Shield className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-black mb-1">Money-Back</h3>
                  <p className="text-xs font-mono font-bold text-gray-600 leading-tight">30-day satisfaction guarantee or full refund.</p>
                </div>

                <div className="bg-white border-4 border-black p-4 shadow-hard flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                  <div className="mb-3 p-3 bg-pink-300 border-2 border-black rounded-full shadow-hard-sm group-hover:shadow-none transition-shadow">
                    <Clock className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-black mb-1">24/7 Support</h3>
                  <p className="text-xs font-mono font-bold text-gray-600 leading-tight">Expert support team available round the clock.</p>
                </div>
              </div>

              {/* Guarantee Messaging - Ticker Style */}
              <div className="bg-black text-white border-4 border-black py-3 px-2 overflow-hidden relative">
                <div className="flex items-center justify-around font-mono font-bold uppercase tracking-widest text-xs md:text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Instant Delivery
                  </span>
                  <span className="text-primary hidden sm:inline">★</span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Satisfaction Guaranteed
                  </span>
                  <span className="text-primary hidden sm:inline">★</span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> No Hidden Fees
                  </span>
                </div>
              </div>

              {/* Security Indicators - "System Status" Look */}
              <div className="border-2 border-dashed border-gray-400 bg-gray-50 p-3 font-mono text-[10px] uppercase tracking-wide text-gray-500 flex flex-wrap justify-center gap-x-6 gap-y-2">
                 <span className="flex items-center gap-2">
                    [ <Shield className="h-3 w-3" /> PCI DSS COMPLIANT ]
                 </span>
                 <span className="flex items-center gap-2">
                    [ <Lock className="h-3 w-3" /> DATA ENCRYPTED ]
                 </span>
                 <span className="flex items-center gap-2">
                    [ <CheckCircle2 className="h-3 w-3" /> PAYMENTS SECURE ]
                 </span>
              </div>
            </div>
          )}

          {/* Why Choose Cheap eSIMs Section */}
          {!search && (
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary border-2 border-black p-2">
                  <Zap className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Why Choose Us?</h2>
                  <p className="text-sm font-mono font-bold text-gray-600 uppercase">Everything you need for seamless global connectivity</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-black bg-black gap-[2px]">
                <div className="bg-white p-6 hover:bg-gray-50 transition-colors group h-full">
                  <div className="p-3 bg-secondary border-2 border-black w-fit mb-4 shadow-hard-sm group-hover:shadow-none transition-shadow">
                    <Zap className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-black mb-2">Instant Activation</h3>
                  <p className="text-sm font-mono text-gray-600">
                    Get your eSIM activated within minutes. No waiting, no physical SIM cards needed.
                  </p>
                </div>
                
                <div className="bg-white p-6 hover:bg-gray-50 transition-colors group h-full">
                  <div className="p-3 bg-primary border-2 border-black w-fit mb-4 shadow-hard-sm group-hover:shadow-none transition-shadow">
                    <Smartphone className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-black mb-2">Easy Setup</h3>
                  <p className="text-sm font-mono text-gray-600">
                    Simple QR code installation. Works on all eSIM-compatible devices worldwide.
                  </p>
                </div>
                
                <div className="bg-white p-6 hover:bg-gray-50 transition-colors group h-full">
                  <div className="p-3 bg-secondary border-2 border-black w-fit mb-4 shadow-hard-sm group-hover:shadow-none transition-shadow">
                    <Wifi className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-black mb-2">Global Coverage</h3>
                  <p className="text-sm font-mono text-gray-600">
                    Connect in 190+ countries with high-speed 4G/LTE networks. Stay connected everywhere.
                  </p>
                </div>
                
                <div className="bg-white p-6 hover:bg-gray-50 transition-colors group h-full">
                  <div className="p-3 bg-primary border-2 border-black w-fit mb-4 shadow-hard-sm group-hover:shadow-none transition-shadow">
                    <Plane className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-black mb-2">Travel-Friendly</h3>
                  <p className="text-sm font-mono text-gray-600">
                    No roaming charges, no contracts. Perfect for travelers, digital nomads, and business trips.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Popular Plans Section */}
          {!search && (
            <div className="space-y-6 pt-8">
              <div className="bg-yellow-50 border-2 border-black p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-xs font-mono font-bold uppercase">Hot Deals</div>
                <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Popular Plans</h2>
                    <p className="text-sm font-mono font-bold text-gray-600 uppercase">Best-selling eSIM plans</p>
                  </div>
                  <Link href="/regions/global">
                    <Button variant="outline" className="border-2 border-black bg-white text-black hover:bg-black hover:text-white rounded-none font-bold uppercase shadow-hard-sm hover:shadow-none transition-all">
                      View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                {loadingPlans ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white border-2 border-gray-200 h-64 animate-pulse"></div>
                    ))}
                  </div>
                ) : popularPlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularPlans.map((plan) => (
                      <PlanCard key={plan.packageCode} plan={plan} />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Region Tabs (Mobile/Desktop) */}
          {!search && (
            <div className="space-y-4">
               <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                     <Map className="h-6 w-6" /> Shop by Region
                  </h2>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {regionGroups.map((region) => (
                    <Link 
                      key={region} 
                      href={`/regions/${region}`}
                      className="flex-shrink-0 bg-secondary border-2 border-black px-6 py-3 font-bold uppercase hover:bg-black hover:text-white transition-colors shadow-hard-sm hover:shadow-none whitespace-nowrap"
                    >
                      {REGION_NAMES[region]}
                    </Link>
                  ))}
               </div>
            </div>
          )}

          {/* All Countries Grid (type 1 only) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
               <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                 <Globe className="h-6 w-6" /> 
                 {search ? `Search Results` : "All Countries"}
               </h2>
               <span className="font-mono text-sm bg-black text-white px-2 py-1">
                 {filtered.length} AVAILABLE
               </span>
            </div>

            {loading ? (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {[...Array(10)].map((_, i) => (
                   <div key={i} className="h-24 bg-gray-100 animate-pulse border-2 border-gray-200"></div>
                 ))}
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                 {filtered.map((country) => (
                    <CountryCard key={country.code} country={country} />
                 ))}
                 
                 {filtered.length === 0 && !loading && (
                    <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-300">
                      {search ? `No countries found matching "${search}"` : "No countries available"}
                    </div>
                 )}
               </div>
            )}
          </div>

          {/* Regions List (type 2) */}
          {!search && filteredRegions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase">Regions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-in fade-in duration-1000">
                {filteredRegions.map((region) => (
                  <CountryCard key={region.code} country={region} />
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {!search && (
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-black text-white border-2 border-black p-2">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-black">FAQ</h2>
                  <p className="text-sm font-mono font-bold text-gray-600 uppercase">Common questions answered</p>
                </div>
              </div>
              
              <div className="border-2 border-black">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b-2 border-black bg-white data-[state=open]:bg-secondary transition-all last:border-0">
                    <AccordionTrigger className="px-6 py-5 text-left font-black uppercase hover:bg-primary hover:text-black hover:no-underline [&[data-state=open]]:bg-black [&[data-state=open]]:text-white">
                      What is an eSIM and how does it work?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-5 text-gray-800 font-mono text-sm border-t-2 border-black bg-white">
                      An eSIM (embedded SIM) is a digital SIM card that's built into your device. Instead of a physical SIM card, you download a profile directly to your phone. Simply scan the QR code we provide, and your eSIM will be activated instantly. It works just like a regular SIM card but without the hassle of swapping physical cards.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-b-2 border-black bg-white data-[state=open]:bg-secondary transition-all last:border-0">
                    <AccordionTrigger className="px-6 py-5 text-left font-black uppercase hover:bg-primary hover:text-black hover:no-underline [&[data-state=open]]:bg-black [&[data-state=open]]:text-white">
                      Which devices support eSIM?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-5 text-gray-800 font-mono text-sm border-t-2 border-black bg-white">
                      Most modern smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer, and many other devices. Check your device compatibility using our <Link href="/support/device-check" className="font-bold underline">device checker</Link> before purchasing.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-b-2 border-black bg-white data-[state=open]:bg-secondary transition-all last:border-0">
                    <AccordionTrigger className="px-6 py-5 text-left font-black uppercase hover:bg-primary hover:text-black hover:no-underline [&[data-state=open]]:bg-black [&[data-state=open]]:text-white">
                      How quickly will I receive my eSIM?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-5 text-gray-800 font-mono text-sm border-t-2 border-black bg-white">
                      Your eSIM is delivered instantly via email after payment confirmation. You'll receive a QR code and activation instructions within minutes of your purchase. No waiting, no shipping delays!
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-b-2 border-black bg-white data-[state=open]:bg-secondary transition-all last:border-0">
                    <AccordionTrigger className="px-6 py-5 text-left font-black uppercase hover:bg-primary hover:text-black hover:no-underline [&[data-state=open]]:bg-black [&[data-state=open]]:text-white">
                      Can I use my regular SIM and eSIM at the same time?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-5 text-gray-800 font-mono text-sm border-t-2 border-black bg-white">
                      Yes! Most eSIM-compatible devices support dual SIM functionality, allowing you to use both your regular SIM and eSIM simultaneously. This is perfect for keeping your home number active while using data from your eSIM abroad.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-b-2 border-black bg-white data-[state=open]:bg-secondary transition-all last:border-0">
                    <AccordionTrigger className="px-6 py-5 text-left font-black uppercase hover:bg-primary hover:text-black hover:no-underline [&[data-state=open]]:bg-black [&[data-state=open]]:text-white">
                      What happens if I don't use all my data?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-5 text-gray-800 font-mono text-sm border-t-2 border-black bg-white">
                      Unused data expires at the end of your plan's validity period. However, many of our plans are valid for 30 days, giving you plenty of time to use your data. Some plans also support top-ups if you need more data before expiry.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6" className="border-b-2 border-black bg-white data-[state=open]:bg-secondary transition-all last:border-0">
                    <AccordionTrigger className="px-6 py-5 text-left font-black uppercase hover:bg-primary hover:text-black hover:no-underline [&[data-state=open]]:bg-black [&[data-state=open]]:text-white">
                      Do you offer refunds?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-5 text-gray-800 font-mono text-sm border-t-2 border-black bg-white">
                      Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your eSIM service, you can request a refund within 30 days of purchase. See our <Link href="/support?tab=refund" className="font-bold underline">refund policy</Link> for full details.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          )}

          {/* Reviews Section - Bottom of Page */}
          {!search && (
            <div className="pt-8">
              <HomeReviewsSection />
            </div>
          )}
       </div>
    </div>
  );
}
