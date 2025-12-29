import { Mic, Calendar, FileText, Clock, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const quickActions = [
  {
    title: "Record Symptoms",
    description: "Describe how you're feeling using voice or text",
    icon: Mic,
    href: "/dashboard/symptoms",
    primary: true,
  },
  {
    title: "Book Appointment",
    description: "Schedule a consultation with your doctor",
    icon: Calendar,
    href: "/dashboard/appointments",
    primary: false,
  },
  {
    title: "View Previous Reports",
    description: "Access your medical history and past consultations",
    icon: FileText,
    href: "/dashboard/consultations",
    primary: false,
  },
];

export default function Dashboard() {
  // Mock patient name - would come from auth context in real app
  const patientName = "Sarah";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Hello, {patientName} 👋
        </h1>
        <p className="text-muted-foreground">
          Welcome back to your health dashboard. How can we help you today?
        </p>
      </div>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Card 
              key={action.title}
              className={`transition-all hover:shadow-lg hover:-translate-y-1 ${
                action.primary 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border/50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  action.primary 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-accent text-accent-foreground"
                }`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  variant={action.primary ? "default" : "outline"} 
                  className="w-full"
                >
                  <Link to={action.href}>
                    {action.primary ? "Start Recording" : "Open"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Info Widgets */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Appointment */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center gap-4 pb-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Upcoming Appointment</CardTitle>
              <CardDescription>Your next scheduled visit</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-accent/50 rounded-xl p-4 space-y-2">
              <p className="font-medium text-foreground">Dr. Emily Carter</p>
              <p className="text-sm text-muted-foreground">General Consultation</p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Calendar className="h-4 w-4" />
                <span>Jan 5, 2025 at 10:00 AM</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/dashboard/appointments">Manage Appointments</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Last Consultation Summary */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center gap-4 pb-3">
            <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Last Consultation</CardTitle>
              <CardDescription>Summary from your recent visit</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-accent/50 rounded-xl p-4 space-y-2">
              <p className="font-medium text-foreground">Dec 20, 2024</p>
              <p className="text-sm text-muted-foreground">
                Routine checkup completed. Blood pressure normal. 
                Follow-up recommended in 2 weeks.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/dashboard/consultations">View All Consultations</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
