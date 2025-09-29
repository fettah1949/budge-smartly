import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { getCountryByCode } from '@/lib/countries';
import { getCategoryById } from '@/lib/categories';
import { TransactionType } from '@/types';

export default function Summary() {
  const { transactions, settings } = useApp();
  const [period, setPeriod] = useState<'month' | 'last-month' | 'all'>('month');

  const country = settings ? getCountryByCode(settings.countryCode) : null;
  const currencySymbol = country?.currencySymbol || '$';

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
      const transDate = new Date(t.date);
      
      if (period === 'month') {
        return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
      } else if (period === 'last-month') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return transDate.getMonth() === lastMonth && transDate.getFullYear() === lastMonthYear;
      }
      return true; // 'all'
    });
  }, [transactions, period]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category: getCategoryById(category),
        amount,
        percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
      }));

    return {
      income,
      expenses,
      balance: income - expenses,
      categoryBreakdown,
      topCategories,
    };
  }, [filteredTransactions]);

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Summary</h1>
        
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="bg-primary-foreground/10 border-0 text-primary-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Income</p>
              <p className="font-bold text-income">{formatCurrency(stats.income)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Expenses</p>
              <p className="font-bold text-expense">{formatCurrency(stats.expenses)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Balance</p>
              <p className={`font-bold ${stats.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(stats.balance)}
              </p>
            </CardContent>
          </Card>
        </div>

        {stats.topCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Expense Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.topCategories.map(({ category, amount, percentage }) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {filteredTransactions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📊</div>
              <p className="text-muted-foreground">No transactions in this period</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
