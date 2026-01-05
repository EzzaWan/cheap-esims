"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { NavigationUserMenu } from "@/components/NavigationUserMenu";
import { CurrencySelector } from "@/components/CurrencySelector";
import { SearchDropdown } from "@/components/SearchDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingBag, HelpCircle, User, Menu, X, Globe, LifeBuoy, LogIn, UserPlus, Smartphone, LogOut } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useIsAdmin();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push("/");
  };

  const navLinks = [
    { name: "eSIM Plans", href: "/", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Support", href: "/support", icon: <LifeBuoy className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-black/5 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-black font-bold p-1 rounded-md transform group-hover:-rotate-3 transition-transform">
             CE
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary-dark transition-colors">
              Cheap eSIMs
            </span>
          </div>
        </Link>

        {/* Search Bar - Centered */}
        <div className="hidden md:flex justify-center">
          <SearchDropdown />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <CurrencySelector />

          <div className="flex items-center gap-2">
            <SignedOut>
              <Button variant="ghost" asChild size="sm" className="text-muted-foreground hover:text-foreground font-medium rounded-full">
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button size="sm" asChild className="bg-black text-white hover:bg-primary hover:text-black font-bold rounded-full transition-colors">
                <Link href="/sign-up">
                  Sign Up
                </Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <NavigationUserMenu />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <div className="flex-1 max-w-xs">
            <SearchDropdown />
          </div>
          <CurrencySelector />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-900 hover:bg-gray-100 rounded-lg">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-l border-primary/30 w-[300px] p-0">
              <SheetHeader className="text-left border-b border-primary/30 pb-4 mb-4 px-6 pt-6">
                <SheetTitle className="text-primary text-xl font-bold uppercase flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  CHEAP ESIMS
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-6 px-6 pb-6">
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">MENU</h4>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive(link.href)
                          ? "bg-primary text-black"
                          : "text-white hover:bg-gray-800"
                      }`}
                    >
                      {link.icon}
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-primary/30" />

                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ACCOUNT</h4>
                  <SignedOut>
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start border border-gray-700 text-white hover:bg-gray-800 rounded-xl">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-black font-bold rounded-xl">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </Link>
                  </SignedOut>

                  <SignedIn>
                    <Link 
                      href="/account" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-white hover:bg-gray-800"
                    >
                      <User className="h-4 w-4" />
                      <span className="font-medium">My Account</span>
                    </Link>
                    <Link 
                      href="/my-esims" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-white hover:bg-gray-800"
                    >
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">My eSIMs</span>
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/admin" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-white hover:bg-gray-800"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span className="font-medium">Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-white hover:bg-gray-800 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Sign out</span>
                    </button>
                  </SignedIn>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
