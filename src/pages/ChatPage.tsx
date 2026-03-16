import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Search,
  MessageSquare,
  User,
  Sparkles,
  CheckCheck,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participant_ids: string[];
  last_message?: Message;
  other_participant?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

/* ─────────────────────────────────────────────────────────────
   Floating Particle
───────────────────────────────────────────────────────────── */
function Particle({ index }: { index: number }) {
  const size = Math.random() * 2.5 + 1;
  const duration = Math.random() * 18 + 10;
  const delay = Math.random() * 12;
  const x = Math.random() * 100;
  const colors = [
    "bg-primary/25",
    "bg-violet-400/20",
    "bg-emerald-400/15",
    "bg-cyan-400/15",
  ];
  return (
    <motion.div
      className={`absolute rounded-full ${colors[index % colors.length]} blur-[1px] pointer-events-none`}
      style={{ width: size, height: size, left: `${x}%`, bottom: "-10px" }}
      animate={{ y: [0, -(window.innerHeight + 100)], opacity: [0, 0.8, 0.8, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Avatar Gradient (deterministic)
───────────────────────────────────────────────────────────── */
const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-sky-600",
];
function avatarGradient(name = "") {
  return AVATAR_GRADIENTS[name.length % AVATAR_GRADIENTS.length];
}

/* ─────────────────────────────────────────────────────────────
   Typing Indicator
───────────────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.9 }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-none bg-muted/60 border border-white/8 backdrop-blur-sm">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Message Bubble
───────────────────────────────────────────────────────────── */
function MessageBubble({
  msg,
  isOwn,
  showAvatar,
  participantName,
  avatarUrl,
}: {
  msg: Message;
  isOwn: boolean;
  showAvatar: boolean;
  participantName: string;
  avatarUrl?: string;
}) {
  const timeStr = new Date(msg.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`flex items-end gap-2.5 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {/* Other person avatar */}
      {!isOwn && (
        <div className="flex-shrink-0 mb-0.5">
          {showAvatar ? (
            <Avatar className="h-7 w-7 border border-white/10 shadow-md">
              <AvatarImage src={avatarUrl} className="object-cover" /> 
              {/* Fallback to participant name's first letter */}
              <AvatarFallback className={`bg-gradient-to-br ${avatarGradient(participantName)} text-white text-[10px] font-bold`}>
                {participantName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-7 w-7" />
          )}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[72%] ${isOwn ? "items-end" : "items-start"}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative px-4 py-2.5 rounded-2xl text-sm shadow-sm group ${
            isOwn
              ? "bg-gradient-to-br from-primary to-violet-600 text-white rounded-tr-sm shadow-primary/20"
              : "bg-background/60 backdrop-blur-sm border border-white/10 text-foreground rounded-tl-sm"
          }`}
        >
          {/* Shimmer on own messages */}
          {isOwn && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              style={{ skewX: "-20deg" }}
            />
          )}
          <p className="leading-relaxed relative z-10">{msg.content}</p>
        </motion.div>

        {/* Timestamp + read indicator */}
        <div className={`flex items-center gap-1 px-1 ${isOwn ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-muted-foreground/50">{timeStr}</span>
          {isOwn && (
            <CheckCheck className="h-3 w-3 text-primary/60" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Conversation Item
───────────────────────────────────────────────────────────── */
function ConversationItem({
  conv,
  isSelected,
  currentUserId,
  onClick,
}: {
  conv: Conversation;
  isSelected: boolean;
  currentUserId: string;
  onClick: () => void;
}) {
  const name = conv.other_participant?.full_name || "Unknown User";
  const lastMsg = conv.last_message?.content || "No messages yet";
  const lastTime = conv.last_message
    ? formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: false })
    : "";
  const isUnread =
    conv.last_message &&
    !conv.last_message.is_read &&
    conv.last_message.sender_id !== currentUserId;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left relative overflow-hidden group ${
        isSelected
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-white/5 border border-transparent hover:border-white/8"
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          layoutId="selectedConv"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-primary to-violet-500 rounded-full"
        />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-11 w-11 rounded-2xl border border-white/10 shadow-md">
          <AvatarImage src={conv.other_participant?.avatar_url} className="object-cover" />
          <AvatarFallback className={`bg-gradient-to-br ${avatarGradient(name)} text-white text-sm font-bold`}>
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Online dot */}
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-semibold text-sm truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
            {name}
          </span>
          {lastTime && (
            <span className="text-[10px] text-muted-foreground/50 flex-shrink-0 ml-2">
              {lastTime}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs truncate ${isSelected ? "text-primary/60" : "text-muted-foreground/70"}`}>
            {lastMsg}
          </p>
          {isUnread && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"
            />
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Empty / Welcome State
───────────────────────────────────────────────────────────── */
function WelcomeState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center relative"
    >
      {/* Orbiting rings */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 -m-8 rounded-full border border-dashed border-primary/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-0 -m-4 rounded-full border border-dashed border-violet-500/15"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Icon */}
        <motion.div
          className="relative h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/10 to-violet-500/10 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageSquare className="h-11 w-11 text-primary/70" />
          {/* Sparkle */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-amber-400" />
          </motion.div>
        </motion.div>
      </div>

      <motion.h2
        className="font-display text-2xl font-bold mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your{" "}
        <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
          Inbox
        </span>
      </motion.h2>
      <motion.p
        className="text-sm text-muted-foreground max-w-[260px] leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Select a conversation from the left to start messaging or connect from a job listing.
      </motion.p>

      {/* Feature pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { icon: <Zap className="h-3 w-3" />, label: "Real-time" },
          { icon: <CheckCheck className="h-3 w-3" />, label: "Read receipts" },
          { icon: <Sparkles className="h-3 w-3" />, label: "Smart replies" },
        ].map((pill) => (
          <span
            key={pill.label}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-medium text-primary/70"
          >
            {pill.icon}
            {pill.label}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Chat Page
───────────────────────────────────────────────────────────── */
export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cursor tracking for subtle glow
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(cursorY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    if (user) { fetchConversations(); setupSubscriptions(); }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) fetchMessages(selectedConversation.id);
  }, [selectedConversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    const { data: convs, error } = await supabase
      .from("conversations")
      .select("*")
      .contains("participant_ids", [user?.id])
      .order("updated_at", { ascending: false });

    if (error) { console.error(error); return; }

    const convsWithDetails = await Promise.all(
      convs.map(async (conv) => {
        const otherId = conv.participant_ids.find((id: string) => id !== user?.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .eq("user_id", otherId)
          .single();

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return { ...conv, other_participant: profile, last_message: lastMsg || undefined };
      })
    );

    setConversations(convsWithDetails as Conversation[]);
    setLoading(false);
  };

  const fetchMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (error) { console.error(error); return; }
    setMessages(data as Message[]);
  };

  const setupSubscriptions = () => {
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          if (selectedConversation && newMsg.conversation_id === selectedConversation.id) {
            setMessages((prev) => [...prev, newMsg]);
          }
          fetchConversations();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const msgContent = newMessage.trim();
    setNewMessage("");

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: msgContent,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: msgContent,
    });

    if (error) {
      console.error(error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.other_participant?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedParticipantName =
    selectedConversation?.other_participant?.full_name || "";

  // Group messages to show avatar only on last consecutive message from other
  const shouldShowAvatar = (index: number) => {
    if (messages[index].sender_id === user?.id) return false;
    const next = messages[index + 1];
    return !next || next.sender_id === user?.id || next.sender_id !== messages[index].sender_id;
  };

  return (
    <div
      className="flex flex-col h-screen bg-background overflow-hidden relative"
      onMouseMove={(e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); }}
    >
      {/* ── Cursor Glow ── */}
      <motion.div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)/0.04) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 300),
          y: useTransform(smoothY, (v) => v - 300),
        }}
      />

      {/* ── Ambient Orbs ── */}
      <motion.div
        className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => <Particle key={i} index={i} />)}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        <main className="flex-1 flex overflow-hidden container mx-auto px-4 py-5 gap-4 min-h-0">

          {/* ════════════════════════════════
              LEFT SIDEBAR — Conversations
          ════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-[320px] flex-col gap-4 flex-shrink-0 h-full`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold leading-tight">
                  Messages
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/15 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
              </motion.div>
            </div>

            {/* Search */}
            <div className="relative">
              <AnimatePresence>
                {search && (
                  <motion.div
                    className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/30 via-violet-500/30 to-primary/30 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 bg-background/40 backdrop-blur-sm border-white/10 rounded-xl focus-visible:ring-0 focus-visible:border-primary/40 text-sm transition-all"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1 -mr-2">
              <div className="flex flex-col gap-1 pr-2">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    // Skeleton
                    [...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 p-3 rounded-2xl"
                      >
                        <motion.div
                          className="h-11 w-11 rounded-2xl bg-muted/50 flex-shrink-0"
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <div className="flex-1 space-y-2">
                          <motion.div
                            className="h-3 rounded-full bg-muted/50"
                            style={{ width: `${60 + i * 10}%` }}
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                          <motion.div
                            className="h-2.5 rounded-full bg-muted/40"
                            style={{ width: `${40 + i * 5}%` }}
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                          />
                        </div>
                      </motion.div>
                    ))
                  ) : filteredConversations.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 gap-3 text-center"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-muted/30 border border-white/8 flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">No conversations</p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px]">
                          {search ? "No results found" : "Start from a job listing or profile"}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <ConversationItem
                        key={conv.id}
                        conv={conv}
                        isSelected={selectedConversation?.id === conv.id}
                        currentUserId={user?.id || ""}
                        onClick={() => setSelectedConversation(conv)}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </motion.div>

          {/* ════════════════════════════════
              RIGHT PANEL — Chat Window
          ════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${selectedConversation ? "flex" : "hidden md:flex"} flex-1 flex flex-col rounded-3xl bg-background/30 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl shadow-black/20 min-h-0 h-full`}
          >
            <AnimatePresence mode="wait">
              {selectedConversation ? (
                <motion.div
                  key={selectedConversation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col h-full min-h-0"
                >
                  {/* ── Chat Header ── */}
                  <div className="flex-shrink-0 px-5 py-4 border-b border-white/8 bg-background/20 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Back button for mobile */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="md:hidden h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </motion.button>

                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="h-10 w-10 rounded-2xl border border-white/10 shadow-md">
                          <AvatarImage src={selectedConversation.other_participant?.avatar_url} className="object-cover" />
                          <AvatarFallback className={`bg-gradient-to-br ${avatarGradient(selectedParticipantName)} text-white text-sm font-bold`}>
                            {selectedParticipantName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <div>
                        <h2 className="font-bold text-sm leading-tight">
                          {selectedParticipantName}
                        </h2>
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                          Online now
                        </p>
                      </div>
                    </div>

                    {/* Header actions */}
                    <div className="flex items-center gap-1">
                      {[
                        { icon: <Phone className="h-4 w-4" />, label: "Call" },
                        { icon: <Video className="h-4 w-4" />, label: "Video" },
                        { icon: <MoreVertical className="h-4 w-4" />, label: "More" },
                      ].map((action) => (
                        <motion.button
                          key={action.label}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                          title={action.label}
                        >
                          {action.icon}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* ── Messages ── */}
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="flex flex-col gap-3 p-5">
                      {/* Date separator */}
                      {messages.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3 my-2"
                        >
                          <div className="flex-1 h-px bg-white/8" />
                          <span className="text-[10px] text-muted-foreground/50 font-medium px-2">
                            Today
                          </span>
                          <div className="flex-1 h-px bg-white/8" />
                        </motion.div>
                      )}

                      <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                          <MessageBubble
                            key={msg.id}
                            msg={msg}
                            isOwn={msg.sender_id === user?.id}
                            showAvatar={shouldShowAvatar(i)}
                            participantName={selectedParticipantName}
                            avatarUrl={selectedConversation.other_participant?.avatar_url}
                          />
                        ))}

                        {isTyping && (
                          <TypingIndicator key="typing" />
                        )}
                      </AnimatePresence>

                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* ── Input Area ── */}
                  <div className="flex-shrink-0 p-4 border-t border-white/8 bg-background/20 backdrop-blur-sm">
                    <form onSubmit={sendMessage}>
                      <div className="relative">
                        {/* Glow on focus */}
                        <AnimatePresence>
                          {inputFocused && (
                            <motion.div
                              className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/40 via-violet-500/40 to-primary/40 blur-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                        </AnimatePresence>

                        <div className="relative flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-white/10 rounded-2xl px-3 py-2">
                          {/* Emoji + Attach buttons */}
                          <div className="flex items-center gap-0.5">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="h-8 w-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                            >
                              <Smile className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="h-8 w-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                            >
                              <Paperclip className="h-4 w-4" />
                            </motion.button>
                          </div>

                          {/* Input */}
                          <input
                            ref={inputRef}
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 text-foreground py-1"
                          />

                          {/* Send button */}
                          <motion.button
                            type="submit"
                            disabled={!newMessage.trim()}
                            whileHover={newMessage.trim() ? { scale: 1.06 } : {}}
                            whileTap={newMessage.trim() ? { scale: 0.94 } : {}}
                            className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              newMessage.trim()
                                ? "bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                                : "bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
                            }`}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={newMessage.trim() ? "active" : "inactive"}
                                initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0.6, rotate: 10, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Send className="h-4 w-4" />
                              </motion.div>
                            </AnimatePresence>
                          </motion.button>
                        </div>
                      </div>
                    </form>

                    {/* Char count hint */}
                    <AnimatePresence>
                      {newMessage.length > 100 && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-[10px] text-muted-foreground/50 mt-1.5 px-1"
                        >
                          {newMessage.length} characters
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <WelcomeState />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}