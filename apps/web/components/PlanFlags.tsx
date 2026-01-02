"use client";

import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPlanFlagLabels, type PlanFlagInfo } from "@/lib/plan-flags";

interface PlanFlagsProps {
  plan: any;
  className?: string;
  variant?: 'colored' | 'neutral'; // 'neutral' removes color coding for list pages
}

export function PlanFlags({ plan, className = "", variant = 'colored' }: PlanFlagsProps) {
  const flagInfo = getPlanFlagLabels(plan);

  // Don't render anything if there are no flags
  if (flagInfo.rawFlags.length === 0) {
    return null;
  }

  const isNeutral = variant === 'neutral';
  
  // Neutral styling for list pages (no color coding) - adapted to Professional Rounded theme
  const ipBadgeClass = isNeutral
    ? "border border-gray-200 bg-gray-50 text-gray-600 rounded-full px-2 py-0.5 text-xs font-bold"
    : "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full px-2 py-0.5 text-xs font-bold";
  
  const fupBadgeClass = isNeutral
    ? "border border-gray-200 bg-gray-50 text-gray-600 cursor-help flex items-center gap-1 pointer-events-auto rounded-full px-2 py-0.5 text-xs font-bold"
    : "border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-help flex items-center gap-1 pointer-events-auto rounded-full px-2 py-0.5 text-xs font-bold";

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* IP Type Badge */}
        {flagInfo.ipType && (
          <Badge
            variant="outline"
            className={ipBadgeClass}
          >
            {flagInfo.ipType.label}
          </Badge>
        )}

        {/* FUP Badge with Tooltip */}
        {flagInfo.fup && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="inline-flex cursor-help">
                <Badge
                  variant="outline"
                  className={fupBadgeClass}
                >
                  {flagInfo.fup.label}
                  <Info className="h-3 w-3" />
                </Badge>
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top"
              className="max-w-sm bg-white border border-gray-200 text-gray-700 p-3 z-[100] rounded-xl shadow-lg font-medium"
              sideOffset={8}
            >
              <p className="text-sm leading-relaxed whitespace-normal">{flagInfo.fup.description}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}



