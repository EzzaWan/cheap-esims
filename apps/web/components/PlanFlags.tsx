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
  
  // Neutral styling for list pages (no color coding) - adapted to Neo-Brutalist theme
  const ipBadgeClass = isNeutral
    ? "border-2 border-black bg-transparent text-gray-600"
    : "border-2 border-purple-500 bg-purple-50 text-purple-900 hover:bg-purple-100";
  
  const fupBadgeClass = isNeutral
    ? "border-2 border-black bg-transparent text-gray-600 cursor-help flex items-center gap-1 pointer-events-auto"
    : "border-2 border-yellow-500 bg-yellow-50 text-yellow-900 hover:bg-yellow-100 cursor-help flex items-center gap-1 pointer-events-auto";

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
              className="max-w-sm bg-white border-2 border-black text-black p-3 z-[100] rounded-none shadow-hard"
              sideOffset={8}
            >
              <p className="text-sm leading-relaxed whitespace-normal font-mono font-bold">{flagInfo.fup.description}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

