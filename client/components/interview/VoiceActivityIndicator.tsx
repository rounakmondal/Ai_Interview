import { FC } from "react";
import { Mic, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceActivityIndicatorProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  hasTranscript?: boolean;
  volume?: number; // 0-1 for visual wave amplitude
}

/**
 * Visual indicator for voice activity - makes the experience feel real-time
 */
const VoiceActivityIndicator: FC<VoiceActivityIndicatorProps> = ({
  isListening = false,
  isSpeaking = false,
  hasTranscript = false,
  volume = 0.5,
}) => {
  // Animated wave bars for listening state
  const WaveBars = () => (
    <div className="flex items-center gap-1 h-8">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-full"
          animate={{
            height: isListening ? [12, 24, 16, 28, 12] : [4, 4, 4, 4, 4],
            opacity: isListening ? 1 : 0.3,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  // Pulsing circles for speaking state
  const SpeakingIndicator = () => (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <motion.div
        className="absolute w-full h-full rounded-full bg-green-500/20"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute w-full h-full rounded-full bg-green-500/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.3,
          ease: "easeOut",
        }}
      />
      <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        <Volume2 className="w-4 h-4 text-white" />
      </div>
    </div>
  );

  // Idle/ready state
  const IdleIndicator = () => (
    <motion.div
      className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center"
      animate={{
        scale: hasTranscript ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: hasTranscript ? Infinity : 0,
      }}
    >
      <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main indicator */}
      <div className="flex items-center justify-center">
        {isSpeaking ? (
          <SpeakingIndicator />
        ) : isListening ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-2 rounded-full bg-blue-500/20"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white animate-pulse" />
              </div>
            </div>
            <WaveBars />
          </motion.div>
        ) : (
          <IdleIndicator />
        )}
      </div>

      {/* Status text */}
      <motion.p
        className="text-sm font-medium"
        animate={{
          color: isSpeaking
            ? "rgb(34, 197, 94)" // green
            : isListening
              ? "rgb(59, 130, 246)" // blue
              : "rgb(107, 114, 128)", // gray
        }}
      >
        {isSpeaking
          ? "Interviewer Speaking..."
          : isListening
            ? "Listening..."
            : hasTranscript
              ? "Ready to submit"
              : "Ready"}
      </motion.p>
    </div>
  );
};

export default VoiceActivityIndicator;
