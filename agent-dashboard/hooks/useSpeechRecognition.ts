"use client";
import { useState, useCallback, useRef, useEffect } from "react";

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const currentTranscript = event.results[0][0].transcript;
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListeningSpeech(false);
        };

        recognitionRef.current.onend = () => {
          setIsListeningSpeech(false);
        };
      } else {
        console.warn("Speech recognition not supported in this browser.");
      }
    }
  }, []);

  const startListeningSpeech = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript("");
      try {
        recognitionRef.current.start();
        setIsListeningSpeech(true);
      } catch (err) {
        console.error("Speech recognition could not start", err);
      }
    }
  }, []);

  const stopListeningSpeech = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListeningSpeech(false);
    }
  }, []);

  return {
    transcript,
    setTranscript,
    isListeningSpeech,
    startListeningSpeech,
    stopListeningSpeech,
    hasSupport: !!recognitionRef.current
  };
}
