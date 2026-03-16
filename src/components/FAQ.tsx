import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Is HireHub free for job seekers?",
    a: "Yes. Job seekers can create profiles, browse jobs, and apply completely free. There are no hidden fees whatsoever.",
  },
  {
    q: "How do recruiters post jobs?",
    a: "Recruiters can create a company account and post jobs directly from the dashboard. The process takes under 2 minutes.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. HireHub uses modern authentication, end-to-end encryption, and secure cloud storage. Your data is never shared without consent.",
  },
  {
    q: "Can I track my job applications?",
    a: "Yes. You can monitor all your applications and view real-time hiring status updates from within your seeker dashboard.",
  },
  {
    q: "What is the ATS pipeline?",
    a: "The Applicant Tracking System (ATS) pipeline is a visual Kanban board that recruiters use to track candidates from application through final hire.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-28 overflow-hidden scroll-mt-16">
      {/* Subtle bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20 mb-4">
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-emerald-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Everything you need to know about HireHub.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border text-left transition-all duration-300 ${
                  openIndex === i
                    ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
                    : "bg-card border-border hover:border-primary/20 hover:bg-muted/30"
                }`}
              >
                <span className="font-display font-semibold text-sm md:text-base pr-4">
                  {f.q}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    openIndex === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pt-3 pb-5">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}