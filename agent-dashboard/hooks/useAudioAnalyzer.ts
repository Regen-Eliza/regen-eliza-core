import { useEffect, useRef, useState } from "react";

export function useAudioAnalyzer() {
  const [isListening, setIsListening] = useState(false);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = source;

      setDataArray(new Uint8Array(analyser.frequencyBinCount));
      setIsListening(true);
    } catch (err) {
      console.error("Microphone denied:", err);
      alert("System requires Audio Access to initialize Voice Protocol.");
    }
  };

  const stopListening = () => {
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
  };

  const getFrequency = () => {
    if (!analyserRef.current || !dataArray) return 0;
    // @ts-ignore
    analyserRef.current.getByteFrequencyData(dataArray);
    // Calculate average volume/frequency
    return dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  };

  return { isListening, startListening, stopListening, getFrequency };
}
