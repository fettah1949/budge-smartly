import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Settings } from '@/types';
import { storageService } from '@/services/storage';
import { toast } from '@/hooks/use-toast';

interface AppContextType {
  transactions: Transaction[];
  settings: Settings | null;
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await storageService.init();
      const [loadedTransactions, loadedSettings] = await Promise.all([
        storageService.getAllTransactions(),
        storageService.getSettings(),
      ]);
      
      setTransactions(loadedTransactions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const transaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    try {
      await storageService.addTransaction(transaction);
      setTransactions(prev => [transaction, ...prev]);
      toast({
        title: 'Success',
        description: `Transaction ${transaction.type === 'income' ? 'income' : 'expense'} added`,
      });
    } catch (error) {
      console.error('Failed to add transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add transaction',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    const updated = { ...transaction, updatedAt: new Date().toISOString() };
    try {
      await storageService.updateTransaction(updated);
      setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
      toast({
        title: 'Success',
        description: 'Transaction updated',
      });
    } catch (error) {
      console.error('Failed to update transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transaction',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await storageService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Transaction deleted',
      });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      await storageService.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const refreshTransactions = async () => {
    try {
      const loadedTransactions = await storageService.getAllTransactions();
      setTransactions(loadedTransactions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        settings,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateSettings,
        refreshTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
