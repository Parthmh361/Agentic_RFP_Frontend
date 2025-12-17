import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Bot, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-6">
        <div className="absolute inset-0 grid-background opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-primary/30 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary">Powered by Multi-Agent AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight uppercase" data-testid="hero-title">
              Agentic RFP
              <br />
              <span className="text-primary">Automation System</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Watch AI agents automatically scan, analyze, and respond to RFPs in real-time.
              Experience the future of automated procurement orchestrated through n8n workflows.
            </p>

            <div className="flex items-center justify-center gap-4 pt-6">
              <Link to="/automation">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_25px_rgba(14,165,233,0.5)] font-heading uppercase tracking-wider text-base px-8"
                  data-testid="hero-cta-btn"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Watch Live Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/workflow">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-border hover:bg-muted font-heading uppercase tracking-wider text-base px-8"
                  data-testid="hero-secondary-btn"
                >
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight">
              The Problem
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Traditional RFP response processes are slow, manual, and error-prone. Teams spend countless hours
              monitoring portals, extracting requirements, matching products, and calculating costs.
              <span className="text-primary font-semibold"> What if AI agents could do this automatically?</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight">
                The Solution
              </h2>
              <p className="text-lg text-muted-foreground">
                An intelligent multi-agent system that automates the entire RFP response workflow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Bot,
                  title: 'AI Agents',
                  description: 'Specialized agents for extraction, validation, matching, and pricing work in harmony'
                },
                {
                  icon: Zap,
                  title: 'Automated Execution',
                  description: 'Once triggered, the entire workflow runs automatically without human intervention'
                },
                {
                  icon: TrendingUp,
                  title: 'Real-Time Processing',
                  description: 'Watch agents process RFPs in real-time with live status updates and logs'
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-morphism rounded-xl p-6 space-y-4 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-morphism rounded-2xl p-12 text-center space-y-6 border-primary/30"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
              Ready to See It in Action?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the power of automated RFP processing. Select an RFP and watch the agents work.
            </p>
            <Link to="/automation">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_25px_rgba(14,165,233,0.5)] font-heading uppercase tracking-wider text-lg px-10"
                data-testid="cta-btn"
              >
                <Zap className="h-5 w-5 mr-2" />
                Launch Live Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}