import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
// 16 notifications for every 1.5 hours in a day (24 hours / 1.5 = 16)
const NOTIFICATION_MESSAGES = [
    // 6:00 AM
    {
        id: 'morning-tip',
        title: '🌅 Good Morning!',
        body: '💡 Tip: Start your day by checking your budget. Morning reviews help you make better spending decisions!'
    },
    // 7:30 AM
    {
        id: 'coffee-savings',
        title: '☕ Coffee Savings Alert',
        body: '💡 Tip: Making coffee at home instead of buying it could save you ₹150-300 per day!'
    },
    // 9:00 AM
    {
        id: 'expense-reminder',
        title: '📱 Expense Tracking',
        body: '🧾 Remember to log your morning expenses. Small purchases add up quickly!'
    },
    // 10:30 AM
    {
        id: 'budget-check',
        title: '💰 Budget Check',
        body: '📊 You\'re doing great! Check your spending categories to stay on track today.'
    },
    // 12:00 PM
    {
        id: 'lunch-budget',
        title: '🍽️ Lunch Budget Tip',
        body: '💡 Tip: Bringing lunch from home 3 times a week can save you up to ₹6,000/month!'
    },
    // 1:30 PM
    {
        id: 'food-spending',
        title: '🍔 Food & Dining Alert',
        body: '🧾 You\'ve spent ₹850 on Food & Dining this week. Want to set a weekly limit?'
    },
    // 3:00 PM
    {
        id: 'savings-goal',
        title: '🎯 Savings Goal Update',
        body: '💫 You\'re 65% closer to your monthly savings goal! Keep it up!'
    },
    // 4:30 PM
    {
        id: 'transport-tip',
        title: '🚗 Transport Savings',
        body: '💡 Tip: Using public transport instead of cab rides can save you ₹3,000-5,000/month!'
    },
    // 6:00 PM
    {
        id: 'evening-review',
        title: '🌆 Evening Review',
        body: '📈 Great job today! Your spending is 15% below average for this time of month.'
    },
    // 7:30 PM
    {
        id: 'entertainment-alert',
        title: '🎬 Entertainment Spending',
        body: '🧾 Entertainment expenses: ₹1,200 this month. Consider free activities to save more!'
    },
    // 9:00 PM
    {
        id: 'emergency-fund',
        title: '🛡️ Emergency Fund Tip',
        body: '💡 Tip: Aim to save 3-6 months of expenses in your emergency fund for financial security!'
    },
    // 10:30 PM
    {
        id: 'shopping-reminder',
        title: '🛒 Smart Shopping',
        body: '💡 Tip: Wait 24 hours before making non-essential purchases over ₹1,000!'
    },
    // 12:00 AM
    {
        id: 'daily-summary',
        title: '🌙 Daily Summary',
        body: '📊 Today\'s expenses: ₹450. You stayed within your daily budget of ₹600!'
    },
    // 1:30 AM
    {
        id: 'night-tip',
        title: '💤 Night Owl Tip',
        body: '💡 Late night online shopping can hurt your budget. Sleep on big purchases!'
    },
    // 3:00 AM
    {
        id: 'investment-tip',
        title: '📈 Investment Reminder',
        body: '💡 Tip: Even ₹500/month in SIP can grow to ₹1 lakh+ in 10 years with compound interest!'
    },
    // 4:30 AM
    {
        id: 'early-bird',
        title: '🐦 Early Bird Special',
        body: '💡 Early morning planning helps you make better financial decisions throughout the day!'
    }
];
export const useNotifications = () => {
    const [permission, setPermission] = useState('default');
    const [isEnabled, setIsEnabled] = useState(false);
    const { toast } = useToast();
    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
            setIsEnabled(localStorage.getItem('notifications-enabled') === 'true');
        }
    }, []);
    const requestPermission = async () => {
        if (!('Notification' in window)) {
            toast({
                title: 'Not Supported',
                description: 'This browser does not support notifications',
                variant: 'destructive'
            });
            return false;
        }
        if (permission === 'granted') {
            setIsEnabled(true);
            localStorage.setItem('notifications-enabled', 'true');
            scheduleNotifications();
            return true;
        }
        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                setIsEnabled(true);
                localStorage.setItem('notifications-enabled', 'true');
                scheduleNotifications();
                toast({
                    title: '🔔 Notifications Enabled!',
                    description: 'You\'ll receive helpful financial tips and reminders',
                    variant: 'default'
                });
                return true;
            }
            else {
                toast({
                    title: 'Permission Denied',
                    description: 'You can enable notifications later in settings',
                    variant: 'destructive'
                });
                return false;
            }
        }
        catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    };
    const disableNotifications = () => {
        setIsEnabled(false);
        localStorage.setItem('notifications-enabled', 'false');
        clearScheduledNotifications();
        toast({
            title: 'Notifications Disabled',
            description: 'You won\'t receive daily financial tips anymore',
        });
    };
    const scheduleNotifications = () => {
        // Clear existing intervals
        clearScheduledNotifications();
        // Get the current time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        // Schedule times: every 1.5 hours starting from 6:00 AM
        const scheduleTimes = [
            6 * 60, // 6:00 AM
            7 * 60 + 30, // 7:30 AM
            9 * 60, // 9:00 AM
            10 * 60 + 30, // 10:30 AM
            12 * 60, // 12:00 PM
            13 * 60 + 30, // 1:30 PM
            15 * 60, // 3:00 PM
            16 * 60 + 30, // 4:30 PM
            18 * 60, // 6:00 PM
            19 * 60 + 30, // 7:30 PM
            21 * 60, // 9:00 PM
            22 * 60 + 30, // 10:30 PM
            0, // 12:00 AM
            1 * 60 + 30, // 1:30 AM
            3 * 60, // 3:00 AM
            4 * 60 + 30, // 4:30 AM
        ];
        scheduleTimes.forEach((scheduleTimeInMinutes, index) => {
            let timeUntilNotification;
            if (scheduleTimeInMinutes > currentTimeInMinutes) {
                // Notification is later today
                timeUntilNotification = scheduleTimeInMinutes - currentTimeInMinutes;
            }
            else {
                // Notification is tomorrow
                timeUntilNotification = (24 * 60) - currentTimeInMinutes + scheduleTimeInMinutes;
            }
            const timeoutId = setTimeout(() => {
                if (isEnabled && permission === 'granted') {
                    showNotification(NOTIFICATION_MESSAGES[index]);
                }
                // Schedule the next occurrence (24 hours later)
                const intervalId = setInterval(() => {
                    if (isEnabled && permission === 'granted') {
                        showNotification(NOTIFICATION_MESSAGES[index]);
                    }
                }, 24 * 60 * 60 * 1000); // 24 hours
                // Store interval ID for cleanup
                const intervals = JSON.parse(localStorage.getItem('notification-intervals') || '[]');
                intervals.push(intervalId);
                localStorage.setItem('notification-intervals', JSON.stringify(intervals));
            }, timeUntilNotification * 60 * 1000);
            // Store timeout ID for cleanup
            const timeouts = JSON.parse(localStorage.getItem('notification-timeouts') || '[]');
            timeouts.push(timeoutId);
            localStorage.setItem('notification-timeouts', JSON.stringify(timeouts));
        });
    };
    const clearScheduledNotifications = () => {
        // Clear timeouts
        const timeouts = JSON.parse(localStorage.getItem('notification-timeouts') || '[]');
        timeouts.forEach((id) => clearTimeout(id));
        localStorage.removeItem('notification-timeouts');
        // Clear intervals
        const intervals = JSON.parse(localStorage.getItem('notification-intervals') || '[]');
        intervals.forEach((id) => clearInterval(id));
        localStorage.removeItem('notification-intervals');
    };
    const showNotification = (notificationData) => {
        if (permission === 'granted') {
            const notification = new Notification(notificationData.title, {
                body: notificationData.body,
                icon: '/favicon.ico',
                tag: notificationData.tag || notificationData.id,
                requireInteraction: false,
                silent: false
            });
            // Auto close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
            // Handle click
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    };
    const testNotification = () => {
        if (permission === 'granted') {
            showNotification({
                id: 'test',
                title: '🧪 Test Notification',
                body: '✅ Great! Your notifications are working perfectly. You\'ll receive helpful financial tips throughout the day!'
            });
        }
    };
    return {
        permission,
        isEnabled,
        requestPermission,
        disableNotifications,
        testNotification,
        scheduleNotifications: isEnabled ? scheduleNotifications : undefined
    };
};
