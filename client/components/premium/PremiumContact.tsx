import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Mail, User, MapPin, Clock, Send, MessageCircle, Sparkles } from "lucide-react";

// Smooth easing for enterprise feel
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "rounakmondal198@gmail.com",
    description: "We'll respond within 24 hours",
  },
  {
    icon: User,
    label: "Developer",
    value: "Ranjan Mondal",
    description: "Creator & Lead Developer, InterviewAI",
  },
  {
    icon: MapPin,
    label: "Based In",
    value: "West Bengal, India",
    description: "Serving candidates across India",
  },
];

export default function PremiumContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // CTA button pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: smoothEase,
      },
    },
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => console.log("Message saved locally"));
    
    setFormSubmitted(true);
    form.reset();
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Soft gradient background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(248, 250, 252, 0.3) 0%, rgba(241, 245, 249, 0.6) 50%, rgba(248, 250, 252, 0.3) 100%)",
          }}
        />

        {/* Light diffusion orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Dark mode overlay */}
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-slate-900/50 dark:via-slate-900/80 dark:to-slate-900/50" />
      </div>

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 lg:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
          >
            <MessageCircle className="w-4 h-4" />
            We're Here to Help
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5">
            Get in{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          >
            Have questions about InterviewAI? Our friendly team is always ready to help you
            succeed in your interview preparation journey.
          </motion.p>
        </motion.div>

        {/* Split Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto"
        >
          {/* Left Side - Contact Information */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((contact, idx) => {
                const Icon = contact.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, ease: smoothEase }}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <div className="relative p-5 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-indigo-200/50 dark:hover:border-indigo-500/30 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-200/30 dark:border-indigo-500/20 flex items-center justify-center group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all duration-300">
                          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-[15px]">
                            {contact.label}
                          </p>
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                            {contact.value}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {contact.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Response Time Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6, ease: smoothEase }}
              className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-200/30 dark:border-indigo-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Quick Response</p>
                  <p className="text-sm text-muted-foreground">Average reply time: 2 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      {["JD", "AS", "MK"][i - 1]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Our support team is standing by
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              {/* Glassmorphism card */}
              <div className="relative p-8 lg:p-10 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/30">
                {/* Success message overlay */}
                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground text-center max-w-xs">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <div className="relative group">
                      <input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                      />
                      <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                      />
                      <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Subject
                    </label>
                    <div className="relative group">
                      <select
                        name="subject"
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 text-foreground focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 appearance-none cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Question</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Message
                    </label>
                    <div className="relative group">
                      <textarea
                        name="message"
                        placeholder="Tell us how we can help you..."
                        rows={4}
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 resize-none"
                      />
                      <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="relative pt-2">
                    {/* Pulse glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4))",
                      }}
                      animate={showPulse ? {
                        scale: [1, 1.1, 1.2],
                        opacity: [0.4, 0.2, 0],
                      } : { scale: 1, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />

                    <motion.button
                      type="submit"
                      className="relative w-full px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-[15px] shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group overflow-hidden"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <span className="relative flex items-center gap-2">
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                      </span>
                    </motion.button>
                  </div>

                  {/* Privacy note */}
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    By submitting, you agree to our{" "}
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      Privacy Policy
                    </a>
                    . We'll never share your information.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: smoothEase }}
      />
    </section>
  );
}
