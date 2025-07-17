// src/components/AppSidebar.tsx
import {
    LayoutDashboard,
    BanknoteArrowDown,
    BanknoteArrowUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader, // Certifique-se que SidebarHeader está importado
} from "./ui/sidebar";

export function AppSidebarContent() {
    const navigate = useNavigate(); // Inicialize useNavigate

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
            {/* Ajuste o padding do SidebarHeader e o tamanho do H1 */}
            <SidebarHeader className="flex items-center justify-between p-6 border-b border-gray-700 text-white"> {/* Aumentado p-5 para p-6 */}
                <h1 className="text-3xl font-bold">Dashboard</h1> {/* Aumentado text-2xl para text-3xl */}
            </SidebarHeader>
            <SidebarContent className="p-6"> {/* Aumentado p-5 para p-6 para o conteúdo geral */}
                <SidebarGroup className="mb-8">
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        // REMOVIDO: asChild. Agora SidebarMenuButton renderizará um <button>
                                        className="block w-full text-left p-4 rounded-md text-gray-300 hover:bg-purple-600 hover:text-white transition-colors flex items-center space-x-4"
                                        onClick={() => navigate(item.url)} // Adiciona onClick para navegação usando useNavigate
                                    >
                                        <item.icon className="w-6 h-6" /> {/* Aumentado w-5 h-5 para w-6 h-6 */}
                                        <span>{item.title}</span>
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
