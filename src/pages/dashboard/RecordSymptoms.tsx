import { Mic, MicOff, Send } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function RecordSymptoms() {
  const [isRecording, setIsRecording] = useState(false);
  const [symptoms, setSymptoms] = useState("");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Record Symptoms</h1>
        <p className="text-muted-foreground">
          Describe your symptoms using voice or text. Our AI will help organize and summarize them.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Voice Recording</CardTitle>
          <CardDescription>
            Click the microphone to start recording your symptoms
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="w-24 h-24 rounded-full"
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? (
              <MicOff className="h-10 w-10" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isRecording ? "Recording... Click to stop" : "Click to start recording"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Or Type Your Symptoms</CardTitle>
          <CardDescription>
            Describe what you're experiencing in detail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="I've been experiencing headaches for the past 3 days..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={6}
          />
          <Button className="w-full" disabled={!symptoms.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Submit Symptoms
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
