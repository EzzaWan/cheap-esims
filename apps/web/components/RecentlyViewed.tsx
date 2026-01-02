"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Package, Globe, X } from "lucide-react";
import { getRecentlyViewed, clearRecentlyViewed, type RecentlyViewedItem } from "@/lib/recently-viewed";
import { Button } from "@/components/ui/button";

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  if (items.length === 0) {
    return null;
  }

  const handleClear = () => {
    clearRecentlyViewed();
    setItems([]);
  };

  return (
    <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-2xl mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Clock className="h-5 w-5 text-primary-dark" />
          </div>
          <h3 className="text-xl font-bold text-black tracking-tight">Recently Viewed</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full px-3 h-8"
        >
          Clear History <X className="h-3 w-3 ml-1.5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-start gap-4 p-4 border border-gray-100 bg-white rounded-xl hover:border-gray-200 hover:shadow-md transition-all group"
          >
            <div className="mt-1 p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
               {item.type === 'plan' ? (
                 <Package className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
               ) : (
                 <Globe className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
               )}
            </div>
            
            <div className="min-w-0 flex-1 pt-1">
              <span className="block font-bold text-sm text-gray-900 group-hover:text-primary-dark line-clamp-1">
                {item.name}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 block tracking-wide">
                {item.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

