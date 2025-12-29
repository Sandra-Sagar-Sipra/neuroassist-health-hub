import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Video, Building2, User, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

const assignedDoctor = {
  name: "Dr. Sarah Mitchell",
  specialty: "Neurologist",
  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  rating: 4.9,
  experience: "15+ years"
};

export default function BookAppointment() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<"online" | "clinic" | null>(null);
  const [notes, setNotes] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const isFormComplete = date && selectedTime && consultationType;

  const handleConfirm = async () => {
    if (!isFormComplete) return;
    
    setIsConfirming(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Appointment Confirmed!",
      description: `Your appointment with ${assignedDoctor.name} is scheduled for ${format(date, "MMMM d, yyyy")} at ${selectedTime}.`,
    });
    
    setIsConfirming(false);
    // Reset form
    setDate(undefined);
    setSelectedTime(null);
    setConsultationType(null);
    setNotes("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Book Appointment</h1>
        <p className="text-muted-foreground">
          Schedule a consultation with your assigned specialist
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar and Time */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date Selection */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Select Date
              </CardTitle>
              <CardDescription>Choose your preferred appointment date</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border w-fit mx-auto pointer-events-auto"
              />
            </CardContent>
          </Card>

          {/* Time Slot Selection */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Select Time Slot
              </CardTitle>
              <CardDescription>Available time slots for {date ? format(date, "MMMM d, yyyy") : "selected date"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={cn(
                      "h-12 transition-all",
                      selectedTime === time && "ring-2 ring-primary/20"
                    )}
                    onClick={() => setSelectedTime(time)}
                    disabled={!date}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consultation Type */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Consultation Type</CardTitle>
              <CardDescription>Choose how you'd like to meet with your doctor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setConsultationType("online")}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                    consultationType === "online"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    consultationType === "online" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Video className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Online Consultation</p>
                    <p className="text-sm text-muted-foreground">Video call from home</p>
                  </div>
                  {consultationType === "online" && (
                    <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                  )}
                </button>

                <button
                  onClick={() => setConsultationType("clinic")}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                    consultationType === "clinic"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    consultationType === "clinic" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">In-Clinic Visit</p>
                    <p className="text-sm text-muted-foreground">Visit the clinic in person</p>
                  </div>
                  {consultationType === "clinic" && (
                    <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Optional Notes */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Additional Notes
                <Badge variant="secondary" className="ml-2">Optional</Badge>
              </CardTitle>
              <CardDescription>Any specific concerns or information for your doctor</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="E.g., I've been experiencing symptoms for 3 days..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Doctor & Summary */}
        <div className="space-y-6">
          {/* Assigned Doctor */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Assigned Doctor
              </CardTitle>
              <CardDescription>Based on your symptoms analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <img
                  src={assignedDoctor.image}
                  alt={assignedDoctor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/10 mb-4"
                />
                <h3 className="font-semibold text-lg text-foreground">{assignedDoctor.name}</h3>
                <p className="text-primary font-medium">{assignedDoctor.specialty}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>⭐ {assignedDoctor.rating}</span>
                  <span>{assignedDoctor.experience}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Summary */}
          <Card className="border-border/50 sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {date ? format(date, "MMM d, yyyy") : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">
                    {selectedTime || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground">
                    {consultationType === "online" ? "Online" : consultationType === "clinic" ? "In-Clinic" : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Doctor</span>
                  <span className="font-medium text-foreground">{assignedDoctor.name}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Consultation Fee</span>
                <span className="font-semibold text-lg text-foreground">$75.00</span>
              </div>

              <Button
                className="w-full h-12 text-base mt-4"
                disabled={!isFormComplete || isConfirming}
                onClick={handleConfirm}
              >
                {isConfirming ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Appointment"
                )}
              </Button>

              {!isFormComplete && (
                <p className="text-xs text-center text-muted-foreground">
                  Please select date, time, and consultation type
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
