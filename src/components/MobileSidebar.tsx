// src/components/MobileSidebar.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
// CORRIGIDO: Importe AppSidebarContent em vez de AppSidebar
import { AppSidebarContent } from "./AppSidebar"; // Verifique o caminho correto se for necessário

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="p-2">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        {/* CORRIGIDO: Use AppSidebarContent aqui */}
        <AppSidebarContent />
      </SheetContent>
    </Sheet>
  );
}