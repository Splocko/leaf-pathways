'use client'

import React, { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { getSupabaseClient } from '../lib/supabase'

const LEGACY_WHATSAPP_MEMBERS = 2000

interface MemberCounterProps {
  variant?: 'section' | 'inline'
}

function RollingDigit({ digit, shouldReduceMotion }: { digit: string; shouldReduceMotion: boolean }) {
  if (shouldReduceMotion) {
    return <span className="inline-flex h-[1em] w-[0.72em] items-center justify-center">{digit}</span>
  }

  const numericDigit = Number.parseInt(digit, 10)

  return (
    <span className="relative inline-flex h-[1em] w-[0.72em] overflow-hidden align-baseline">
      <motion.span
        className="absolute left-0 top-0 flex w-full flex-col"
        animate={{ y: `-${numericDigit}em` }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      >
        {Array.from({ length: 10 }, (_, value) => (
          <span key={value} className="flex h-[1em] w-full items-center justify-center leading-none">
            {value}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

function RollingNumber({ value, shouldReduceMotion }: { value: number; shouldReduceMotion: boolean }) {
  const formattedValue = value.toLocaleString()

  return (
    <span className="inline-flex items-end leading-none">
      {formattedValue.split('').map((character, index) => {
        if (character === ',') {
          return (
            <span key={`separator-${index}`} className="inline-block px-[0.06em]">
              ,
            </span>
          )
        }

        return <RollingDigit key={`digit-${index}`} digit={character} shouldReduceMotion={shouldReduceMotion} />
      })}
    </span>
  )
}

export default function MemberCounter({ variant = 'section' }: MemberCounterProps) {
  const [targetNumber, setTargetNumber] = useState<number>(LEGACY_WHATSAPP_MEMBERS)
  const [animatedCount, setAnimatedCount] = useState<number>(LEGACY_WHATSAPP_MEMBERS)
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const reduceMotion = Boolean(shouldReduceMotion)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const count = useMotionValue(LEGACY_WHATSAPP_MEMBERS)

  useMotionValueEvent(count, 'change', (latest) => {
    setAnimatedCount(Math.round(latest))
  })

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    const fetchMemberCount = async () => {
      try {
        const { count, error } = await supabase
          .from('community_members')
          .select('*', { count: 'exact', head: true })

        if (!error && count !== null) {
          const nextTarget = LEGACY_WHATSAPP_MEMBERS + count
          setTargetNumber((previousTarget) => Math.max(previousTarget, nextTarget))
        }
      } catch (err) {
        console.error('Failed to fetch member count', err)
      }
    }

    fetchMemberCount()

    // Business rule: members only ever increase from website signups, so listen to INSERT only.
    const channel = supabase
      .channel('public:community-members-count')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_members' },
        () => {
          fetchMemberCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!isInView) {
      return
    }

    if (reduceMotion) {
      count.set(targetNumber)
      return
    }

    const controls = animate(count, targetNumber, {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    })

    return () => controls.stop()
  }, [count, isInView, reduceMotion, targetNumber])

  const inlineContent = (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        <span className="font-montserrat text-3xl font-black leading-none text-[#D4AF37] sm:text-4xl">
          +
        </span>
        <span
          className="font-montserrat text-5xl font-black leading-none tracking-tight text-white tabular-nums sm:text-6xl"
          style={{ textShadow: '0 10px 30px rgba(2,11,9,0.22)' }}
        >
          <RollingNumber value={animatedCount} shouldReduceMotion={reduceMotion} />
        </span>
      </div>
      <p className="mt-2 text-center font-poppins text-sm leading-relaxed text-white/75 sm:text-base">
        Students and young professionals in the LEAF network.
      </p>
    </div>
  )

  if (variant === 'inline') {
    return (
      <div ref={ref} className="mt-3 sm:mt-4">
        {inlineContent}
      </div>
    )
  }

  return (
    <section
      className="relative overflow-hidden py-14 sm:py-16 fade-in-section"
      style={{
        background: 'linear-gradient(180deg, #0A3D2E 0%, #0A2E23 40%, #072117 70%, #0A3D2E 100%)'
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0A3D2E]/18 to-transparent" />
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-[#0A3D2E]/28 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-48 w-48 rounded-full bg-[#0B1B34]/28 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-28 w-[70%] -translate-x-1/2 rounded-full bg-[#D4AF37]/8 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[32px] px-6 py-8 sm:px-8 sm:py-10 lg:px-12"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 45%, rgba(11,27,52,0.18) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.03), 0 18px 45px rgba(2,11,9,0.26), 0 8px 20px rgba(10,61,46,0.16)',
            backdropFilter: 'blur(18px)'
          }}
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-white/6 blur-2xl" />
          <div className="absolute bottom-4 right-8 h-20 w-20 rounded-full bg-[#D4AF37]/8 blur-2xl" />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <div
              className="inline-flex items-center rounded-full px-4 py-2"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 18px rgba(2,11,9,0.16)'
              }}
            >
              <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37] sm:text-xs">
                Leaf community
              </span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-1.5 sm:gap-2">
              <span className="font-montserrat text-4xl font-black leading-none text-[#D4AF37] sm:text-5xl md:text-6xl">
                +
              </span>
              <span
                className="font-montserrat text-6xl font-black leading-none tracking-tight text-white tabular-nums sm:text-7xl md:text-8xl"
                style={{ textShadow: '0 10px 30px rgba(2,11,9,0.22)' }}
              >
                <RollingNumber value={animatedCount} shouldReduceMotion={reduceMotion} />
              </span>
            </div>

            <p className="mt-5 max-w-2xl font-poppins text-base leading-relaxed text-white/72 sm:text-lg">
              Students and young professionals already building momentum through the LEAF network.
            </p>

            <div
              className="mt-6 inline-flex items-center rounded-full px-5 py-3"
              style={{
                background: 'linear-gradient(145deg, rgba(10,61,46,0.55), rgba(11,27,52,0.34))',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 24px rgba(2,11,9,0.18)'
              }}
            >
              <span className="relative inline-flex h-2 w-2">
                <motion.span
                  className="absolute inset-0 rounded-full bg-[#D4AF37]"
                  animate={{ scale: [1, 1.9, 1], opacity: [0.85, 0.2, 0.85] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
              </span>
              <span className="ml-3 font-montserrat text-xs font-medium uppercase tracking-[0.22em] text-white/62 sm:text-sm">
                Growing every Day
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

