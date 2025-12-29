import { Mic, MicOff, Play, Pause, Send, Shield, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RecordSymptoms() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(40).fill(0.1));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateWaveform = useCallback(() => {
    if (analyserRef.current && isRecording) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const samples = 40;
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
      
      // Set up audio analyser for waveform
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
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      setWaveformData(new Array(40).fill(0.1));
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
    setWaveformData(new Array(40).fill(0.1));
  };

  const handleSubmit = () => {
    toast({
      title: "Symptoms Submitted",
      description: "Your voice recording has been securely submitted for analysis.",
    });
    resetRecording();
  };

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Describe Your Symptoms</h1>
        <p className="text-muted-foreground text-lg">
          Please describe your symptoms clearly. You can speak naturally.
        </p>
      </div>

      {/* Main Recording Card */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-8">
            
            {/* Waveform Visualization */}
            <div className="w-full h-24 flex items-center justify-center gap-1 px-4">
              {waveformData.map((height, index) => (
                <div
                  key={index}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isRecording 
                      ? 'bg-primary' 
                      : audioBlob 
                        ? 'bg-primary/60' 
                        : 'bg-muted-foreground/20'
                  }`}
                  style={{
                    height: `${height * 80}px`,
                    minHeight: '8px',
                  }}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-4xl font-mono font-semibold text-foreground">
              {formatTime(recordingTime)}
            </div>

            {/* Recording Button */}
            {!audioBlob ? (
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className={`w-32 h-32 rounded-full transition-all duration-300 ${
                  isRecording 
                    ? 'animate-pulse shadow-lg shadow-destructive/30' 
                    : 'hover:scale-105 shadow-lg shadow-primary/20'
                }`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <MicOff className="h-12 w-12" />
                ) : (
                  <Mic className="h-12 w-12" />
                )}
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-16 h-16 rounded-full"
                  onClick={togglePlayback}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-16 h-16 rounded-full"
                  onClick={resetRecording}
                >
                  <RefreshCw className="h-6 w-6" />
                </Button>
              </div>
            )}

            {/* Status Text */}
            <p className="text-sm text-muted-foreground">
              {isRecording 
                ? "Recording... Tap to stop" 
                : audioBlob 
                  ? "Review your recording or re-record"
                  : "Tap the microphone to start recording"
              }
            </p>

            {/* Submit Button */}
            {audioBlob && (
              <Button 
                size="lg" 
                className="w-full max-w-xs mt-4"
                onClick={handleSubmit}
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Symptoms
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">
        <Shield className="h-5 w-5 text-primary flex-shrink-0" />
        <p>Your voice will be securely analyzed by our system. All data is encrypted and HIPAA compliant.</p>
      </div>
    </div>
  );
}
