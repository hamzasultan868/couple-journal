'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Begin?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Start documenting your love story today. Completely free. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth">
              <button className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl">
                Create Your Journal
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10"
          >
            <Lock className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">
              Bank-level encryption • Always free • No ads
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
