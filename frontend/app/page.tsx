"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StoryComparison } from '@/components/story-comparison';
import { DashboardMetrics } from '@/components/dashboard-metrics';
import { MediaLiteracyGame } from '@/components/game';
import BiasDetector from '@/components/bias-detector';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Sparkles, Target, Shield, 
  ChevronDown, BarChart2, Globe, Check, 
  BookOpen, Twitter, Facebook, Instagram, Linkedin,
  Mail, Phone, ExternalLink, ArrowUp
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const fadeInRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard() {
  const [scrolled, setScrolled] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--accent-primary))] rounded-full filter blur-[128px] opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--accent-secondary))] rounded-full filter blur-[128px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--accent-primary))/10] rounded-full filter blur-[64px] opacity-10" />
      </div>
      
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg' : ''}`}
      >
        
      </header>

      <main className="relative z-10 pt-20">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-24"
        >
          <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div 
                variants={fadeInRight}
                className="flex-1 space-y-6"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
                  <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--accent-primary))] mr-2 animate-pulse"></span>
                  <span>Cutting-edge media analysis platform</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-[hsl(var(--accent-primary))] via-white to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent">
                  Your Media<br />Reality Check
                </h1>
                
                <p className="text-xl text-white/70 max-w-xl">
                  Track accuracy, analyze bias, and understand what's truly important in today's news landscape with AI-powered insights.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] hover:opacity-90 shadow-lg shadow-[hsl(var(--accent-primary))]/20">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10">
                    Learn More
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 pt-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-background flex items-center justify-center text-xs font-medium">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-white/60">
                    <span className="text-white font-medium">500+</span> users analyzing media
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInLeft}
                className="flex-1 relative h-96"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-72 h-72">
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] rounded-full opacity-20 animate-pulse" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-4 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 flex items-center justify-center">
                      <Globe className="h-24 w-24 text-white/80" />
                    </div>
                    {[1, 2, 3].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-16 h-16 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 flex items-center justify-center"
                        style={{ 
                          top: `${30 + Math.sin(i * 2) * 60}%`,
                          left: `${75 + Math.cos(i * 2) * 60}%`,
                          animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`
                        }}
                      >
                        {i === 0 ? <BarChart2 className="h-6 w-6 text-[hsl(var(--accent-primary))]" /> : 
                         i === 1 ? <Target className="h-6 w-6 text-[hsl(var(--accent-secondary))]" /> :
                         <Shield className="h-6 w-6 text-emerald-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <motion.div 
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
                <Sparkles className="h-4 w-4 mr-2 text-[hsl(var(--accent-primary))]" />
                <span>Core Features</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Powerful Tools for Media Insight</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Our platform gives you everything you need to navigate today's complex media landscape
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: "AI-Powered Analysis",
                  description: "Advanced algorithms analyze media content in real-time to identify patterns and biases",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  icon: Target,
                  title: "Bias Detection",
                  description: "Identify and understand different forms of media bias with precision and context",
                  color: "from-amber-500 to-red-500"
                },
                {
                  icon: Shield,
                  title: "Fact Verification",
                  description: "Cross-reference information across trusted sources to determine accuracy",
                  color: "from-emerald-500 to-green-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-full overflow-hidden backdrop-blur-xl bg-white/5 border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--accent-primary))]/10">
                    <div className="p-1">
                      <div className={`bg-gradient-to-br ${feature.color} p-5 rounded-t-xl`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-[hsl(var(--accent-primary))] transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-white/70">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="container mx-auto px-4 py-16 relative">
            <motion.div
              variants={fadeInUp}
              className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(var(--accent-primary))]/5 to-transparent rounded-3xl"
            ></motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="mb-12 max-w-2xl"
            >
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
                <Target className="h-4 w-4 mr-2 text-[hsl(var(--accent-secondary))]" />
                <span>Bias Analysis</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Detect Media Bias Instantly</h2>
              <p className="text-xl text-white/70">
                Our advanced algorithms detect political, cultural and structural bias in any media content
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10"
            >
              <BiasDetector />
            </motion.div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
            >
              <div>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
                  <Globe className="h-4 w-4 mr-2 text-[hsl(var(--accent-primary))]" />
                  <span>News Analysis</span>
                </div>
                <h2 className="text-4xl font-bold mb-3">Trending vs Important</h2>
                <p className="text-xl text-white/70 max-w-xl">
                  See how viral content compares with truly significant news stories that impact our world
                </p>
              </div>
              <Button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm self-start md:self-auto">
                View Full Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              className="p-1 rounded-2xl bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]"
            >
              <div className="rounded-xl overflow-hidden backdrop-blur-xl bg-background/95 p-6">
                <StoryComparison />
              </div>
            </motion.div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-4">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Testimonials</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Trusted by Media Professionals</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                See what journalists, researchers and educators say about our platform
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Unveil has completely transformed how I evaluate news stories for my research.",
                  name: "Dr. Sarah Johnson",
                  role: "Media Researcher",
                  avatar: "SJ"
                },
                {
                  quote: "As a journalism professor, I recommend this tool to all my students. It's invaluable.",
                  name: "Prof. Michael Chen",
                  role: "Journalism Educator",
                  avatar: "MC"
                },
                {
                  quote: "This platform helps me ensure balanced reporting in my daily news coverage.",
                  name: "Taylor Rodriguez",
                  role: "Senior Journalist",
                  avatar: "TR"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full p-6 backdrop-blur-xl bg-white/5 border-white/10">
                    <div className="flex flex-col h-full">
                      <div className="mb-4 text-[hsl(var(--accent-primary))]">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="inline-block mr-1">★</span>
                        ))}
                      </div>
                      <p className="italic text-white/80 mb-6 flex-grow">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] flex items-center justify-center text-sm font-medium mr-3">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="font-medium">{testimonial.name}</h4>
                          <p className="text-sm text-white/60">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div 
                variants={fadeInUp}
                className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold mb-1">Your Media Dashboard</h2>
                  <p className="text-white/70">Track your media consumption patterns over time</p>
                </div>
                <div className="p-6">
                  <DashboardMetrics />
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold mb-1">Test Your Skills</h2>
                  <p className="text-white/70">Challenge yourself with our media literacy game</p>
                </div>
                <div className="p-6">
                  <MediaLiteracyGame />
                </div>
              </motion.div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <motion.div
              variants={fadeInUp}
              className="text-center py-16 px-4 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent-primary))/20] to-[hsl(var(--accent-secondary))/10] backdrop-blur-lg"
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent">
                Ready to see media differently?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of critical thinkers using our platform to navigate today's complex information landscape.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-white text-[hsl(var(--accent-primary))] hover:bg-white/90">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                  Schedule Demo
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </section>
        </motion.div>

        <footer className="border-t border-white/10 bg-background/50 backdrop-blur-md">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-[hsl(var(--accent-primary))]" />
                  <span className="font-bold text-xl bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent">Unveil</span>
                </div>
                <p className="text-sm text-white/60">
                  Cutting-edge media analysis platform helping you navigate information with clarity and insight.
                </p>
                <div className="flex space-x-4 text-white/60">
                  <Twitter className="h-5 w-5 hover:text-[hsl(var(--accent-primary))] cursor-pointer transition-colors" />
                  <Facebook className="h-5 w-5 hover:text-[hsl(var(--accent-primary))] cursor-pointer transition-colors" />
                  <Instagram className="h-5 w-5 hover:text-[hsl(var(--accent-primary))] cursor-pointer transition-colors" />
                  <Linkedin className="h-5 w-5 hover:text-[hsl(var(--accent-primary))] cursor-pointer transition-colors" />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Platform</h3>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><Link href="#" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Bias Detection</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Media Literacy</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Research</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Contact</h3>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>contact@unveil.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
              <p>© 2023 Unveil. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
      
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[hsl(var(--accent-primary))] text-white shadow-lg hover:bg-[hsl(var(--accent-primary))/90] transition-all"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
      
      <style jsx global>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}