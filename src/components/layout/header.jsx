"use client"

import { useState,useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "../theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Layers, 
  Search, 
  Bell, 
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../auth/auth-provider"
export default function Header(){
    const{user,logoutUser}=useAuth();
           const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessages] = useState(2); // Mock unread messages count
   
   // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Explore', href: '/explore' },
    { name: 'Events', href: '/events' },
    { name: 'Groups', href: '/groups' },
  ];

  return (
     <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-sm' 
          : 'bg-background'
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`${user?"/dashboard":"/"}`} className="flex items-center space-x-2">
              <Layers className="w-8 h-8 text-primary" />
              <span className="hidden text-xl font-bold sm:inline-block">GDG Social</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden space-x-1 md:flex">
            {user && navItems.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "default" : "ghost"}
                asChild
                className="px-3"
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </nav>
          
          {/* Search and Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative w-full max-w-[200px] lg:max-w-xs">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            {user ? (
              <>
                <Button size="icon" variant="ghost" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute w-2 h-2 rounded-full top-1 right-1 bg-destructive"></span>
                </Button>
                <Button size="icon" variant="ghost" asChild className="relative">
                  <Link href="/messages">
                    <MessageSquare className="w-5 h-5" />
                    {unreadMessages > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute flex items-center justify-center w-5 h-5 p-0 -top-1 -right-1"
                      >
                        {unreadMessages}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <ThemeToggle />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutUser}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="py-4 border-t md:hidden">
            <div className="flex items-center mb-4">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
              />
              <Search className="absolute left-6 top-[4.7rem] h-4 w-4 text-muted-foreground" />
            </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? "default" : "ghost"}
                  asChild
                  className="justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
              {user && (
                <Button
                  variant={pathname === '/messages' ? "default" : "ghost"}
                  asChild
                  className="justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/messages">Messages</Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}