import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LearningModule = () => {
  const modules = [
    {
      title: "Understanding Media Bias",
      progress: 65,
      lessons: 8,
      timeEstimate: "2 hours",
      description: "Learn to identify and analyze different forms of media bias",
      icon: BarChart2
    },
    {
      title: "Fact-Checking Fundamentals",
      progress: 30,
      lessons: 6,
      timeEstimate: "1.5 hours",
      description: "Master the essential techniques of fact verification",
      icon: BookOpen
    },
    {
      title: "Source Credibility",
      progress: 0,
      lessons: 5,
      timeEstimate: "1 hour",
      description: "Evaluate the reliability of information sources",
      icon: Award
    }
  ];

  return (
    <div className="space-y-6">
      {modules.map((module, index) => {
        const Icon = module.icon;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel">
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
                    <Progress value={module.progress} />
                  </div>
                  <Button 
                    className={`w-full ${
                      module.progress === 0 
                        ? 'bg-gradient-to-r from-viral to-important' 
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
    </div>
  );
};

export default LearningModule;