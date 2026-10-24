import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import BalanceCard from "@/components/BalanceCard";
import TransactionForm from "@/components/TransactionForm";
import SpendingHistory from "@/components/SpendingHistory";
import OverspendingAlert from "@/components/OverspendingAlert";
import TradingChart from "@/components/TradingChart";
import BudgetCard from "@/components/BudgetCard";
import CategorySpendingChart from "@/components/CategorySpendingChart";
import About from "@/pages/About";
import Prediction from "@/pages/Prediction";
import Goal from "@/pages/Goal";
import { useToast } from "@/hooks/use-toast";
import { auth, transactions as txApi } from "@/lib/backend";
const Dashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState("home");
    const [transactions, setTransactions] = useState([]);
    const [showOverspendingAlert, setShowOverspendingAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    // Load transactions from Supabase on component mount
    useEffect(() => {
        loadTransactions();
    }, []);
    const loadTransactions = async () => {
        try {
            let data;
            try {
                data = await txApi.list();
            }
            catch (error) {
                console.error('Error loading transactions:', error);
                toast({
                    title: "Error",
                    description: "Failed to load transactions.",
                    variant: "destructive"
                });
                return;
            }
            // Transform the data to match the Transaction interface
            const transformedData = (data || []).map(item => ({
                id: item.id,
                type: item.type,
                amount: Number(item.amount),
                category: item.category || undefined,
                description: item.description,
                date: item.date,
                month: item.month || undefined,
            }));
            setTransactions(transformedData);
        }
        catch (error) {
            console.error('Error loading transactions:', error);
        }
        finally {
            setLoading(false);
        }
    };
    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    // Check for overspending
    useEffect(() => {
        if (balance < 0 && transactions.length > 0) {
            setShowOverspendingAlert(true);
        }
    }, [balance, transactions.length]);
    const addTransaction = async (transactionData) => {
        try {
            const user = await auth.getUser();
            if (!user) {
                toast({
                    title: "Error",
                    description: "You must be logged in to add transactions.",
                    variant: "destructive"
                });
                return;
            }
            const data = await txApi.add({
                type: transactionData.type,
                amount: transactionData.amount,
                category: transactionData.category,
                description: transactionData.description,
                date: transactionData.date,
                month: transactionData.month,
            });
            // Add to local state
            const newTransaction = {
                id: data.id,
                type: data.type,
                amount: Number(data.amount),
                category: data.category || undefined,
                description: data.description,
                date: data.date,
                month: data.month || undefined,
            };
            setTransactions(prev => [newTransaction, ...prev]);
            toast({
                title: "Transaction Added",
                description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of $${transactionData.amount.toFixed(2)} has been recorded.`,
            });
        }
        catch (error) {
            console.error('Error adding transaction:', error);
            toast({
                title: "Error",
                description: "Failed to add transaction.",
                variant: "destructive"
            });
        }
    };
    const deleteTransaction = async (id) => {
        try {
            await txApi.remove(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
            toast({
                title: "Transaction Deleted",
                description: "The transaction has been removed from your history.",
            });
        }
        catch (error) {
            console.error('Error deleting transaction:', error);
            toast({
                title: "Error",
                description: "Failed to delete transaction.",
                variant: "destructive"
            });
        }
    };
    const clearAllTransactions = async () => {
        try {
            await txApi.clear();
            // Clear transactions
            setTransactions([]);
            setShowOverspendingAlert(false);
            // Clear budget from localStorage
            localStorage.removeItem("monthlyBudget");
            // Clear goal and progress from localStorage
            localStorage.removeItem("yearlyGoal");
            localStorage.removeItem("goalProgress");
            toast({
                title: "Success",
                description: "All data has been cleared - transactions, budget, and goals reset.",
            });
        }
        catch (error) {
            console.error('Error clearing transactions:', error);
            toast({
                title: "Error",
                description: "Failed to clear transactions.",
                variant: "destructive"
            });
        }
    };
    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return (<div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <BalanceCard totalIncome={totalIncome} totalExpenses={totalExpenses} balance={balance}/>
              </div>
              <BudgetCard totalExpenses={totalExpenses}/>
            </div>
            
            <OverspendingAlert isVisible={showOverspendingAlert} onClose={() => setShowOverspendingAlert(false)} overspentAmount={Math.abs(balance)}/>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <TransactionForm onAddTransaction={addTransaction} onGoalClick={() => setActiveTab("goal")}/>
                <CategorySpendingChart transactions={transactions}/>
              </div>
              <TradingChart transactions={transactions}/>
            </div>
          </div>);
            case "transactions":
                return (<SpendingHistory transactions={transactions} onDeleteTransaction={deleteTransaction} onClearAll={clearAllTransactions}/>);
            case "prediction":
                return <Prediction transactions={transactions}/>;
            case "goal":
                return <Goal />;
            case "about":
                return <About />;
            default:
                return null;
        }
    };
    return (<div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout}/>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>);
};
export default Dashboard;
