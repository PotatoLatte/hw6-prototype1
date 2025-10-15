export interface Transaction {
  date: string;
  amount: number;
  category: string;
  note: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export function getMonthRange(date: Date): { year: number; month: number } {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export function getCategorySummary(
  transactions: Transaction[],
  year: number,
  month: number
): { summaries: CategorySummary[]; total: number } {
  const filtered = transactions.filter((t) => {
    const [y, m] = t.date.split('-').map(Number);
    return y === year && m === month;
  });

  const categoryTotals = filtered.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const summaries: CategorySummary[] = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    })
  );

  summaries.sort((a, b) => b.amount - a.amount);

  return { summaries, total };
}
