import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
const EnhancedPredictionChart = ({ data, currentIncome, selectedMonth }) => {
    // Add current month as starting point
    const chartData = [
        {
            month: selectedMonth.slice(0, 3),
            predicted: currentIncome,
            confidence: 100,
            upperBound: currentIncome,
            lowerBound: currentIncome,
            historical: currentIncome,
        },
        ...data.map(item => ({
            ...item,
            month: item.month.slice(0, 3),
            upperBound: item.predicted * (1 + (100 - item.confidence) / 200),
            lowerBound: item.predicted * (1 - (100 - item.confidence) / 200),
        }))
    ];
    const totalPredicted = data.reduce((sum, item) => sum + item.predicted, 0);
    const averageConfidence = data.reduce((sum, item) => sum + item.confidence, 0) / data.length;
    const trend = data.length > 1 ?
        ((data[data.length - 1].predicted - data[0].predicted) / data[0].predicted) * 100 : 0;
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (<div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground">{label}</p>
          <p className="text-primary">
            Predicted: <span className="font-semibold">${data.predicted?.toFixed(2)}</span>
          </p>
          <p className="text-muted-foreground text-sm">
            Confidence: {data.confidence}%
          </p>
          {data.upperBound && (<p className="text-xs text-muted-foreground">
              Range: ${data.lowerBound?.toFixed(2)} - ${data.upperBound?.toFixed(2)}
            </p>)}
        </div>);
        }
        return null;
    };
    return (<div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary"/>
            <span className="text-sm font-medium text-muted-foreground">Total Predicted</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${totalPredicted.toFixed(2)}</p>
        </Card>
        
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded bg-primary/20"/>
            <span className="text-sm font-medium text-muted-foreground">Avg. Confidence</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{averageConfidence.toFixed(1)}%</p>
        </Card>
        
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-2 mb-2">
            {trend >= 0 ? (<TrendingUp className="w-4 h-4 text-success"/>) : (<TrendingDown className="w-4 h-4 text-destructive"/>)}
            <span className="text-sm font-medium text-muted-foreground">Trend</span>
          </div>
          <p className={`text-2xl font-bold ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Prediction Chart */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Income Prediction Chart</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs"/>
              <YAxis axisLine={false} tickLine={false} className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip />}/>
              
              {/* Confidence band */}
              <Area type="monotone" dataKey="upperBound" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.1}/>
              <Area type="monotone" dataKey="lowerBound" stroke="none" fill="hsl(var(--background))" fillOpacity={1}/>
              
              {/* Main prediction line */}
              <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }} activeDot={{ r: 8, fill: "hsl(var(--primary))" }}/>
              
              {/* Historical data line */}
              <Line type="monotone" dataKey="historical" stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="5 5" dot={false}/>
              
              {/* Current month reference line */}
              <ReferenceLine x={selectedMonth.slice(0, 3)} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" label={{ value: "Current", position: "top" }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Predicted Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/20 rounded-full"></div>
            <span>Confidence Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-success rounded-full"></div>
            <span>Historical</span>
          </div>
        </div>
      </Card>
    </div>);
};
export default EnhancedPredictionChart;
