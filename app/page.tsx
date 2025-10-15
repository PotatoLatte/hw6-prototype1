'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategorySummary, getMonthRange } from '@/lib/summary';
import transactions from '@/data/transactions.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

export default function Home() {
  const [monthOffset, setMonthOffset] = useState(0);

  const { year, month, label } = useMemo(() => {
    const now = new Date();
    now.setMonth(now.getMonth() + monthOffset);
    const { year, month } = getMonthRange(now);
    const label = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return { year, month, label };
  }, [monthOffset]);

  const { summaries, total } = useMemo(
    () => getCategorySummary(transactions, year, month),
    [year, month]
  );

  const chartData = summaries.map((s) => ({
    name: s.category,
    value: s.amount,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Monthly Summary
            </h1>
            <p className="text-slate-600 mt-1">{label}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={monthOffset === 0 ? 'default' : 'outline'}
              onClick={() => setMonthOffset(0)}
            >
              Current Month
            </Button>
            <Button
              variant={monthOffset === -1 ? 'default' : 'outline'}
              onClick={() => setMonthOffset(-1)}
            >
              Last Month
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Total Spending: ${total.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaries.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="pb-3 font-semibold text-slate-700">Category</th>
                        <th className="pb-3 font-semibold text-slate-700 text-right">
                          Amount
                        </th>
                        <th className="pb-3 font-semibold text-slate-700 text-right">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaries.map((s, idx) => (
                        <tr key={s.category} className="border-b border-slate-100">
                          <td className="py-3 flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                            />
                            {s.category}
                          </td>
                          <td className="py-3 text-right font-medium">
                            ${s.amount.toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-slate-600">
                            {s.percentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">
                No transactions found for this month.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
