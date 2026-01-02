import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityChip } from "@/components/PriorityChip";
import { WaitTimer } from "@/components/WaitTimer";
import { Phone, Users, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TriagePatient {
  id: string;
  name: string;
  phone: string;
  triageScore: number;
  symptoms: string;
  checkInTime: Date;
}

// Mock data - in production this would come from your backend
const mockPatients: TriagePatient[] = [
  {
    id: "1",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    triageScore: 2,
    symptoms: "Severe migraine with visual disturbances, nausea for 3 days",
    checkInTime: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
  },
  {
    id: "2",
    name: "Rahul Patel",
    phone: "+91 87654 32109",
    triageScore: 3,
    symptoms: "Numbness in left arm, difficulty speaking intermittently",
    checkInTime: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
  },
  {
    id: "3",
    name: "Anita Desai",
    phone: "+91 76543 21098",
    triageScore: 6,
    symptoms: "Recurring headaches, mild dizziness when standing",
    checkInTime: new Date(Date.now() - 20 * 60 * 1000), // 20 min ago
  },
  {
    id: "4",
    name: "Vikram Singh",
    phone: "+91 65432 10987",
    triageScore: 5,
    symptoms: "Memory lapses, difficulty concentrating at work",
    checkInTime: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
  },
  {
    id: "5",
    name: "Meera Krishnan",
    phone: "+91 54321 09876",
    triageScore: 8,
    symptoms: "Follow-up for medication review, feeling better overall",
    checkInTime: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
  },
  {
    id: "6",
    name: "Arjun Reddy",
    phone: "+91 43210 98765",
    triageScore: 1,
    symptoms: "Sudden severe headache, confusion, slurred speech",
    checkInTime: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
  },
];

// Sort by triage score (critical first)
const sortedPatients = [...mockPatients].sort((a, b) => a.triageScore - b.triageScore);

export default function AdminDashboard() {
  const criticalCount = mockPatients.filter(p => p.triageScore <= 3).length;
  const stableCount = mockPatients.filter(p => p.triageScore > 3).length;
  const totalPatients = mockPatients.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total in Queue</p>
              <p className="text-2xl font-semibold text-foreground">{totalPatients}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical Cases</p>
              <p className="text-2xl font-semibold text-foreground">{criticalCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stable Cases</p>
              <p className="text-2xl font-semibold text-foreground">{stableCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Triage Queue Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Live Triage Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold text-foreground">Priority</TableHead>
                  <TableHead className="font-semibold text-foreground">Patient</TableHead>
                  <TableHead className="font-semibold text-foreground">AI Intake Summary</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Wait Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPatients.map((patient) => (
                  <TableRow 
                    key={patient.id} 
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <TableCell>
                      <PriorityChip triageScore={patient.triageScore} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{patient.name}</p>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span className="text-sm">{patient.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {patient.symptoms}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <WaitTimer checkInTime={patient.checkInTime} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
