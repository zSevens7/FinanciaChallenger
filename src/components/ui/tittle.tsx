// src/components/ui/tittle.tsx
import React, { useEffect, useRef } from 'react';

/**
 * @interface TitleEffectProps
 * @description Props para o componente TitleEffect.
 * @property {string} baseTitle - O título principal da página (ex: "Minha Aplicação").
 * @property {string} [effect] - Um texto ou emoji para ser concatenado ao baseTitle (ex: " (Salvando...)").
 * @property {string} [status] - Um status predefinido para formatar o título (ex: "saving", "offline").
 * @property {string} [icon] - Um ícone/emoji para prefixar o título (ex: "💾", "🔴").
 */
interface TitleEffectProps {
  baseTitle: string;
  effect?: string;
  status?: 'saving' | 'offline' | 'online' | string; // Adicione mais tipos de status se necessário
  icon?: string;
}

/**
 * @component TitleEffect
 * @description Um componente que gerencia o título da aba do navegador dinamicamente.
 * Ele não renderiza nenhum elemento no DOM, apenas manipula `document.title`.
 */
const TitleEffect: React.FC<TitleEffectProps> = ({
  baseTitle,
  effect,
  status,
  icon
}) => {
  // useRef para armazenar o título original do documento na primeira montagem.
  // Isso é importante para restaurar o título quando o componente é desmontado.
  const originalTitle = useRef(document.title);

  useEffect(() => {
    let newTitle = baseTitle;

    // Lógica para construir o novo título com base nas props fornecidas
    if (effect) {
      newTitle = `${baseTitle}${effect}`;
    } else if (status) {
      // Switch case para gerenciar diferentes estados de status
      switch (status) {
        case 'saving':
          newTitle = `💾 ${baseTitle} (Salvando...)`;
          break;
        case 'offline':
          newTitle = `🔴 ${baseTitle} (Offline)`;
          break;
        case 'online':
          newTitle = `🟢 ${baseTitle}`;
          break;
        default:
          // Se o status não for reconhecido, apenas usa o baseTitle
          newTitle = `${baseTitle}`;
      }
    } else if (icon) {
      // Adiciona um ícone se fornecido e nenhuma outra opção de efeito/status for usada
      newTitle = `${icon} ${baseTitle}`;
    }

    // Atualiza o título da aba do navegador
    document.title = newTitle;

    // Função de limpeza do useEffect.
    // Esta função é executada quando o componente é desmontado ou antes do useEffect ser re-executado.
    // Garante que o título original seja restaurado, evitando efeitos indesejados.
    return () => {
      document.title = originalTitle.current;
    };
  }, [baseTitle, effect, status, icon]); // Dependências do useEffect.
  // O efeito será re-executado se qualquer uma dessas props mudar.

  // Este componente não renderiza nada visível no DOM.
  return null;
};

export default TitleEffect;
