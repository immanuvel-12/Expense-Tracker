import { AlertTriangle, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const savingTips = [
    "Reduce spending on dining out by setting a weekly budget.",
    "Limit entertainment expenses until savings are back to target.",
    "Consider tracking subscriptions and removing unused ones.",
    "Try the 24-hour rule before making non-essential purchases.",
    "Use a grocery list to avoid impulse buying at the store.",
    "Look for free or low-cost alternatives for entertainment."
];
const OverspendingAlert = ({ isVisible, onClose, overspentAmount }) => {
    if (!isVisible)
        return null;
    const randomTips = savingTips.sort(() => 0.5 - Math.random()).slice(0, 2);
    return (<Card className="mb-6 p-6 bg-warning-light border border-warning shadow-elevated">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-warning rounded-full">
            <AlertTriangle className="w-6 h-6 text-warning-foreground"/>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-warning-foreground mb-2">
              Overspending Alert!
            </h3>
            <p className="text-warning-foreground mb-4">
              You've overspent by <span className="font-bold">₹{overspentAmount.toFixed(2)}</span> this month.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-warning-foreground"/>
                <span className="font-medium text-warning-foreground">Smart Saving Tips:</span>
              </div>
              <ul className="space-y-2 ml-7">
                {randomTips.map((tip, index) => (<li key={index} className="text-warning-foreground text-sm">
                    • {tip}
                  </li>))}
              </ul>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={onClose} className="text-warning-foreground hover:bg-warning/20">
          <X className="w-4 h-4"/>
        </Button>
      </div>
    </Card>);
};
export default OverspendingAlert;
