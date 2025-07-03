import React from 'react';

interface HeaderAppProps {
  title: string;
  // Nova prop para renderizar conteúdo à direita do título, como os botões de ação
  rightContent?: React.ReactNode;
}

export const HeaderApp: React.FC<HeaderAppProps> = ({ title, rightContent }) => (
  // O elemento <header> agora usa flexbox para alinhar o título e o conteúdo à direita
  // justify-between: distribui o espaço para que o primeiro item fique à esquerda e o último à direita
  // items-center: alinha os itens verticalmente ao centro
  // p-4: padding geral para o cabeçalho
  // bg-white shadow-md rounded-lg mb-6: Estilos para o cabeçalho em si
  <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-6">
    {/* Título da página */}
    {/* Ajustei o padding e a borda para se adequar ao novo layout flexível */}
    <h1 className="font-bold text-2xl text-purple-700">
      {title}
    </h1>
    
    {/* Renderiza o conteúdo passado para a direita (se houver) */}
    {rightContent}
  </header>
);
