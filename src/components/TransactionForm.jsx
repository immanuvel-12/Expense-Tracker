import { useState } from "react";
import { Plus, Minus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Travel",
    "Education",
    "Groceries",
    "Rent/Mortgage",
    "Insurance",
    "Personal Care",
    "Fitness & Sports",
    "Clothing",
    "Electronics",
    "Home & Garden",
    "Pets",
    "Gifts & Donations",
    "Business Expenses",
    "Other"
];
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const TransactionForm = ({ onAddTransaction, onGoalClick }) => {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)))
            return;
        onAddTransaction({
            type,
            amount: Number(amount),
            category: type === 'expense' ? category : undefined,
            description,
            date,
            month: selectedMonth
        });
        // Reset form
        setAmount('');
        setCategory('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
    };
    return (<Card className="p-6 bg-gradient-card shadow-card mb-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Add Transaction</h2>
      
      <div className="flex space-x-2 mb-4">
        <Button type="button" variant={type === 'income' ? 'success' : 'outline'} onClick={() => setType('income')} className="flex-1">
          <Plus className="w-4 h-4 mr-2"/>
          Income
        </Button>
        <Button type="button" variant={type === 'expense' ? 'destructive' : 'outline'} onClick={() => setType('expense')} className="flex-1">
          <Minus className="w-4 h-4 mr-2"/>
          Expense
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required/>
          </div>
          
          <div>
            <Label htmlFor="month">Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month"/>
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (<SelectItem key={month} value={month}>{month}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required/>
          </div>
        </div>

        {type === 'expense' && (<div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category"/>
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>)}

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description..." rows={2}/>
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="money" className="flex-1">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </Button>
          <Button type="button" variant="outline" onClick={onGoalClick} className="flex items-center gap-2">
            <Target className="w-4 h-4"/>
            Set Goal
          </Button>
        </div>
      </form>
    </Card>);
};
export default TransactionForm;
