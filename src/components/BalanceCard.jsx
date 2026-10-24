import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
const BalanceCard = ({ totalIncome, totalExpenses, balance }) => {
    const isNegative = balance < 0;
    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-success">${totalIncome.toFixed(2)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-success group-hover:scale-110 transition-transform duration-200"/>
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in group" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">${totalExpenses.toFixed(2)}</p>
          </div>
          <TrendingDown className="w-8 h-8 text-destructive group-hover:scale-110 transition-transform duration-200"/>
        </div>
      </Card>
      
      <Card className={`p-6 shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in group ${balance >= 0 ? 'bg-gradient-success text-white' : 'bg-gradient-card'}`} style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className={balance >= 0 ? "text-white/80" : "text-muted-foreground"}>Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-destructive'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <DollarSign className={`w-8 h-8 group-hover:scale-110 transition-transform duration-200 ${balance >= 0 ? 'text-white' : 'text-destructive'}`}/>
        </div>
      </Card>
    </div>);
};
export default BalanceCard;
