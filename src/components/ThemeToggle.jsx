import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    const isDark = theme === "dark";
    return (<div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-yellow-500"/>
      <Switch checked={isDark} onCheckedChange={() => setTheme(isDark ? "light" : "dark")} className="data-[state=checked]:bg-slate-800 data-[state=unchecked]:bg-yellow-200"/>
      <Moon className="h-4 w-4 text-slate-700"/>
    </div>);
};
export default ThemeToggle;
