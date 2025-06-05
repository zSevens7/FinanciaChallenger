export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-purple-50 w-full h-full flex flex-col">
      {children}
    </div>
  );
}
