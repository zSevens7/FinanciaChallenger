// src/components/AppSidebar.tsx
import {
    LayoutDashboard,
    BanknoteArrowDown,
    BanknoteArrowUp,
    User,
    LogOut, // <-- Importe o ícone de logout
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
} from "./ui/sidebar";

export function AppSidebarContent() {
    const navigate = useNavigate();

    // Função de logout simulada
    const handleLogout = () => {
        // Limpa o estado de login (simulado, por enquanto)
        console.log("Usuário deslogado.");
        // Redireciona para a página de login
        navigate('/');
    };

    const items = [
        {
            title: "Dashboard",
            url: "/dashboard", 
            icon: LayoutDashboard,
            action: () => navigate("/dashboard"),
        },
        {
            title: "Gastos",
            url: "/gastos",
            icon: BanknoteArrowDown,
            action: () => navigate("/gastos"),
        },
        {
            title: "Vendas",
            url: "/vendas",
            icon: BanknoteArrowUp,
            action: () => navigate("/vendas"),
        },
        {
            title: "Perfil",
            url: "/profile",
            icon: User,
            action: () => navigate("/profile"),
        },
    ];

    return (
        <>
            <SidebarHeader className="flex items-center justify-between p-6 border-b border-gray-700 text-white">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </SidebarHeader>
            <SidebarContent className="p-6">
                <SidebarGroup className="mb-8">
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className="w-full text-left p-4 rounded-md text-gray-300 hover:bg-purple-600 hover:text-white transition-colors flex items-center space-x-4"
                                        onClick={item.action} // <-- Chama a função de ação
                                    >
                                        <item.icon className="w-6 h-6" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* --- Grupo de Logout --- */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className="w-full text-left p-4 rounded-md text-gray-300 hover:bg-red-500 hover:text-white transition-colors flex items-center space-x-4"
                                    onClick={handleLogout} // <-- Chama a função de logout
                                >
                                    <LogOut className="w-6 h-6" />
                                    <span>Sair</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </>
    );
}