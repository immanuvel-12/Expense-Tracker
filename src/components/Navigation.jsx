import { Home, Briefcase, Info, LogOut, TrendingUp, Target, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";
import NotificationToggle from "./NotificationToggle";
const Navigation = ({ activeTab, onTabChange, onLogout }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { id: "home", icon: Home, label: "Home" },
        { id: "transactions", icon: Briefcase, label: "Transactions" },
        { id: "prediction", icon: TrendingUp, label: "Prediction" },
        { id: "goal", icon: Target, label: "Goal" },
        { id: "about", icon: Info, label: "About" },
        { id: "logout", icon: LogOut, label: "Logout" },
    ];
    const handleNavClick = (item) => {
        if (item.id === 'logout') {
            onLogout();
        }
        else {
            onTabChange(item.id);
        }
        setIsOpen(false); // Close mobile menu after selection
    };
    return (<nav className="bg-card shadow-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-money rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">₹</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Expensio</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-5 h-5"/>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetHeader>
                    <SheetTitle className="text-left">Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-2 mt-6">
                    {navItems.map((item) => {
            const Icon = item.icon;
            return (<Button key={item.id} variant={activeTab === item.id ? "default" : "ghost"} onClick={() => handleNavClick(item)} className="w-full justify-start space-x-3 h-12">
                          <Icon className="w-5 h-5"/>
                          <span className="text-base">{item.label}</span>
                        </Button>);
        })}
                    <div className="pt-4 border-t border-border mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Settings</span>
                      </div>
                      <div className="flex items-center space-x-3 mt-3">
                        <NotificationToggle className="flex-1"/>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NotificationToggle />
              <ThemeToggle />
            </div>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
            const Icon = item.icon;
            const handleClick = () => {
                if (item.id === 'logout') {
                    onLogout();
                }
                else {
                    onTabChange(item.id);
                }
            };
            return (<Button key={item.id} variant={activeTab === item.id ? "default" : "ghost"} size="sm" onClick={handleClick} className="flex items-center space-x-2">
                    <Icon className="w-4 h-4"/>
                    <span>{item.label}</span>
                  </Button>);
        })}
            </div>
          </div>
        </div>
      </div>
    </nav>);
};
export default Navigation;
