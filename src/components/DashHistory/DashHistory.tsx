// src/components/DashHistory/subcomponents/HistorySelectButton.tsx
import React from 'react';

interface HistorySelectButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red'; // Nova prop de cor
}

const HistorySelectButton: React.FC<HistorySelectButtonProps> = ({
  label,
  isSelected,
  onClick,
  color = 'blue'
}) => {
  const getColorClasses = () => {
    if (!isSelected) {
      return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    }
    
    switch (color) {
      case 'green':
        return 'bg-green-600 text-white';
      case 'red':
        return 'bg-red-600 text-white';
      case 'blue':
      default:
        return 'bg-blue-800 text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out ${getColorClasses()}`}
    >
      {label}
    </button>
  );
};

export default HistorySelectButton;