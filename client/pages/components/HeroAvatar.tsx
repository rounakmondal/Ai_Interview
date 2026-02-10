import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HeroAvatar() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sample = "Hello, welcome to Interview AI. I will ask you questions and provide feedback to help you improve.";

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(sample);
    utter.lang = 'en-US';
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-60 h-60 rounded-2xl overflow-hidden shadow-2xl relative">
        <img src="/Gemini_Generated_Image_9cu79a9cu79a9cu7.png" alt="Interviewer" className="w-full h-full object-cover" />

        {/* Animated mouth when speaking */}
        {isSpeaking && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="w-28 h-3 bg-red-600 rounded-full animate-[lipsync_360ms_infinite_ease-in-out]" />
          </div>
        )}
      </div>

      <div className="text-center mt-6 space-y-2 w-full">
        <p className="text-sm text-muted-foreground">AI Interviewer is speaking...</p>
        <p className="text-base font-medium text-foreground">Tell me about your experience with...</p>
        <div className="mt-4">
          <Button onClick={handlePlay} className="gradient-primary">Listen</Button>
        </div>
      </div>
    </div>
  );
}

/* Add keyframes for inline animation usage */
const style = document.createElement('style');
style.innerHTML = `@keyframes lipsync {0% { transform: scaleY(0.6);}50% { transform: scaleY(1.05);}100% { transform: scaleY(0.7);} }`;
document.head.appendChild(style);
