"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
  { name: "Jan", accuracy: 65, bias: 45 },
  { name: "Feb", accuracy: 75, bias: 35 },
  { name: "Mar", accuracy: 85, bias: 25 },
  { name: "Apr", accuracy: 80, bias: 30 },
  { name: "May", accuracy: 90, bias: 20 },
]

export function DashboardMetrics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Media Trends</h2>
        <p className="text-[hsl(var(--muted))]">
          Track accuracy and bias trends across major news sources
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-panel p-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255,255,255,0.1)" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted))"
                  tick={{ fill: "hsl(var(--muted))" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted))"
                  tick={{ fill: "hsl(var(--muted))" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  width={40}
                  domain={[0, 100]}
                  tickCount={6}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--nav-bg))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "hsl(var(--muted))" }}
                  cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--data-1))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--data-1))", r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  animationDuration={1000}
                />
                <Line 
                  type="monotone" 
                  dataKey="bias" 
                  stroke="hsl(var(--data-2))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--data-2))", r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}