import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { categories } from '@/lib/categories';
import { CategoryType, TransactionType } from '@/types';
import { getCountryByCode } from '@/lib/countries';

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction, settings } = useApp();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('other');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const country = settings ? getCountryByCode(settings.countryCode) : null;
  const currency = country?.currency || 'USD';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await addTransaction({
        amount: parseFloat(amount),
        category,
        type,
        date: new Date(date).toISOString(),
        notes: notes.trim() || undefined,
        currency,
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [10, 20, 50, 100, 200, 500];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="bg-card border-b p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Add Transaction</h1>
      </header>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={type === 'expense' ? 'default' : 'outline'}
                    className={type === 'expense' ? 'bg-expense hover:bg-expense/90' : ''}
                    onClick={() => setType('expense')}
                  >
                    Expense
                  </Button>
                  <Button
                    type="button"
                    variant={type === 'income' ? 'default' : 'outline'}
                    className={type === 'income' ? 'bg-income hover:bg-income/90' : ''}
                    onClick={() => setType('income')}
                  >
                    Income
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="text-2xl font-bold h-14"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickAmounts.map(qa => (
                    <Button
                      key={qa}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setAmount(qa.toString())}
                    >
                      {qa}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as CategoryType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add a note..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Transaction'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
