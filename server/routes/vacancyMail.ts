import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { VacancyMailRequest } from "@shared/api";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const handleVacancyMail: RequestHandler = async (req, res) => {
  const { email, vacancy_title, vacancy_details } = req.body as VacancyMailRequest;

  if (!email || !vacancy_title) {
    return res.status(400).json({ message: "Email and title are required" });
  }

  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"InterviewSathi Alerts" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🔔 Vacancy Alert: ${vacancy_title}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #4f46e5; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">InterviewSathi</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0;">New Vacancy Notification</p>
          </div>
          
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #111827; margin-bottom: 20px;">${vacancy_title}</h2>
            <p style="line-height: 1.6; color: #4b5563;">
              ${vacancy_details}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
              <p style="font-size: 14px; color: #6b7280; text-align: center;">
                You are receiving this because you subscribed to vacancy alerts on InterviewSathi.
              </p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://interviewsathi.online/vacancies" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View All Vacancies
                </a>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    res.json({ message: "Alert email sent successfully" });
  } catch (error) {
    console.error("Failed to send vacancy mail:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
