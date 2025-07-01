
interface HeaderAppProps {
  title: string; 
}

export const HeaderApp = ({ title }: HeaderAppProps) => (
  <header className="mb-8">
    <h1 className="p-6 font-bold text-2xl text-purple-700 border-b border-purple-700 mb-7 ">
      {title}
    </h1>
  </header>
);