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

export function getUniqueYears(items: { data: string }[]) {
  const years = items.map(item => new Date(item.data).getFullYear().toString());
  return Array.from(new Set(years)).sort();
}

export function getUniqueMonthsForYear(items: { data: string }[], year: string) {
  const months = items
    .filter(item => new Date(item.data).getFullYear().toString() === year)
    .map(item => (new Date(item.data).getMonth() + 1).toString().padStart(2, '0'));
  return Array.from(new Set(months)).sort();
}

// utils/index.ts - ADICIONE ESTA FUNÇÃO
export const safeFormatDate = (dateInput: string | Date | null): string => {
  try {
    if (!dateInput) return "Data inválida";
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) return "Data inválida";
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return "Data inválida";
  }
};