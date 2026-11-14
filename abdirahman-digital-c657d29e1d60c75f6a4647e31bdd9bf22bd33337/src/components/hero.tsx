"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 to-transparent" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-brand opacity-20 blur-3xl -z-10" />

      <div className="container py-20 sm:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium glass"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Personal Digital Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mt-6 font-serif text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl mx-auto"
        >
          I'm <span className="text-gradient-brand">Abdirahman</span>.
          <br /> This is my digital space.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto"
        >
          A publishing platform, portfolio and knowledge archive — where I share statements,
          articles, ideas and the projects I build.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild variant="brand" size="lg">
            <Link href="/articles">
              Read my writing <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/portfolio">View portfolio</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
