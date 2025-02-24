"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, Twitter } from "lucide-react"

const teamMembers = [
  {
    name: "Tanishk Narula",
    role: "Lead Developer",
    bio: "Proficient in GenAI and full-stack development",
    image: "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairBob&accessoriesType=Prescription02&hairColor=BrownDark&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=Hoodie&clotheColor=Gray02&eyeType=Default&eyebrowType=UpDown&mouthType=Serious&skinColor=Light",
    social: {
      twitter: "https://twitter.com/infinitani",
      github: "https://github.com/imtani",
      email: "tanidev69@gmail.com"
    }
  },
  {
    name: "Nishkarsh Bains",
    role: "ML Engineer",
    bio: "Expert in machine learning and natural language processing",
    image: "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortWaved&accessoriesType=Prescription01&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",
    social: {
      github: "https://github.com/nishkarsh925",
      email: "nishcodingzone@gmail.com"
    }
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Our Mission</h1>
            <p className="text-lg text-white/70">
              Empowering readers with tools and insights to navigate today's complex media landscape
            </p>
          </section>

          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                metric: "1M+",
                label: "Stories Analyzed",
                description: "Comprehensive media coverage analysis"
              },
              {
                metric: "50K+",
                label: "Active Users",
                description: "Growing community of critical thinkers"
              },
              {
                metric: "98%",
                label: "Accuracy Rate",
                description: "In our analytical methodology"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-panel p-6 text-center">
                  <h2 className="text-3xl font-bold mb-2">{stat.metric}</h2>
                  <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                  <p className="text-white/70">{stat.description}</p>
                </Card>
              </motion.div>
            ))}
          </section>

          <section className="grid md:grid-cols-2 gap-12">
            <Card className="glass-panel p-8">
              <h2 className="text-2xl font-bold mb-6">Our Approach</h2>
              <div className="space-y-4">
                {[
                  "Advanced AI-powered analysis",
                  "Multi-source verification",
                  "Transparent methodology",
                  "Community-driven insights"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent-primary))]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="glass-panel p-8">
              <h2 className="text-2xl font-bold mb-6">Get Involved</h2>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
                <Button className="w-full" variant="outline">
                  <Github className="h-5 w-5 mr-2" />
                  Contribute
                </Button>
                <Button className="w-full" variant="outline">
                  <Twitter className="h-5 w-5 mr-2" />
                  Follow Updates
                </Button>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-panel overflow-hidden">
                    <div className="aspect-square w-full bg-white/5">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-[hsl(var(--accent-primary))] mb-2">{member.role}</p>
                      <p className="text-white/70 mb-4">{member.bio}</p>
                      <div className="flex space-x-3">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`mailto:${member.social.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </main>
  )
}