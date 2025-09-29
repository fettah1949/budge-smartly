import { Category } from '@/types';

export const categories: Category[] = [
  { id: 'food', name: 'Food', icon: '🍔', color: 'hsl(25, 95%, 53%)' },
  { id: 'rent', name: 'Rent', icon: '🏠', color: 'hsl(217, 91%, 60%)' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'hsl(142, 76%, 36%)' },
  { id: 'bills', name: 'Bills', icon: '📄', color: 'hsl(48, 96%, 53%)' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'hsl(340, 82%, 52%)' },
  { id: 'salary', name: 'Salary', icon: '💰', color: 'hsl(142, 71%, 45%)' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'hsl(271, 76%, 53%)' },
  { id: 'health', name: 'Health', icon: '⚕️', color: 'hsl(0, 84%, 60%)' },
  { id: 'other', name: 'Other', icon: '📌', color: 'hsl(215, 16%, 47%)' },
];

export const getCategoryById = (id: string) => {
  return categories.find(cat => cat.id === id) || categories[categories.length - 1];
};
