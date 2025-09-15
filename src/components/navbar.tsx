
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const shipLinks = [
  { href: "/ships/msc-virtuosa", label: "MSC Virtuosa" },
  { href: "/ships/msc-poesia", label: "MSC Poesia" },
  { href: "/ships/msc-preziosa", label: "MSC Preziosa" },
];

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
];

export function Navbar() {
  const pathname = usePathname();

  const DesktopNavLinks = () => (
    <>
      <Link
        href="/"
        className={cn(
            "text-sm font-medium transition-colors hover:text-primary-foreground/80",
            pathname === "/" ? "text-white" : "text-primary-foreground/60"
        )}
      >
        Home
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn(
            "text-sm font-medium transition-colors hover:text-primary-foreground/80 hover:bg-transparent p-0",
            pathname.startsWith("/ships") ? "text-white" : "text-primary-foreground/60"
          )}>
            Ships <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {shipLinks.map(({ href, label }) => (
            <DropdownMenuItem key={href} asChild>
              <Link href={href}>{label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/about"
        className={cn(
            "text-sm font-medium transition-colors hover:text-primary-foreground/80",
            pathname === "/about" ? "text-white" : "text-primary-foreground/60"
        )}
      >
        About Us
      </Link>
       <Link
        href="/terms"
        className={cn(
            "text-sm font-medium transition-colors hover:text-primary-foreground/80",
            pathname === "/terms" ? "text-white" : "text-primary-foreground/60"
        )}
      >
        Terms & Conditions
      </Link>
      <Link
        href="/privacy"
        className={cn(
            "text-sm font-medium transition-colors hover:text-primary-foreground/80",
            pathname === "/privacy" ? "text-white" : "text-primary-foreground/60"
        )}
      >
        Privacy Policy
      </Link>
      <Link
        href="/cookies"
        className={cn(
            "text-sm font-medium transition-colors hover:text-primary-foreground/80",
            pathname === "/cookies" ? "text-white" : "text-primary-foreground/60"
        )}
      >
        Cookie Policy
      </Link>
    </>
  );

  const MobileNavLinks = () => (
    <>
        <SheetClose asChild>
          <Link href="/" className={cn("block py-2 text-lg font-medium", pathname === "/" ? "text-white" : "text-primary-foreground/60")}>Home</Link>
        </SheetClose>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ships" className="border-b-0">
                <AccordionTrigger className={cn("py-2 text-lg font-medium hover:no-underline", pathname.startsWith("/ships") ? "text-white" : "text-primary-foreground/60")}>Ships</AccordionTrigger>
                <AccordionContent className="pb-0 pl-4">
                    {shipLinks.map(({ href, label }) => (
                         <SheetClose asChild key={href}>
                           <Link href={href} className="block py-2 text-lg font-medium text-primary-foreground/60">{label}</Link>
                         </SheetClose>
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        <SheetClose asChild>
          <Link href="/about" className={cn("block py-2 text-lg font-medium", pathname === "/about" ? "text-white" : "text-primary-foreground/60")}>About Us</Link>
        </SheetClose>
        <SheetClose asChild>
          <Link href="/terms" className={cn("block py-2 text-lg font-medium", pathname === "/terms" ? "text-white" : "text-primary-foreground/60")}>Terms & Conditions</Link>
        </SheetClose>
        <SheetClose asChild>
          <Link href="/privacy" className={cn("block py-2 text-lg font-medium", pathname === "/privacy" ? "text-white" : "text-primary-foreground/60")}>Privacy Policy</Link>
        </SheetClose>
        <SheetClose asChild>
          <Link href="/cookies" className={cn("block py-2 text-lg font-medium", pathname === "/cookies" ? "text-white" : "text-primary-foreground/60")}>Cookie Policy</Link>
        </SheetClose>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Get That Cruise Logo" width={40} height={40} className="rounded-md" />
          <span className="hidden font-bold text-primary-foreground sm:inline-block">
            Get That Cruise
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <DesktopNavLinks />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary-foreground" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-primary text-primary-foreground">
              <div className="grid gap-6 p-6">
                 <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2">
                      <Image src="/logo.png" alt="Get That Cruise Logo" width={32} height={32} />
                      <span className="font-bold">Get That Cruise</span>
                  </Link>
                </SheetClose>
                <nav className="grid gap-4">
                  <MobileNavLinks />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
