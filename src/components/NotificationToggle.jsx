import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
const NotificationToggle = ({ variant = 'icon', className = '' }) => {
    const { permission, isEnabled, requestPermission, disableNotifications, testNotification } = useNotifications();
    const { toast } = useToast();
    const handleToggle = async () => {
        if (isEnabled) {
            // Turn off notifications
            disableNotifications();
        }
        else {
            // Turn on notifications - request permission first
            const granted = await requestPermission();
            if (granted) {
                // Show a test notification immediately
                setTimeout(() => {
                    testNotification();
                }, 1000);
                toast({
                    title: "🔔 Notifications Enabled!",
                    description: "You'll receive daily financial tips and alerts",
                });
            }
        }
    };
    if (variant === 'button') {
        return (<Button onClick={handleToggle} variant={isEnabled ? "default" : "default"} className={`hover:scale-105 transition-all duration-200 ${className}`} disabled={permission === 'denied'} style={{ pointerEvents: 'auto' }}>
        {isEnabled ? (<>
            <Bell className="h-4 w-4 mr-2"/>
            Notifications Enabled
          </>) : (<>
            <BellOff className="h-4 w-4 mr-2"/>
            Enable Notifications
          </>)}
      </Button>);
    }
    // Icon variant
    return (<Button variant="outline" size="icon" onClick={handleToggle} className={`relative hover:scale-105 transition-all duration-200 ${className}`} title={isEnabled ? "Disable notifications" : "Enable notifications"}>
      {isEnabled ? (<>
          <Bell className="h-[1.2rem] w-[1.2rem] text-primary"/>
          {/* Active indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"/>
        </>) : (<BellOff className="h-[1.2rem] w-[1.2rem] text-muted-foreground"/>)}
      <span className="sr-only">Toggle notifications</span>
    </Button>);
};
export default NotificationToggle;
