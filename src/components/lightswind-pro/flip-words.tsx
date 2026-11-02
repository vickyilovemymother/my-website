import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const FlipWords = ({
  words,
  duration = 2600,
  className,
}: FlipWordsProps) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    const nextIndex = (words.indexOf(currentWord) + 1) % words.length;
    setCurrentWord(words[nextIndex]);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.span
        key={currentWord}
        initial={{
          opacity: 0,
          y: 12,
          filter: "blur(4px)",
          rotateX: 45,
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          rotateX: 0,
        }}
        exit={{
          opacity: 0,
          y: -14,
          filter: "blur(4px)",
          rotateX: -45,
          position: "relative",
        }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 18,
          mass: 0.8,
        }}
        className={cn(
          "inline-block font-semibold text-neutral-900 border-b-2 border-neutral-900 pb-0.5 tracking-tight",
          className
        )}
      >
        {currentWord.split(" ").map((word, wordIndex) => (
          <span key={word + wordIndex} className="inline-block whitespace-nowrap">
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={letter + letterIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: wordIndex * 0.12 + letterIndex * 0.025,
                  duration: 0.2,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
};

export default FlipWords;
