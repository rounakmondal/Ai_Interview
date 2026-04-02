import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

const ONBOARDING_KEY = "onboarding_complete";

const steps = [
  {
    title: "Pick your exam",
    description: "Choose the exam you want to prepare for. This helps us tailor your study plan and mock tests.",
  },
  {
    title: "Take a mock test",
    description: "Start with a mock test to assess your current level and get personalized recommendations.",
  },
  {
    title: "See your result",
    description: "Review your performance, track your progress, and get tips to improve."
  }
];

export const OnboardingModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem(ONBOARDING_KEY, "1");
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{steps[step].title}</DialogTitle>
          <DialogDescription>{steps[step].description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleNext}>
            {step === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
