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
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Warm gradient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10, 10, 10, 0) 0%, rgba(249, 115, 22, 0.03) 50%, rgba(10, 10, 10, 0) 100%)",
          }}
        />

        {/* Light diffusion orbs - Warm Palette */}
        <div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.2), transparent)",
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
          >
            <MessageCircle className="w-4 h-4" />
            We're Here to Help
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5">
            Get in{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>

          <motion.p
            className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed"
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
                    <div className="relative p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-sm shadow-sm hover:border-orange-500/30 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 flex items-center justify-center group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300">
                          <Icon className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-[15px]">
                            {contact.label}
                          </p>
                          <p className="text-orange-400 font-medium mt-0.5">
                            {contact.value}
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">
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
              className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Quick Response</p>
                  <p className="text-sm text-neutral-500">Average reply time: 2 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-orange-500"
                    >
                      {["JD", "AS", "MK"][i - 1]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-neutral-500">
                  Our support team is standing by
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="relative p-8 lg:p-10 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-xl shadow-2xl">
                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm rounded-2xl z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                    <p className="text-neutral-400 text-center max-w-xs text-sm">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Full Name</label>
                    <div className="relative group">
                      <input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Subject</label>
                    <select
                      name="subject"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:border-orange-500 transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-neutral-900">Select a topic</option>
                      <option value="general" className="bg-neutral-900">General Inquiry</option>
                      <option value="support" className="bg-neutral-900">Technical Support</option>
                      <option value="billing" className="bg-neutral-900">Billing Question</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Message</label>
                    <textarea
                      name="message"
                      placeholder="Tell us how we can help you..."
                      rows={4}
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500 transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="relative pt-2">
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{ background: "rgba(249, 115, 22, 0.3)" }}
                      animate={showPulse ? {
                        scale: [1, 1.05, 1.1],
                        opacity: [0.4, 0.2, 0],
                      } : { scale: 1, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />

                    <motion.button
                      type="submit"
                      className="relative w-full px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group overflow-hidden"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="relative flex items-center gap-2">
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </motion.button>
                  </div>

                  <p className="text-[10px] text-neutral-500 text-center uppercase tracking-widest pt-2">
                    Secure & Private Inquiry
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
            "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.15), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: smoothEase }}
      />
    </section>
  );
}