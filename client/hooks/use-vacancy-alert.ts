import { useState, useEffect, useCallback } from "react";
import { Vacancy, SubscribeRequest, SubscribeResponse } from "@shared/api";
import { useToast } from "./use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export function useVacancyAlert() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "denied">("idle");
  const { toast } = useToast();

  const fetchVacancies = useCallback(async (examName?: string) => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/vacancies`);
      if (examName && examName !== "All") {
        url.searchParams.append("exam_name", examName);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch vacancies");
      
      const data = await response.json();
      setVacancies(data);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      // Fallback to mock data if API fails
      setVacancies(MOCK_VACANCIES);
    } finally {
      setLoading(false);
    }
  }, []);

  const subscribe = useCallback(async (exams: string[], email?: string) => {
    setStatus("loading");
    try {
      // In a real scenario, we'd get the FCM token here
      // const fcmToken = await getFCMToken();
      const fcmToken = "mock-fcm-token"; 

      const payload: SubscribeRequest = {
        fcm_token: fcmToken,
        exams,
        email
      };

      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Subscription failed");

      const data: SubscribeResponse = await response.json();
      if (data.status === "success") {
        setIsSubscribed(true);
        setStatus("success");
        toast({
          title: "Subscribed ✅",
          description: "You'll now receive alerts for your selected exams.",
        });
        
        // If email is provided, trigger the email sending function (via our express backend)
        if (email) {
          sendMailNotification(email, exams);
        }
      } else {
        throw new Error(data.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      toast({
        title: "Error ❌",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const sendMailNotification = async (email: string, exams: string[]) => {
    try {
      await fetch("/api/vacancy-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          vacancy_title: "Vacancy Subscription Confirmed",
          vacancy_details: `You have successfully subscribed to vacancy alerts for: ${exams.join(", ")}.`
        }),
      });
    } catch (err) {
      console.error("Failed to send confirmation email", err);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  return {
    vacancies,
    loading,
    isSubscribed,
    status,
    subscribe,
    fetchVacancies
  };
}

const MOCK_VACANCIES: Vacancy[] = [
  {
    id: "1",
    title: "WB Police Constable Recruitment 2024",
    date: "2024-03-25",
    source: "WBP",
    exam_name: "WBP Constable",
    details_url: "https://prb.wb.gov.in/"
  },
  {
    id: "2",
    title: "WBCS (Exe) etc. Exam 2024 Notification",
    date: "2024-03-20",
    source: "PSCWB",
    exam_name: "WBCS",
    details_url: "https://psc.wb.gov.in/"
  },
  {
    id: "3",
    title: "Primary TET 2024 Registration Started",
    date: "2024-03-15",
    source: "WBBPE",
    exam_name: "Primary TET",
    details_url: "https://www.wbbpe.org/"
  }
];
