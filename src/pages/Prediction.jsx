import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calendar, DollarSign, BarChart3, Target, Lightbulb } from "lucide-react";
import EnhancedPredictionChart from "@/components/EnhancedPredictionChart";
const Prediction = ({ transactions }) => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [predictions, setPredictions] = useState([]);
    const [predictionType, setPredictionType] = useState('realistic');
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    useEffect(() => {
        if (selectedMonth) {
            const incomeTransactions = transactions.filter(t => t.type === 'income' && t.month === selectedMonth);
            const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
            setMonthlyIncome(totalIncome);
            // Generate predictions for remaining months
            const currentMonthIndex = months.indexOf(selectedMonth);
            const remainingMonths = months.slice(currentMonthIndex + 1);
            const predictedData = remainingMonths.map((month, index) => {
                // Enhanced prediction with multiple scenarios
                const seasonalMultiplier = getSeasonalMultiplier(months.indexOf(month));
                const baseAmount = totalIncome * seasonalMultiplier;
                // Apply prediction type multiplier
                const typeMultipliers = {
                    conservative: 0.85,
                    realistic: 1.0,
                    optimistic: 1.15
                };
                const predictedAmount = baseAmount * typeMultipliers[predictionType];
                return {
                    month,
                    predicted: predictedAmount,
                    confidence: Math.max(85 - (index * 3), 65), // Better confidence model
                };
            });
            setPredictions(predictedData);
        }
    }, [selectedMonth, transactions, predictionType]);
    const getSeasonalMultiplier = (monthIndex) => {
        // Simple seasonal adjustments (you can make this more sophisticated)
        const seasonalFactors = [0.95, 0.90, 1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.05, 1.0, 0.95, 1.1];
        return seasonalFactors[monthIndex] || 1.0;
    };
    const totalPredictedIncome = predictions.reduce((sum, p) => sum + p.predicted, 0);
    const yearlyProjection = monthlyIncome + totalPredictedIncome;
    // Smart insights based on predictions
    const getSmartInsights = () => {
        if (predictions.length === 0)
            return [];
        const insights = [];
        const avgPrediction = totalPredictedIncome / predictions.length;
        const seasonalVariation = Math.max(...predictions.map(p => p.predicted)) - Math.min(...predictions.map(p => p.predicted));
        if (seasonalVariation > avgPrediction * 0.2) {
            insights.push("High seasonal variation detected - consider building larger reserves during peak months");
        }
        if (avgPrediction > monthlyIncome * 1.1) {
            insights.push("Predictions show growth potential - great time to plan investments");
        }
        else if (avgPrediction < monthlyIncome * 0.9) {
            insights.push("Predicted decline - consider expense optimization strategies");
        }
        return insights;
    };
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-primary"/>
        <h1 className="text-2xl font-bold text-foreground">Advanced Income Prediction</h1>
      </div>

      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Select Base Month & Scenario</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Base Month:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {months.map((month) => (<Button key={month} variant={selectedMonth === month ? "default" : "outline"} onClick={() => setSelectedMonth(month)} className="text-sm transition-all duration-200 hover:scale-105">
                  {month.slice(0, 3)}
                </Button>))}
            </div>
          </div>
          
          {selectedMonth && (<div className="animate-slide-up">
              <p className="text-sm text-muted-foreground mb-2">Prediction Scenario:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button variant={predictionType === 'conservative' ? "default" : "outline"} onClick={() => setPredictionType('conservative')} className="text-sm">
                  Conservative
                </Button>
                <Button variant={predictionType === 'realistic' ? "default" : "outline"} onClick={() => setPredictionType('realistic')} className="text-sm">
                  Realistic
                </Button>
                <Button variant={predictionType === 'optimistic' ? "default" : "outline"} onClick={() => setPredictionType('optimistic')} className="text-sm">
                  Optimistic
                </Button>
              </div>
            </div>)}
        </div>
      </Card>

      {selectedMonth && (<div className="animate-slide-up">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4"/>
                Overview
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-2">
                <Calendar className="w-4 h-4"/>
                Details
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4"/>
                Insights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  {selectedMonth} Income Analysis - {predictionType.charAt(0).toUpperCase() + predictionType.slice(1)} Scenario
                </h3>
                <div className="flex items-center gap-2 text-3xl font-bold text-success">
                  <DollarSign className="w-8 h-8"/>
                  ${monthlyIncome.toFixed(2)}
                </div>
                <p className="text-muted-foreground mt-2">
                  Based on {transactions.filter(t => t.type === 'income' && t.month === selectedMonth).length} income transactions
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-success shadow-card text-white">
                  <p className="text-sm opacity-90">Current Month</p>
                  <p className="text-2xl font-bold">${monthlyIncome.toFixed(2)}</p>
                </Card>
                <Card className="p-4 bg-gradient-card shadow-card">
                  <p className="text-sm text-muted-foreground">Predicted Remaining</p>
                  <p className="text-2xl font-bold text-primary">${totalPredictedIncome.toFixed(2)}</p>
                </Card>
                <Card className="p-4 bg-gradient-money shadow-card">
                  <p className="text-sm text-muted-foreground">Yearly Total</p>
                  <p className="text-2xl font-bold text-foreground">${yearlyProjection.toFixed(2)}</p>
                </Card>
              </div>

              <EnhancedPredictionChart data={predictions} currentIncome={monthlyIncome} selectedMonth={selectedMonth}/>
            </TabsContent>
            
            <TabsContent value="detailed" className="space-y-6">
              <Card className="p-6 bg-gradient-card shadow-card">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Monthly Predictions Breakdown</h3>
                <div className="space-y-3">
                  {predictions.map((pred, index) => (<div key={pred.month} className="flex justify-between items-center p-4 bg-background/30 rounded-lg hover:bg-background/50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{pred.month}</span>
                          <p className="text-xs text-muted-foreground">
                            {pred.confidence >= 80 ? 'High' : pred.confidence >= 70 ? 'Medium' : 'Low'} confidence
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary text-lg">${pred.predicted.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{pred.confidence}% confidence</p>
                      </div>
                    </div>))}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-6">
              <Card className="p-6 bg-gradient-card shadow-card">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning"/>
                  Smart Insights
                </h3>
                <div className="space-y-4">
                  {getSmartInsights().map((insight, index) => (<div key={index} className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <p className="text-sm text-foreground">{insight}</p>
                    </div>))}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <h4 className="font-medium text-success mb-2">Opportunities</h4>
                      <ul className="text-sm text-foreground space-y-1">
                        <li>• Plan investments during high-income months</li>
                        <li>• Build emergency fund reserves</li>
                        <li>• Consider tax optimization strategies</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h4 className="font-medium text-primary mb-2">Recommendations</h4>
                      <ul className="text-sm text-foreground space-y-1">
                        <li>• Set aside 20% for savings goals</li>
                        <li>• Monitor monthly variations closely</li>
                        <li>• Update predictions with new data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>)}

      {!selectedMonth && (<Card className="p-8 bg-gradient-card shadow-card text-center hover:shadow-elevated transition-all duration-300">
          <div className="animate-pulse-glow">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4"/>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Advanced Prediction Engine</h3>
          <p className="text-muted-foreground mb-4">
            Select a month with income data to generate sophisticated predictions with confidence intervals, scenarios, and smart insights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Target className="w-6 h-6 text-primary mx-auto mb-1"/>
              <p className="font-medium">Multiple Scenarios</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-success mx-auto mb-1"/>
              <p className="font-medium">Visual Charts</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <Lightbulb className="w-6 h-6 text-warning mx-auto mb-1"/>
              <p className="font-medium">Smart Insights</p>
            </div>
          </div>
        </Card>)}
    </div>);
};
export default Prediction;
