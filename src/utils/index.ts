export const monthNames: Record<string, string> = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
}

export function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}

export function toCurrency(
  value: number,
  locale = "pt-BR",
  currency = "BRL"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value)
}
