import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { TransactionItem } from '@/components/TransactionItem';
import { getCountryByCode } from '@/lib/countries';

export default function Home() {
  const { transactions, settings } = useApp();

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      balance: income - expenses,
      income,
      expenses,
    };
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);
  const country = settings ? getCountryByCode(settings.countryCode) : null;
  const currencySymbol = country?.currencySymbol || '$';

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Budgena</h1>
        
        <div className="space-y-2">
          <p className="text-sm opacity-90">Current Balance</p>
          <p className="text-4xl font-bold">{formatCurrency(stats.balance)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="bg-primary-foreground/10 border-0 backdrop-blur">
            <CardContent className="p-4">
              <p className="text-xs opacity-90 mb-1">Income</p>
              <p className="text-xl font-semibold text-income">{formatCurrency(stats.income)}</p>
            </CardContent>
          </Card>
          <Card className="bg-primary-foreground/10 border-0 backdrop-blur">
            <CardContent className="p-4">
              <p className="text-xs opacity-90 mb-1">Expenses</p>
              <p className="text-xl font-semibold text-expense">{formatCurrency(stats.expenses)}</p>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Link to="/transactions">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📊</div>
              <p className="text-muted-foreground mb-4">No transactions yet</p>
              <Link to="/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Transaction
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map(transaction => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        )}
      </div>

      <Link to="/add" className="fixed bottom-20 right-6">
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
