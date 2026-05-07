// src/components/FAQ.tsx
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  HelpCircle,
  Sparkles,
  MessageCircle,
  Shield,
  Briefcase,
  Users,
  ArrowRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type Category = "all" | "general" | "recruiter" | "security" | "seeker";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: Exclude<Category, "all">;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Is HireHub free for job seekers?",
    answer:
      "Yes, absolutely. Job seekers can create profiles, browse unlimited jobs, and apply to as many positions as they want completely free. There are no hidden fees, no premium tiers, and no credit card required to get started.",
    category: "seeker",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 2,
    question: "How do recruiters post jobs?",
    answer:
      "Recruiters can create a company account and post jobs directly from their dashboard. The streamlined process takes under 2 minutes. Simply fill in the job details, set requirements, and publish. Your job will be live instantly and visible to thousands of qualified candidates.",
    category: "recruiter",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: 3,
    question: "Is my personal data secure?",
    answer:
      "Absolutely. HireHub uses industry-leading security measures including modern OAuth authentication, end-to-end encryption for sensitive data, and secure cloud storage. Your personal information is never shared with third parties without your explicit consent. We comply with GDPR and CCPA regulations.",
    category: "security",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: 4,
    question: "Can I track my job applications?",
    answer:
      "Yes, our comprehensive dashboard allows you to monitor all your applications in real-time. You'll receive instant notifications when a recruiter views your application, sends a message, or updates the hiring status. The timeline view shows your entire application journey at a glance.",
    category: "seeker",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 5,
    question: "What is the ATS pipeline?",
    answer:
      "The Applicant Tracking System (ATS) pipeline is a powerful visual Kanban board that recruiters use to manage candidates efficiently. Track applicants from initial application through screening, interviews, and final hire. Drag-and-drop functionality makes moving candidates between stages effortless.",
    category: "recruiter",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: 6,
    question: "How does the matching algorithm work?",
    answer:
      "Our AI-powered matching algorithm analyzes your skills, experience, and preferences to recommend the most relevant job opportunities. It considers not just keywords, but context, industry trends, and career trajectory. The more you interact with the platform, the smarter your recommendations become.",
    category: "general",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 7,
    question: "Can I message recruiters directly?",
    answer:
      "Yes, our built-in messaging system allows seamless communication between candidates and recruiters. You can ask questions about the role, clarify requirements, or follow up on your application. All messages are organized in one place for easy reference.",
    category: "seeker",
    icon: <MessageCircle className="h-4 w-4" />,
  },
];

const categories: { value: Category; label: string; color: string }[] = [
  { value: "all", label: "All Questions", color: "bg-slate-500" },
  { value: "general", label: "General", color: "bg-violet-500" },
  { value: "seeker", label: "Job Seekers", color: "bg-emerald-500" },
  { value: "recruiter", label: "Recruiters", color: "bg-blue-500" },
  { value: "security", label: "Security", color: "bg-amber-500" },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [expandedAll, setExpandedAll] = useState(false);

  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleItem = (id: number) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const toggleAll = () => {
    if (expandedAll) {
      setOpenIndex(null);
    } else {
      setOpenIndex(-1);
    }
    setExpandedAll(!expandedAll);
  };

  return (
    <section
      id="faq"
      className="relative min-h-screen overflow-hidden bg-slate-50 py-24 dark:bg-slate-950 scroll-mt-16"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/10" />
        <div className="absolute bottom-20 right-1/4 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-900/10" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-violet-900/50 dark:bg-slate-900/80"
          >
            <HelpCircle className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Got Questions?
            </span>
          </motion.div>

          <h2 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
            Frequently Asked{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
                Questions
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10C50 4 100 4 150 6C200 8 250 4 298 2"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0"
                    y1="0"
                    x2="300"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#8b5cf6" />
                    <stop offset="0.5" stopColor="#d946ef" />
                    <stop offset="1" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know about HireHub. Can't find the answer
            you're looking for? Reach out to our support team.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative mx-auto mb-8 max-w-lg"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-violet-900/20"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-wrap items-center justify-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  activeCategory === cat.value
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800"
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    cat.color,
                    activeCategory === cat.value && "bg-white"
                  )}
                />
                {cat.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-10 flex max-w-2xl items-center justify-between rounded-2xl border border-slate-200 bg-white/60 px-6 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {filteredFaqs.length}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {filteredFaqs.length === 1 ? "question" : "questions"} found
            </span>
          </div>
          <button
            onClick={toggleAll}
            className="group flex items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
          >
            {expandedAll ? "Collapse all" : "Expand all"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className={cn(
                    "group overflow-hidden rounded-2xl border bg-white transition-all duration-300 dark:bg-slate-900/50",
                    openIndex === faq.id || openIndex === -1
                      ? "border-violet-200 shadow-lg shadow-violet-100/50 dark:border-violet-800 dark:shadow-violet-900/20"
                      : "border-slate-200 hover:border-violet-200 hover:shadow-md dark:border-slate-800 dark:hover:border-violet-900/50"
                  )}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors",
                        openIndex === faq.id || openIndex === -1
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 dark:group-hover:bg-violet-900/20 dark:group-hover:text-violet-300"
                      )}
                    >
                      {String(faq.id).padStart(2, "0")}
                    </span>

                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                        openIndex === faq.id || openIndex === -1
                          ? "bg-violet-500 text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-slate-700 dark:group-hover:text-violet-300"
                      )}
                    >
                      {faq.icon}
                    </span>

                    <span
                      className={cn(
                        "flex-1 text-base font-semibold transition-colors md:text-lg",
                        openIndex === faq.id || openIndex === -1
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                      )}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={cn(
                        "hidden shrink-0 rounded-full px-3 py-1 text-xs font-medium md:block",
                        faq.category === "general" &&
                          "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
                        faq.category === "seeker" &&
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        faq.category === "recruiter" &&
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        faq.category === "security" &&
                          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}
                    >
                      {faq.category}
                    </span>

                    <motion.div
                      animate={{
                        rotate:
                          openIndex === faq.id || openIndex === -1 ? 180 : 0,
                      }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                        openIndex === faq.id || openIndex === -1
                          ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-500 dark:group-hover:bg-violet-900/20 dark:group-hover:text-violet-400"
                      )}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {(openIndex === faq.id || openIndex === -1) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 px-5 pb-6 pt-2 dark:border-slate-800">
                          <div className="flex gap-4">
                            <div className="w-10 shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-400">
                                {faq.answer}
                              </p>
                              <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs text-slate-400">
                                  Was this helpful?
                                </span>
                                <div className="flex gap-1">
                                  <button className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-500 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400">
                                    Yes
                                  </button>
                                  <button className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center dark:border-slate-700 dark:bg-slate-900/50"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Search className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                No questions found
              </h3>
              <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Try adjusting your search or category filter to find what
                you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-xl text-center"
        >
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30">
              <MessageCircle className="h-7 w-7 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              Still have questions?
            </h3>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Can't find the answer you're looking for? Our friendly team is
              here to help.
            </p>
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              Contact Support
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}