// src/components/AppSidebar.tsx
import {
    LayoutDashboard,
    BanknoteArrowDown,
    BanknoteArrowUp,
    // X // Não precisamos mais importar X aqui, pois é usado no sidebar.tsx
} from "lucide-react";
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
} from "./ui/sidebar"; // Seus componentes de UI da sidebar

// Não precisamos mais de SheetClose ou Button aqui para o botão de fechar "X"
// import { SheetClose } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";

export function AppSidebarContent() {
    const items = [
        {
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboard,
        },
        {
            title: "Gastos",
            url: "/gastos",
            icon: BanknoteArrowDown,
        },
        {
            title: "Vendas",
            url: "/vendas",
            icon: BanknoteArrowUp,
        },
    ];

    return (
        <>
            {/* O SidebarHeader agora pode conter o título, se desejar, mas o botão X é adicionado pelo Sidebar */}
            <SidebarHeader className="flex items-center justify-between p-5 border-b border-gray-700 text-white">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                {/* REMOVIDO: O botão SheetClose foi movido para components/ui/sidebar.tsx */}
                {/*
                <SheetClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-gray-700"
                        aria-label="Fechar menu"
                    >
                        <X size={20} />
                    </Button>
                </SheetClose>
                */}
            </SidebarHeader>
            <SidebarContent className="p-5">
                <SidebarGroup className="mb-8">
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="block w-full text-left p-3 rounded-md text-gray-300 hover:bg-purple-600 hover:text-white transition-colors flex items-center space-x-3">
                                        <a href={item.url}>
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </>
    );
}