import { FileText, Download, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const consultations = [
  {
    id: 1,
    date: "Dec 20, 2024",
    doctor: "Dr. Emily Carter",
    type: "General Checkup",
    summary: "Routine checkup completed. All vitals normal.",
    status: "completed",
  },
  {
    id: 2,
    date: "Dec 5, 2024",
    doctor: "Dr. Michael Chen",
    type: "Follow-up",
    summary: "Blood pressure monitoring. Medication adjusted.",
    status: "completed",
  },
  {
    id: 3,
    date: "Nov 15, 2024",
    doctor: "Dr. Sarah Williams",
    type: "Specialist Consultation",
    summary: "Neurological assessment. No concerns found.",
    status: "completed",
  },
];

export default function PastConsultations() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Past Consultations</h1>
        <p className="text-muted-foreground">
          Review your medical history and previous consultations.
        </p>
      </div>

      <div className="space-y-4">
        {consultations.map((consultation) => (
          <Card key={consultation.id} className="border-border/50">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{consultation.type}</CardTitle>
                  <CardDescription>{consultation.doctor}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {consultation.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{consultation.date}</span>
              </div>
              <p className="text-sm text-foreground bg-accent/50 p-3 rounded-lg">
                {consultation.summary}
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
