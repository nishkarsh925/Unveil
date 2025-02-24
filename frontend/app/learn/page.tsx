"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, BarChart2, Clock, Brain, Medal, Trophy } from 'lucide-react';

const learningModules = [
  {
    title: "Understanding Media Bias",
    description: "Learn to identify and analyze different forms of media bias",
    progress: 65,
    lessons: 8,
    timeEstimate: "2 hours",
    icon: BarChart2,
    color: "emerald"
  },
  {
    title: "Fact-Checking Fundamentals",
    description: "Master the essential techniques of fact verification",
    progress: 30,
    lessons: 6,
    timeEstimate: "1.5 hours",
    icon: BookOpen,
    color: "amber"
  },
  {
    title: "Source Credibility",
    description: "Evaluate the reliability of information sources",
    progress: 0,
    lessons: 5,
    timeEstimate: "1 hour",
    icon: Award,
    color: "blue"
  }
];

const achievements = [
  { icon: Trophy, label: 'Perfect Score', unlocked: true },
  { icon: Brain, label: 'Quick Thinker', unlocked: true },
  { icon: Award, label: 'Expert Analyst', unlocked: false },
  { icon: Medal, label: 'Master Detective', unlocked: false }
];

export default function LearnPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <section className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Media Literacy Hub</h1>
            <p className="text-lg text-muted-foreground">
              Master the skills to navigate today's complex media landscape
            </p>
          </section>

          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-panel h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-white/5">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{module.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.lessons} lessons • {module.timeEstimate}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{module.description}</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress 
                            value={module.progress} 
                            className="bg-white/10"
                            indicatorClassName={`bg-${module.color}-500`}
                          />
                        </div>
                        <Button 
                          className={`w-full ${
                            module.progress === 0 
                              ? 'bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]' 
                              : ''
                          }`}
                        >
                          {module.progress === 0 ? 'Start Module' : 'Continue Learning'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </section>

          <Card className="glass-panel p-8 mt-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Certification Track</h2>
                <p className="text-muted-foreground mb-6">
                  Complete our comprehensive curriculum and earn a certificate in media analysis
                </p>
                <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]">
                  <Award className="h-5 w-5 mr-2" />
                  Start Certification
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-white/10 text-white'
                        : 'bg-white/5 text-white/50'
                    } hover:bg-white/15 transition-colors duration-200`}
                  >
                    <achievement.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{achievement.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}