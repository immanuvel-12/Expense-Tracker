import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/backend";
import { useToast } from "@/hooks/use-toast";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
const Index = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();
    useEffect(() => {
        const unsubscribe = auth.onChange((u, reason) => {
            setUser(u);
            setLoading(false);
            if (reason === "expired") {
                toast({ title: "Session expired", description: "Please log in again.", variant: "destructive" });
            }
        });
        auth.getUser().then((u) => {
            setUser(u);
            setLoading(false);
        });
        return unsubscribe;
    }, [toast]);
    const handleLogin = () => {
        navigate("/login");
    };
    const handleLogout = async () => {
        await auth.signOut();
        setUser(null);
    };
    if (loading) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-money rounded-xl flex items-center justify-center mx-auto mb-4 shadow-money animate-pulse">
            <span className="text-primary font-bold text-2xl">₹</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>);
    }
    if (user) {
        return <Dashboard onLogout={handleLogout}/>;
    }
    return <Landing onLogin={handleLogin}/>;
};
export default Index;
