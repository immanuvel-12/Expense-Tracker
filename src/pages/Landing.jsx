import { useState } from "react";
import { LogIn, DollarSign, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import moneyHeroImage from "@/assets/money-hero.jpg";
const Landing = ({ onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would handle authentication
        onLogin();
    };
    const features = [
        {
            icon: DollarSign,
            title: "Track Income & Expenses",
            description: "Easily record all your financial transactions in one place"
        },
        {
            icon: BarChart3,
            title: "Visual Analytics",
            description: "See your spending patterns with beautiful charts and graphs"
        },
        {
            icon: TrendingUp,
            title: "Smart Insights",
            description: "Get personalized saving tips and overspending alerts"
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your financial data is encrypted and kept completely private"
        }
    ];
    return (<div className="min-h-screen bg-gradient-money">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url(${moneyHeroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}/>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-money">
                  <DollarSign className="w-8 h-8 text-primary-foreground"/>
                </div>
                <h1 className="text-3xl font-bold text-primary">Expensio</h1>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
                Take Control of Your
                <span className="block text-primary-hover">Financial Future</span>
              </h2>
              
              <p className="text-lg text-primary mb-8 max-w-xl">
                Track expenses, monitor income, and get smart insights to help you save more. 
                Your personal finance companion that grows with you.
              </p>

              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => {
            const Icon = feature.icon;
            return (<div key={index} className="flex items-center space-x-3 p-3 bg-card/80 rounded-lg shadow-card">
                        <div className="p-2 bg-primary rounded-lg">
                          <Icon className="w-5 h-5 text-primary-foreground"/>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-primary">{feature.title}</h3>
                        </div>
                      </div>);
        })}
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md p-8 bg-card shadow-elevated">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {isLoginMode ? "Welcome Back" : "Get Started"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isLoginMode
            ? "Sign in to access your dashboard"
            : "Create your account to start tracking"}
                  </p>
                </div>

                <div className="space-y-4">
                  <Button onClick={onLogin} variant="money" className="w-full">
                    <LogIn className="w-4 h-4 mr-2"/>
                    Get Started
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Sign up or sign in to start tracking your finances
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Mobile */}
      <div className="lg:hidden px-4 pb-16">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-primary text-center mb-8">Why Choose Expensio?</h3>
          <div className="space-y-4">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return (<Card key={index} className="p-4 bg-card shadow-card">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary rounded-lg">
                      <Icon className="w-6 h-6 text-primary-foreground"/>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>);
        })}
          </div>
        </div>
      </div>
    </div>);
};
export default Landing;
