const HistorySelectButton = ({
  label,
  onClick,
  isSelected,
}: {
  label: string;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const className = isSelected
    ? "text-purple-500  border-b"
    : "text-purple-200 cursor-pointer";
  return (
    <div className={`${className} font-bold`} onClick={onClick}>
      {label}
    </div>
  );
};

export default HistorySelectButton;
