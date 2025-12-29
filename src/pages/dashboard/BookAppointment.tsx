import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const availableDoctors = [
  { name: "Dr. Emily Carter", specialty: "General Practice", available: "Mon, Wed, Fri" },
  { name: "Dr. Michael Chen", specialty: "Cardiology", available: "Tue, Thu" },
  { name: "Dr. Sarah Williams", specialty: "Neurology", available: "Mon, Tue, Wed" },
];

export default function BookAppointment() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Book Appointment</h1>
        <p className="text-muted-foreground">
          Schedule a consultation with one of our healthcare professionals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableDoctors.map((doctor) => (
          <Card key={doctor.name} className="border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{doctor.name}</CardTitle>
              <CardDescription>{doctor.specialty}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{doctor.available}</span>
              </div>
              <Button className="w-full">Book Appointment</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-accent/30">
        <CardContent className="flex items-center gap-4 py-6">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium text-foreground">Need urgent care?</p>
            <p className="text-sm text-muted-foreground">
              Call our 24/7 helpline for immediate assistance
            </p>
          </div>
          <Button variant="outline" className="ml-auto">
            Call Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
