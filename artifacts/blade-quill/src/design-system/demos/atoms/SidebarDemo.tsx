import { Home, Image, ShoppingBag } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function SidebarDemo() {
  return (
    <div className="h-64 overflow-hidden rounded-lg border border-border">
      <SidebarProvider className="min-h-0 h-full">
        <Sidebar collapsible="none" className="h-full border-r border-border">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Studio</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home className="w-4 h-4" /> Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <ShoppingBag className="w-4 h-4" /> Products
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Image className="w-4 h-4" /> Gallery
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4 text-sm text-muted-foreground">
          Content area
        </main>
      </SidebarProvider>
    </div>
  );
}
