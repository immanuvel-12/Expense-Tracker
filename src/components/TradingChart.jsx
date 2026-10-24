import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
const TradingChart = ({ transactions }) => {
    // Generate trading-style data based on balance over time
    const generateTradingData = () => {
        if (transactions.length === 0)
            return [];
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let runningBalance = 0;
        const tradingData = sortedTransactions.map((transaction, index) => {
            if (transaction.type === 'income') {
                runningBalance += transaction.amount;
            }
            else {
                runningBalance -= transaction.amount;
            }
            return {
                date: new Date(transaction.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric'
                }),
                balance: runningBalance,
                // Add some trading-style metrics
                high: runningBalance + (Math.random() * 500),
                low: runningBalance - (Math.random() * 300),
                volume: Math.abs(transaction.amount),
                change: index > 0 ? runningBalance - (index === 1 ? transaction.amount : 0) : 0,
            };
        });
        return tradingData;
    };
    const chartData = generateTradingData();
    const currentBalance = chartData.length > 0 ? chartData[chartData.length - 1].balance : 0;
    const previousBalance = chartData.length > 1 ? chartData[chartData.length - 2].balance : 0;
    const change = currentBalance - previousBalance;
    const changePercent = previousBalance !== 0 ? ((change / previousBalance) * 100) : 0;
    if (chartData.length === 0) {
        return (<Card className="p-6 bg-gradient-card shadow-card">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Portfolio Overview</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>No trading data available. Add transactions to see your portfolio performance!</p>
        </div>
      </Card>);
    }
    return (<Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Portfolio Performance</h2>
        <div className="flex items-center space-x-2">
          {change >= 0 ? (<TrendingUp className="w-5 h-5 text-success"/>) : (<TrendingDown className="w-5 h-5 text-destructive"/>)}
          <span className={`text-sm font-medium ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
            {change >= 0 ? '+' : ''}${change.toFixed(2)} ({changePercent.toFixed(1)}%)
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground">${currentBalance.toFixed(2)}</div>
        <div className="text-sm text-muted-foreground">Current Balance</div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentBalance >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={currentBalance >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>
            <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value}`}/>
            <Tooltip formatter={(value, name) => {
            if (name === 'balance')
                return [`$${value.toFixed(2)}`, 'Balance'];
            if (name === 'volume')
                return [`$${value.toFixed(2)}`, 'Transaction Volume'];
            return [`$${value.toFixed(2)}`, name];
        }} labelStyle={{ color: 'hsl(var(--foreground))' }} contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
        }}/>
            <Area type="monotone" dataKey="balance" stroke={currentBalance >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"} strokeWidth={2} fill="url(#balanceGradient)" name="balance"/>
            <Line type="monotone" dataKey="high" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="5 5" dot={false} name="high"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-success">
            ${Math.max(...chartData.map(d => d.high)).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">Day High</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-destructive">
            ${Math.min(...chartData.map(d => d.low)).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">Day Low</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-foreground">
            ${chartData.reduce((sum, d) => sum + d.volume, 0).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Volume</div>
        </div>
      </div>
    </Card>);
};
export default TradingChart;
