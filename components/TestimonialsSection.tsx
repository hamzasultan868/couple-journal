'use client'

import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const testimonials = [
    {
      name: 'Sarah & Michael',
      text: 'We were in a long-distance relationship. This journal became our daily ritual. We felt connected even 5000 miles apart.',
      rating: 5,
    },
    {
      name: 'Emma & James',
      text: 'I proposed by writing a heartfelt entry. When James read it, he cried. Best memory we could have captured together.',
      rating: 5,
    },
    {
      name: 'Lisa & David',
      text: 'After 10 years together, we scrolled through our entire timeline. It was like watching our love grow over time. Perfect.',
      rating: 5,
    },
  ]

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by Thousands of Couples
          </h2>
          <p className="text-gray-400">Real stories from real couples</p>
        </motion.div>

        {/* Testimonial carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative"
        >
          <div className="p-8 md:p-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-xl text-gray-100 mb-8 leading-relaxed italic">
              &ldquo;{testimonials[current].text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">
                  {testimonials[current].name}
                </p>
                <p className="text-sm text-gray-400">Verified couple</p>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrent(
                      current === 0 ? testimonials.length - 1 : current - 1
                    )
                  }
                  className="p-3 rounded-lg backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrent(
                      current === testimonials.length - 1 ? 0 : current + 1
                    )
                  }
                  className="p-3 rounded-lg backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex gap-2 justify-center mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? 'bg-pink-500 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-6 mt-16"
        >
          {[
            { label: 'Active Couples', value: '10,000+' },
            { label: 'Memories Shared', value: '500K+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
            >
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-2">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
