'use client'
import React, { useState, useEffect } from 'react'

type LogoProps = {
  className?: string
  alt?: string
  ariaHidden?: boolean
}

export default function Logo({ className = 'inline-block h-8 w-8', alt = 'Leaf logo', ariaHidden = false }: LogoProps) {
  // Serve a local file from /public so it does not hit Supabase Storage.
  // Place `leaflogo.png` at public/images/leaflogo.png in your project.
  const [imageUrl] = useState('/images/leaflogo.png')
  
  return (
    <picture>
      <source srcSet="/images/leaflogo-96.webp" type="image/webp" />
      <img
        src={imageUrl}
        alt={ariaHidden ? '' : alt}
        aria-hidden={ariaHidden}
        className={className}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onError={(e) => {
          // Fallback: show emoji if image fails to load
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const span = document.createElement('span')
          span.textContent = '🌿'
          span.className = className
          target.parentNode?.replaceChild(span, target)
        }}
      />
    </picture>
  )
}
