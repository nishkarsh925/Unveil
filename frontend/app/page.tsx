"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { StoryComparison } from '@/components/story-comparison';
import { DashboardMetrics } from '@/components/dashboard-metrics';
import { MediaLiteracyGame } from '@/components/game';
import BiasDetector from '@/components/bias-detector';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, Shield } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--accent-primary))] rounded-full filter blur-[128px] opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--accent-secondary))] rounded-full filter blur-[128px] opacity-20" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Hero Section */}
          <motion.section 
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent"
            >
              Your Media Reality Check
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/70 mb-8"
            >
              Track accuracy, analyze bias, and understand what's truly important in today's news.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex justify-center gap-4"
            >
              <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] hover:opacity-90">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/5">
                Learn More
              </Button>
            </motion.div>
          </motion.section>

          {/* Features Grid */}
          <motion.section
            variants={fadeInUp}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Analysis",
                description: "Advanced algorithms analyze media content in real-time"
              },
              {
                icon: Target,
                title: "Bias Detection",
                description: "Identify and understand different forms of media bias"
              },
              {
                icon: Shield,
                title: "Fact Verification",
                description: "Cross-reference information across trusted sources"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="glass-panel h-full p-6 backdrop-blur-xl bg-white/5 border-white/10">
                  <feature.icon className="h-10 w-10 mb-4 text-[hsl(var(--accent-primary))]" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.section>

          {/* Bias Detector Section */}
          <motion.section 
            variants={fadeInUp}
            className="mb-16"
          >
            <BiasDetector />
          </motion.section>

          {/* Story Comparison Section */}
          <motion.section 
            variants={fadeInUp}
            className="space-y-8"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Trending vs Important</h2>
                <p className="text-white/70">
                  Compare viral stories with significant news
                </p>
              </div>
            </div>
            <StoryComparison />
          </motion.section>

          {/* Metrics and Game Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.section 
              variants={fadeInUp}
              className="glass-panel p-8 rounded-xl backdrop-blur-xl bg-white/5 border-white/10"
            >
              <DashboardMetrics />
            </motion.section>

            <motion.section 
              variants={fadeInUp}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">Test Your Skills</h2>
                <p className="text-white/70">
                  Challenge yourself with our media literacy game
                </p>
              </div>
              <MediaLiteracyGame />
            </motion.section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}