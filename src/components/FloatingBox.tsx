function FloatingBox({
  children,
  containerClassName,
}: {
  children: React.ReactNode;
  containerClassName?: string;
}) {
  return (
    <div
      className={`bg-white pt-5 pr-6 pb-5 pl-6 rounded-lg gap-5 shadow-md flex flex-col ${
        containerClassName ? containerClassName : ""
      }`}
    >
      {children}
    </div>
  );
}

export default FloatingBox;
