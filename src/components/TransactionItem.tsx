import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { getCategoryById } from '@/lib/categories';
import { useApp } from '@/contexts/AppContext';

interface TransactionItemProps {
  transaction: Transaction;
  currencySymbol: string;
}

export function TransactionItem({ transaction, currencySymbol }: TransactionItemProps) {
  const { deleteTransaction } = useApp();
  const category = getCategoryById(transaction.category);
  
  const handleDelete = async () => {
    if (confirm('Delete this transaction?')) {
      await deleteTransaction(transaction.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl flex-shrink-0">{category.icon}</div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{transaction.notes || category.name}</p>
            <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
          </div>

          <div className="text-right flex-shrink-0">
            <p className={`font-bold ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
            </p>
            <p className="text-xs text-muted-foreground">{category.name}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
