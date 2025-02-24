'use client';

import { useState } from 'react';
import { AlertCircle, Check, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function BiasDetector() {
  const [articleText, setArticleText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeArticle = async () => {
    if (!articleText.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: articleText }),
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const BiasIndicator = ({ biasConfidence }) => {
    const confidence = parseFloat(biasConfidence);
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-white/5 backdrop-blur-sm">
        {confidence > 75 ? (
          <AlertCircle className="text-rose-500" />
        ) : confidence > 50 ? (
          <AlertTriangle className="text-amber-500" />
        ) : (
          <Check className="text-emerald-500" />
        )}
        <span className="font-semibold">
          Bias Confidence: {biasConfidence}%
        </span>
      </div>
    );
  };

  return (
    <Card className="glass-panel w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Bias Detector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          className="min-h-[120px] bg-white/5 border-white/10 focus-visible:ring-[hsl(var(--accent-primary))]"
          placeholder="Paste your article text here..."
          value={articleText}
          onChange={(e) => setArticleText(e.target.value)}
        />
        
        <Button
          className="w-full bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))]"
          onClick={analyzeArticle}
          disabled={loading || !articleText.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze Article'}
        </Button>

        {error && (
          <div className="p-4 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
            {error}
          </div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <BiasIndicator biasConfidence={analysis.bias_confidence} />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Analysis Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.breakdown).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                    <div className="font-medium">
                      {key.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </div>
                    <div className="text-white/70">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {analysis.biased_words.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Biased Language</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.biased_words.map((word, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.neutral_alternative && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Suggested Neutral Version</h3>
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
                  {analysis.neutral_alternative}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}