import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Target, Edit, Check, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const BudgetCard = ({ totalExpenses }) => {
    const [budget, setBudget] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const { toast } = useToast();
    useEffect(() => {
        const savedBudget = localStorage.getItem("monthlyBudget");
        if (savedBudget) {
            setBudget(parseFloat(savedBudget));
        }
    }, []);
    const handleSaveBudget = () => {
        const newBudget = parseFloat(inputValue);
        if (isNaN(newBudget) || newBudget <= 0) {
            toast({
                title: "Invalid Budget",
                description: "Please enter a valid budget amount.",
                variant: "destructive"
            });
            return;
        }
        setBudget(newBudget);
        localStorage.setItem("monthlyBudget", newBudget.toString());
        setIsEditing(false);
        setInputValue("");
        toast({
            title: "Budget Updated",
            description: `Monthly budget set to $${newBudget.toFixed(2)}`,
        });
    };
    const handleEditClick = () => {
        setInputValue(budget.toString());
        setIsEditing(true);
    };
    const budgetUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;
    const isOverBudget = totalExpenses > budget && budget > 0;
    const remaining = budget - totalExpenses;
    return (<Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary"/>
          <h3 className="text-lg font-semibold text-foreground">Monthly Budget</h3>
        </div>
        
        {!isEditing ? (<Button variant="ghost" size="sm" onClick={handleEditClick} className="hover:bg-primary/10">
            <Edit className="w-4 h-4"/>
          </Button>) : (<div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleSaveBudget} className="hover:bg-success/10 text-success">
              <Check className="w-4 h-4"/>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="hover:bg-destructive/10 text-destructive">
              <X className="w-4 h-4"/>
            </Button>
          </div>)}
      </div>

      {isEditing ? (<div className="space-y-3">
          <Input type="number" placeholder="Enter monthly budget" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="text-lg" onKeyPress={(e) => e.key === 'Enter' && handleSaveBudget()} autoFocus/>
        </div>) : budget > 0 ? (<div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-foreground">
              ${budget.toFixed(2)}
            </span>
            {isOverBudget && (<div className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="w-4 h-4"/>
                <span className="text-sm font-medium">Over Budget</span>
              </div>)}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className={isOverBudget ? "text-destructive font-medium" : "text-foreground"}>
                ${totalExpenses.toFixed(2)}
              </span>
            </div>
            
            <Progress value={Math.min(budgetUsed, 100)} className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`}/>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {isOverBudget ? "Over by" : "Remaining"}
              </span>
              <span className={isOverBudget ? "text-destructive font-medium" : "text-success font-medium"}>
                ${Math.abs(remaining).toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            {budgetUsed.toFixed(1)}% of budget used
          </div>
        </div>) : (<div className="text-center py-4">
          <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2"/>
          <p className="text-muted-foreground">Set your monthly budget to track spending</p>
        </div>)}
    </Card>);
};
export default BudgetCard;
