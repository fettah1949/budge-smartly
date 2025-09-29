import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { TransactionItem } from '@/components/TransactionItem';
import { getCountryByCode } from '@/lib/countries';

export default function Transactions() {
  const navigate = useNavigate();
  const { transactions, settings } = useApp();

  const country = settings ? getCountryByCode(settings.countryCode) : null;
  const currencySymbol = country?.currencySymbol || '$';

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="bg-card border-b p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">All Transactions</h1>
      </header>

      <div className="p-6">
        {transactions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📊</div>
              <p className="text-muted-foreground">No transactions yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {transactions.map(transaction => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
