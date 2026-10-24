import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";
const CategorySpendingChart = ({ transactions }) => {
    // Calculate spending by category
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryData = expenseTransactions.reduce((acc, transaction) => {
        const category = transaction.category || 'Other';
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
    }, {});
    const chartData = Object.entries(categoryData)
        .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: ((amount / expenseTransactions.reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)
    }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8); // Show top 8 categories
    const COLORS = [
        'hsl(var(--primary))',
        'hsl(var(--success))',
        'hsl(var(--warning))',
        'hsl(var(--destructive))',
        'hsl(var(--muted))',
        'hsl(150, 60%, 45%)',
        'hsl(200, 60%, 45%)',
        'hsl(280, 60%, 45%)',
    ];
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (<div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground">{data.payload.name}</p>
          <p className="text-primary">
            Amount: <span className="font-semibold">${data.payload.value.toFixed(2)}</span>
          </p>
          <p className="text-muted-foreground text-sm">
            {data.payload.percentage}% of total expenses
          </p>
        </div>);
        }
        return null;
    };
    if (chartData.length === 0) {
        return (<Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Spending by Category</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No expense data available</p>
        </div>
      </Card>);
    }
    return (<Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Spending by Category</h3>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} innerRadius={40} paddingAngle={5} dataKey="value">
              {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
            </Pie>
            <Tooltip content={<CustomTooltip />}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.map((item, index) => (<div key={item.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}/>
            <span className="text-foreground font-medium">{item.name}</span>
            <span className="text-muted-foreground text-xs">({item.percentage}%)</span>
          </div>))}
      </div>
    </Card>);
};
export default CategorySpendingChart;
