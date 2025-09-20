import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, Trophy, Gift, User, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    title: "Rewards Store",
    url: createPageUrl("Rewards"),
    icon: Gift,
    color: "text-teal-600",
    bgColor: "bg-teal-100"
  },
  {
    title: "Leaderboard",
    url: createPageUrl("Leaderboard"),
    icon: Trophy,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary-orange: #f97316;
            --primary-teal: #0d9488;
            --accent-yellow: #f59e0b;
            --bg-pattern: radial-gradient(circle at 20% 80%, #fef3c7 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ecfdf5 0%, transparent 50%);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-white to-teal-50" style={{background: 'var(--bg-pattern)'}}>
        <Sidebar className="border-r border-orange-200/50 backdrop-blur-sm bg-white/80">
          <SidebarHeader className="border-b border-orange-200/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">KRIDHA</h2>
                <p className="text-xs text-gray-500 font-medium">Gamified Tasks & Rewards</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`h-12 rounded-xl transition-all duration-300 hover:scale-105 ${
                          location.pathname === item.url 
                            ? `${item.bgColor} ${item.color} font-semibold shadow-md` 
                            : 'hover:bg-orange-50 hover:text-orange-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-4 px-4">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-200/50 p-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">Player</p>
                <p className="text-xs text-gray-500 truncate">Level 1 • 0 Points</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/70 backdrop-blur-sm border-b border-orange-200/50 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">KRIDHA</h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}