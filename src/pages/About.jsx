import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Bell, Shield, Database, Mail, Phone, MapPin, Smartphone, AlertCircle, CheckCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationToggle from "@/components/NotificationToggle";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
const About = () => {
    const { permission, isEnabled, requestPermission, disableNotifications, testNotification } = useNotifications();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const handleNotificationToggle = async (checked) => {
        if (checked) {
            await requestPermission();
        }
        else {
            disableNotifications();
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }
        // Construct WhatsApp message
        const whatsappMessage = `
*New Contact Form Message*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Subject:* ${formData.subject}

*Message:*
${formData.message}
    `.trim();
        // WhatsApp URL with your number
        const whatsappUrl = `https://wa.me/917845371025?text=${encodeURIComponent(whatsappMessage)}`;
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        // Clear form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        toast({
            title: "Message Sent",
            description: "Your message has been sent via WhatsApp!",
        });
    };
    return (<div className="space-y-6">
      {/* About Section */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h2 className="text-2xl font-bold mb-4 text-foreground">About Expensio</h2>
        <div className="prose max-w-none text-muted-foreground">
          <p className="mb-4">
            Expensio is your personal finance companion, designed to help you track expenses, 
            monitor income, and achieve your financial goals. With our intuitive trading-style 
            interface, managing your money becomes as engaging as watching the markets.
          </p>
          <p className="mb-4">
            Built with modern web technologies, Expensio offers real-time portfolio tracking, 
            smart overspending alerts, and beautiful visualizations to keep you informed about 
            your financial health.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">₹10,000+</div>
              <div className="text-sm text-muted-foreground">Average Savings Tracked</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-warning">99%</div>
              <div className="text-sm text-muted-foreground">Data Security</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings Section */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center">
          <Shield className="w-6 h-6 mr-2"/>
          Settings
        </h2>
        
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
              <Bell className="w-5 h-5 mr-2"/>
              Notifications
            </h3>
            
            {/* Daily Financial Tips Notification */}
            <div className="space-y-6">
              <div className="p-4 bg-gradient-subtle rounded-lg border border-primary/20">
                <div className="flex items-start space-x-3 mb-4">
                  <Smartphone className="w-6 h-6 text-primary mt-1"/>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Daily Financial Tips & Alerts</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get personalized saving tips, spending alerts, and budget reminders delivered 
                      every 1.5 hours throughout the day (16 notifications daily).
                    </p>
                    
                    {/* Permission Status */}
                    <div className="flex items-center space-x-2 mb-3">
                      {permission === 'granted' ? (<>
                          <CheckCircle className="w-4 h-4 text-success"/>
                          <span className="text-sm text-success">Permission granted</span>
                        </>) : permission === 'denied' ? (<>
                          <AlertCircle className="w-4 h-4 text-destructive"/>
                          <span className="text-sm text-destructive">Permission denied</span>
                        </>) : (<>
                          <AlertCircle className="w-4 h-4 text-warning"/>
                          <span className="text-sm text-warning">Permission required</span>
                        </>)}
                    </div>

                    {/* Sample Notifications Preview */}
                    <div className="space-y-2 mb-4 p-3 bg-background/50 rounded border">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Preview Examples:</div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                          <span>💡</span>
                          <span className="text-foreground">"Eating out less could save you up to ₹6,000/month!"</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🧾</span>
                          <span className="text-foreground">"You've spent ₹850 on Food & Dining this week."</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🎯</span>
                          <span className="text-foreground">"You're 65% closer to your monthly savings goal!"</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Switch checked={isEnabled} onCheckedChange={handleNotificationToggle} disabled={permission === 'denied'}/>
                        <Label className="font-medium">
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                      
                      {/* Enable Button */}
                      <NotificationToggle variant="button" className="ml-auto"/>
                      
                      {isEnabled && permission === 'granted' && (<Button variant="outline" size="sm" onClick={testNotification}>
                          Test Notification
                        </Button>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Notification Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Overspending Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when expenses exceed income</p>
                  </div>
                  <Switch defaultChecked/>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive monthly financial summaries</p>
                  </div>
                  <Switch defaultChecked/>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Goal Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders for your savings goals</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
              <Database className="w-5 h-5 mr-2"/>
              Data Management
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Export Transaction Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Import from CSV
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                Clear All Data
              </Button>
            </div>
          </div>

          {/* Currency Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Currency Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Default Currency</Label>
                <Input id="currency" value="INR (₹)" readOnly className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="format">Number Format</Label>
                <Input id="format" value="1,00,000.00" readOnly className="mt-1"/>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Section */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center">
          <Mail className="w-6 h-6 mr-2"/>
          Contact Support
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Form */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Send us a message</h3>
            <form className="space-y-4" onSubmit={handleSendMessage}>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" className="mt-1" required/>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" className="mt-1" required/>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="How can we help?" className="mt-1" required/>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us more about your inquiry..." rows={4} className="mt-1" required/>
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Get in touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-0.5"/>
                <div>
                  <div className="font-medium text-foreground">Email Support</div>
                  <div className="text-muted-foreground">support@expensio.com</div>
                  <div className="text-sm text-muted-foreground">We respond within 24 hours</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-0.5"/>
                <div>
                  <div className="font-medium text-foreground">Phone Support</div>
                  <div className="text-muted-foreground">+91 9876543210</div>
                  <div className="text-sm text-muted-foreground">Mon-Fri, 9 AM - 6 PM IST</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5"/>
                <div>
                  <div className="font-medium text-foreground">Office Address</div>
                  <div className="text-muted-foreground">
                    123 Finance Street<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium text-foreground mb-2">FAQ</h4>
              <p className="text-sm text-muted-foreground">
                Check our frequently asked questions for quick answers to common queries.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>);
};
export default About;
