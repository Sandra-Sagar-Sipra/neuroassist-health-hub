import { useState, useRef, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RefreshCw,
  Shield,
  CheckCircle2,
  Brain
} from "lucide-react";
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
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
];

const doctorInfo = {
  name: "Dr. Ananya Sharma",
  specialization: "Neurology",
  location: "NeuroAssist Clinic, Bengaluru, Karnataka",
  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  experience: "12+ years",
  rating: 4.9,
};

export default function BookAppointment() {
  const { toast } = useToast();
  
  // Date & Time State
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(30).fill(0.1));
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // Booking State
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isFormComplete = date && selectedTime;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateWaveform = useCallback(() => {
    if (analyserRef.current && isRecording) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const samples = 30;
      const blockSize = Math.floor(dataArray.length / samples);
      const newWaveform = [];
      
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += dataArray[i * blockSize + j];
        }
        const normalized = (sum / blockSize) / 255;
        newWaveform.push(Math.max(0.1, normalized));
      }
      
      setWaveformData(newWaveform);
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
      
    } catch (error) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to record your symptoms.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      
      setWaveformData(new Array(30).fill(0.1));
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setWaveformData(new Array(30).fill(0.1));
  };

  const handleConfirm = async () => {
    if (!isFormComplete) return;
    
    setIsConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Appointment Booked Successfully!",
      description: `Your appointment with ${doctorInfo.name} is confirmed for ${format(date!, "d MMMM yyyy")} at ${selectedTime} IST.`,
    });
    
    setIsConfirming(false);
    // Reset form
    setDate(undefined);
    setSelectedTime(null);
    resetRecording();
    setAdditionalNotes("");
  };

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Brain className="h-8 w-8" />
          <span className="text-2xl font-bold">NeuroAssist</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Book Your Consultation</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Schedule your neurology consultation and describe your symptoms for a personalized experience.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 1: Date & Time Selection */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Select Appointment Time
              </CardTitle>
              <CardDescription>Choose your preferred date and time slot (IST)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calendar */}
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-xl border border-border/50 pointer-events-auto"
                />
              </div>
              
              {/* Time Slots */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Available Time Slots {date && `for ${format(date, "d MMMM yyyy")}`}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={cn(
                        "h-12 transition-all font-medium",
                        selectedTime === time && "ring-2 ring-primary/20 shadow-md"
                      )}
                      onClick={() => setSelectedTime(time)}
                      disabled={!date}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {time}
                    </Button>
                  ))}
                </div>
                {date && selectedTime && (
                  <p className="text-sm text-primary font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Selected: {format(date, "d MMMM yyyy")} at {selectedTime} IST
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: Doctor Information */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-5 w-5 text-primary" />
                Your Specialist
              </CardTitle>
              <CardDescription>You will be consulting with our expert neurologist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5 p-4 bg-muted/30 rounded-xl">
                <img
                  src={doctorInfo.image}
                  alt={doctorInfo.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-primary/10"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{doctorInfo.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="font-normal">
                      <Brain className="h-3 w-3 mr-1" />
                      {doctorInfo.specialization}
                    </Badge>
                    <span className="text-sm text-muted-foreground">• {doctorInfo.experience}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {doctorInfo.location}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-lg font-semibold text-foreground">⭐ {doctorInfo.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: Record Symptoms */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Mic className="h-5 w-5 text-primary" />
                Describe Your Symptoms
              </CardTitle>
              <CardDescription>
                Please describe your symptoms clearly. You may record your voice or type additional details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Recording Section */}
              <div className="bg-muted/30 rounded-xl p-6 space-y-5">
                {/* Waveform Visualization */}
                <div className="w-full h-16 flex items-center justify-center gap-1">
                  {waveformData.map((height, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-1.5 rounded-full transition-all duration-75",
                        isRecording 
                          ? 'bg-primary' 
                          : audioBlob 
                            ? 'bg-primary/60' 
                            : 'bg-muted-foreground/20'
                      )}
                      style={{
                        height: `${height * 60}px`,
                        minHeight: '6px',
                      }}
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="text-center">
                  <span className="text-3xl font-mono font-semibold text-foreground">
                    {formatTime(recordingTime)}
                  </span>
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center">
                  {!audioBlob ? (
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      className={cn(
                        "w-20 h-20 rounded-full transition-all duration-300",
                        isRecording 
                          ? 'animate-pulse shadow-lg shadow-destructive/30' 
                          : 'hover:scale-105 shadow-lg shadow-primary/20'
                      )}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? (
                        <MicOff className="h-8 w-8" />
                      ) : (
                        <Mic className="h-8 w-8" />
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-14 h-14 rounded-full"
                        onClick={togglePlayback}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </Button>
                      <Button
                        size="lg"
                        variant="ghost"
                        className="w-14 h-14 rounded-full"
                        onClick={resetRecording}
                      >
                        <RefreshCw className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Status Text */}
                <p className="text-center text-sm text-muted-foreground">
                  {isRecording 
                    ? "Recording... Tap to stop" 
                    : audioBlob 
                      ? "Recording complete. Play to review or re-record."
                      : "Tap the microphone to start recording"
                  }
                </p>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Additional Notes (Optional)</p>
                <Textarea
                  placeholder="For example: I have been experiencing frequent headaches and dizziness for the past 3 days."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <p>Your voice recording will be securely analyzed by our medical system.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Appointment Summary Card */}
          <Card className="border-border/50 sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {date ? format(date, "d MMM yyyy") : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time (IST)</span>
                  <span className="font-medium text-foreground">
                    {selectedTime || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Specialist</span>
                  <span className="font-medium text-foreground text-right text-sm">
                    {doctorInfo.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground text-right text-sm">
                    Bengaluru
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Symptoms</span>
                  <span className="font-medium text-foreground">
                    {audioBlob ? (
                      <Badge variant="secondary" className="text-xs">
                        <Mic className="h-3 w-3 mr-1" />
                        Recorded
                      </Badge>
                    ) : additionalNotes.trim() ? (
                      <Badge variant="secondary" className="text-xs">Typed</Badge>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <Button
                className="w-full h-12 text-base"
                disabled={!isFormComplete || isConfirming}
                onClick={handleConfirm}
              >
                {isConfirming ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Confirm Appointment
                  </>
                )}
              </Button>

              {!isFormComplete && (
                <p className="text-xs text-center text-muted-foreground">
                  Please select a date and time to continue
                </p>
              )}
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <Card className="border-border/50 bg-muted/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">100% Secure</p>
                  <p className="text-xs text-muted-foreground">Your data is protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Easy Rescheduling</p>
                  <p className="text-xs text-muted-foreground">Modify anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
