export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-white w-full h-full flex flex-col">
      {children}
    </div>
  );
}
