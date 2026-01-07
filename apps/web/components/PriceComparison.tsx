import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Competitor {
  name: string;
  logo?: string;
  diffText: string;
  price: string; // Added for easter egg
  isCheaper: boolean;
}

const competitors: Competitor[] = [
  { 
    name: 'Airalo', 
    logo: '/images/competitors/airalo.jpg',
    diffText: '~49% more expensive', 
    price: '€3.67',
    isCheaper: false 
  },
  { 
    name: 'Holafly', 
    logo: '/images/competitors/holafly.webp',
    diffText: '~54% more expensive', 
    price: '€3.79',
    isCheaper: false 
  },
  { 
    name: 'Saily', 
    logo: '/images/competitors/saily.webp',
    diffText: '~32% more expensive', 
    price: '€3.25',
    isCheaper: false 
  },
];

export function PriceComparison({ className }: { className?: string }) {
  return (
    <div className={cn("mt-6 pt-6 border-t border-gray-100", className)}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 md:mb-0">
        <div className="text-center md:text-left md:flex-1">
          <h2 className="text-xl font-bold tracking-tight text-black leading-tight">
            Save up to 54% more
          </h2>
          <p className="text-gray-500 text-xs font-medium mt-1">
            vs. leading global eSIM providers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <TooltipProvider>
          {competitors.map((comp) => (
            <div 
              key={comp.name} 
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-100 bg-gray-50 text-center grayscale opacity-70"
            >
              {comp.logo ? (
                <div className="h-6 mb-2 flex items-center justify-center">
                  <img 
                    src={comp.logo} 
                    alt={comp.name} 
                    className="h-full w-auto object-contain" 
                  />
                </div>
              ) : (
                <div className="font-bold text-sm text-gray-400 mb-1">{comp.name}</div>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="text-[9px] font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 cursor-help"
                  >
                    {comp.diffText}
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  className="bg-white border border-gray-200 text-gray-700 p-3 z-[100] rounded-xl shadow-lg font-bold"
                  sideOffset={8}
                >
                  <p>Price: {comp.price}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}

          {/* Cheap eSIMs Card */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-primary bg-primary/5 text-center relative shadow-sm cursor-help"
              >
                <div className="absolute -top-2 bg-primary text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Lowest Price
                </div>
                
                <div className="font-bold text-base text-black mb-1 mt-1">Cheap eSIMs</div>
                
                <div className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                  <Check className="w-3 h-3" strokeWidth={4} /> Best Value
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-white border border-gray-200 text-gray-700 p-3 z-[100] rounded-xl shadow-lg font-bold"
              sideOffset={8}
            >
              <p>Price: €2.46</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-3 text-center md:text-right">
        <p className="text-[9px] text-gray-400 italic">
          *Comparison based on publicly listed prices for similar data-only Japan eSIM plans.
        </p>
      </div>
    </div>
  );
}
