import { formatDate } from "../../../utils"

interface Gasto {
  id: number
  descricao: string
  preco: number | null
  categoria: string
  tipoDespesa: string
  data: string
}

interface GastosTableProps {
  gastos: Gasto[]
}

export const GastosTable = ({ gastos }: GastosTableProps) => (
  <div className="overflow-x-auto mt-4 shadow rounded-lg">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-3 text-left">Data</th>
          <th className="p-3 text-left">Descrição</th>
          <th className="p-3 text-right">Preço (R$)</th>
          <th className="p-3 text-left">Categoria</th>
          <th className="p-3 text-left">Tipo</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {gastos.length > 0 ? (
          gastos.map(g => (
            <tr key={g.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{formatDate(g.data)}</td>
              <td className="p-3 truncate" title={g.descricao}>
                {g.descricao}
              </td>
              <td className="p-3 text-right">
                {(g.preco ?? 0).toFixed(2)}
              </td>
              <td className="p-3">{g.categoria}</td>
              <td className="p-3">{g.tipoDespesa}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="p-4 text-center text-gray-500">
              Nenhum gasto encontrado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)
