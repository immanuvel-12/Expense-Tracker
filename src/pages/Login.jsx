import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/backend";
import moneyFlyingBg from "@/assets/money-flying-bg.jpg";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Validation
        if (!email || !password || (isSignUp && !fullName)) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
        try {
            if (isSignUp) {
                try {
                    const { needsConfirm } = await auth.signUp(email, password, fullName);
                    toast({
                        title: "Account Created!",
                        description: needsConfirm ? "Please check your email to verify your account." : "Welcome to Expensio!",
                    });
                    if (!needsConfirm)
                        navigate("/");
                }
                catch (error) {
                    toast({
                        title: "Sign Up Failed",
                        description: error.message,
                        variant: "destructive",
                    });
                }
            }
            else {
                try {
                    await auth.signIn(email, password);
                    toast({
                        title: "Login Successful",
                        description: "Welcome back to Expensio!",
                    });
                    navigate("/");
                }
                catch (error) {
                    toast({
                        title: "Login Failed",
                        description: error.message,
                        variant: "destructive",
                    });
                }
            }
        }
        catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${moneyFlyingBg})` }}/>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm shadow-elevated">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-money rounded-xl flex items-center justify-center mx-auto mb-4 shadow-money">
              <span className="text-primary font-bold text-2xl">₹</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Expensio</h1>
            <p className="text-muted-foreground">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (<div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" required/>
              </div>)}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required/>
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (<EyeOff className="h-4 w-4 text-muted-foreground"/>) : (<Eye className="h-4 w-4 text-muted-foreground"/>)}
                </Button>
              </div>
            </div>

            <Button type="submit" variant="money" className="w-full" disabled={isLoading}>
              {isLoading
            ? (isSignUp ? "Creating Account..." : "Signing In...")
            : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          {/* Toggle between Login/Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" className="text-primary hover:underline font-medium" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>);
};
export default Login;
