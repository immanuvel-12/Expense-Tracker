import { Trash2, Calendar, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const SpendingHistory = ({ transactions, onDeleteTransaction, onClearAll }) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return (<Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
        {transactions.length > 0 && (<Button variant="destructive" size="sm" onClick={onClearAll}>
            Clear All
          </Button>)}
      </div>

      {transactions.length === 0 ? (<div className="text-center py-8 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50"/>
          <p>No transactions yet. Add your first transaction above!</p>
        </div>) : (<div className="space-y-3">
          {sortedTransactions.map((transaction) => (<div key={transaction.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-card transition-smooth">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4"/>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                  
                  {transaction.category && (<div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Tag className="w-4 h-4"/>
                      <span>{transaction.category}</span>
                    </div>)}
                </div>
                
                <p className="font-medium text-foreground mt-1">
                  {transaction.description || (transaction.type === 'income' ? 'Income' : 'Expense')}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </span>
                
                <Button variant="ghost" size="sm" onClick={() => onDeleteTransaction(transaction.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                  <Trash2 className="w-4 h-4"/>
                </Button>
              </div>
            </div>))}
        </div>)}
    </Card>);
};
export default SpendingHistory;
