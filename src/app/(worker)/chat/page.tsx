"use client";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex items-center justify-center h-[60vh] px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-surface border border-border">
          <MessageSquare size={28} className="text-foreground-subtle" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Geen berichten</h2>
        <p className="text-sm text-foreground-subtle">
          Zodra je een shift hebt, kun je hier chatten met je opdrachtgever.
        </p>
      </motion.div>
    </div>
  );
}
