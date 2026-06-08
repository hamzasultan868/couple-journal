'use client'

import { motion } from 'framer-motion'
import { Clock, Users, Shield, Sparkles } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'End-to-end encryption ensures only you and your partner can access your memories',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Clock,
      title: 'Timeline View',
      description: 'Scroll through your entire relationship history beautifully organized by date',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Users,
      title: 'Truly Private',
      description: 'No algorithms, no ads, no data selling. Just you, your partner, and your memories',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: Sparkles,
      title: 'Beautiful Design',
      description: 'Elegantly crafted interface that celebrates your love story',
      color: 'from-amber-500 to-amber-600',
    },
  ]

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for Real Couples
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to preserve and celebrate your relationship
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 hover:from-white/10 hover:to-white/15 transition-all"
            >
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
