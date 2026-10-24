import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
const ExpenseChart = ({ transactions }) => {
    // Group transactions by month
    const monthlyData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[monthKey]) {
            acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };
        }
        if (transaction.type === 'income') {
            acc[monthKey].income += transaction.amount;
        }
        else {
            acc[monthKey].expenses += transaction.amount;
        }
        return acc;
    }, {});
    const chartData = Object.values(monthlyData)
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(data => ({
        ...data,
        month: new Date(data.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }));
    if (chartData.length === 0) {
        return (<Card className="p-6 bg-gradient-card shadow-card">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Monthly Overview</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>No data available for chart. Add some transactions to see your monthly overview!</p>
        </div>
      </Card>);
    }
    return (<Card className="p-6 bg-gradient-card shadow-card">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Monthly Income vs Expenses</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>
            <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `₹${value}`}/>
            <Tooltip formatter={(value, name) => [`₹${value.toFixed(2)}`, name === 'income' ? 'Income' : 'Expenses']} labelStyle={{ color: 'hsl(var(--foreground))' }} contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
        }}/>
            <Bar dataKey="income" fill="hsl(var(--success))" name="income" radius={[4, 4, 0, 0]}/>
            <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="expenses" radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>);
};
export default ExpenseChart;
