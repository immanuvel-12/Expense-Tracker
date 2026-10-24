import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const Goal = () => {
    const [yearlyGoal, setYearlyGoal] = useState('');
    const [savedGoal, setSavedGoal] = useState(0);
    const [currentProgress, setCurrentProgress] = useState(0);
    const { toast } = useToast();
    // Calculate days
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
    const totalDays = 365; // Using 365 as requested
    const daysPassed = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = totalDays - daysPassed;
    // Calculate progress percentage
    const timeProgress = (daysPassed / totalDays) * 100;
    const goalProgress = savedGoal > 0 ? (currentProgress / savedGoal) * 100 : 0;
    useEffect(() => {
        // Load saved goal from localStorage
        const saved = localStorage.getItem('yearlyGoal');
        if (saved) {
            setSavedGoal(Number(saved));
        }
        // Load current progress (you can integrate this with actual transaction data)
        const progress = localStorage.getItem('goalProgress');
        if (progress) {
            setCurrentProgress(Number(progress));
        }
    }, []);
    const handleSaveGoal = () => {
        if (!yearlyGoal || isNaN(Number(yearlyGoal))) {
            toast({
                title: "Invalid Goal",
                description: "Please enter a valid goal amount.",
                variant: "destructive",
            });
            return;
        }
        const goalAmount = Number(yearlyGoal);
        setSavedGoal(goalAmount);
        localStorage.setItem('yearlyGoal', goalAmount.toString());
        setYearlyGoal('');
        toast({
            title: "Goal Saved",
            description: `Your yearly goal of $${goalAmount.toFixed(2)} has been set!`,
        });
    };
    const handleUpdateProgress = (amount) => {
        if (!amount || isNaN(Number(amount)))
            return;
        const newProgress = currentProgress + Number(amount);
        setCurrentProgress(newProgress);
        localStorage.setItem('goalProgress', newProgress.toString());
        toast({
            title: "Progress Updated",
            description: `Added $${Number(amount).toFixed(2)} to your progress!`,
        });
    };
    const dailyTargetAmount = savedGoal > 0 ? savedGoal / totalDays : 0;
    const expectedProgressByNow = dailyTargetAmount * daysPassed;
    const progressDifference = currentProgress - expectedProgressByNow;
    return (<div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-primary"/>
        <h1 className="text-2xl font-bold text-foreground">Yearly Goal Tracker</h1>
      </div>

      {/* Year Overview */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5"/>
          {currentDate.getFullYear()} Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Days</p>
            <p className="text-2xl font-bold text-primary">{totalDays}</p>
          </div>
          <div className="bg-background/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Days Passed</p>
            <p className="text-2xl font-bold text-orange-600">{daysPassed}</p>
          </div>
          <div className="bg-background/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Days Remaining</p>
            <p className="text-2xl font-bold text-red-600">{daysRemaining}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Year Progress</span>
            <span>{timeProgress.toFixed(1)}%</span>
          </div>
          <Progress value={timeProgress} className="h-2"/>
        </div>
      </Card>

      {/* Goal Setting */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Set Yearly Goal</h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="goal">Goal Amount ($)</Label>
            <Input id="goal" type="number" step="0.01" value={yearlyGoal} onChange={(e) => setYearlyGoal(e.target.value)} placeholder="Enter your yearly financial goal"/>
          </div>
          <Button onClick={handleSaveGoal} className="mt-6">
            Save Goal
          </Button>
        </div>
      </Card>

      {/* Current Goal Progress */}
      {savedGoal > 0 && (<Card className="p-6 bg-gradient-card shadow-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5"/>
            Goal Progress
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Yearly Goal</p>
                <p className="text-2xl font-bold text-primary">${savedGoal.toFixed(2)}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Progress</p>
                <p className="text-2xl font-bold text-green-600">${currentProgress.toFixed(2)}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-red-600">${(savedGoal - currentProgress).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Daily Target</p>
                <p className="text-xl font-bold text-blue-600">${dailyTargetAmount.toFixed(2)}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Expected by Now</p>
                <p className="text-xl font-bold text-orange-600">${expectedProgressByNow.toFixed(2)}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {progressDifference >= 0 ? 'Ahead by' : 'Behind by'}
                </p>
                <p className={`text-xl font-bold ${progressDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(progressDifference).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Goal Achievement</span>
              <span>{goalProgress.toFixed(1)}%</span>
            </div>
            <Progress value={goalProgress} className="h-3"/>
          </div>

          <div className="flex gap-2">
            <Input type="number" step="0.01" placeholder="Add progress amount" onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    handleUpdateProgress(e.target.value);
                    e.target.value = '';
                }
            }}/>
            <Button onClick={(e) => {
                const input = e.target.previousElementSibling;
                handleUpdateProgress(input.value);
                input.value = '';
            }}>
              Add Progress
            </Button>
          </div>
        </Card>)}

      {/* Countdown Timer */}
      <Card className="p-6 bg-gradient-card shadow-card text-center">
        <Clock className="w-8 h-8 text-primary mx-auto mb-4"/>
        <h3 className="text-lg font-semibold text-foreground mb-2">Time Remaining</h3>
        <p className="text-3xl font-bold text-red-600 mb-2">{daysRemaining}</p>
        <p className="text-muted-foreground">days left in {currentDate.getFullYear()}</p>
      </Card>
    </div>);
};
export default Goal;
