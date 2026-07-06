import type { SyntheticEvent } from 'react'

const OBJECT_SEGMENT = '/storage/v1/object/public/'
const RENDER_SEGMENT = '/storage/v1/render/image/public/'

/**
 * Rewrites a Supabase Storage public URL to the image-render endpoint so the
 * CDN serves a resized WebP instead of the original upload (admin uploads can
 * be multi-MB PNGs). Non-Supabase URLs pass through untouched.
 */
export function resizedStorageImage(url: string, width: number, quality = 75): string {
  if (!url.includes(OBJECT_SEGMENT)) return url
  return `${url.replace(OBJECT_SEGMENT, RENDER_SEGMENT)}?width=${width}&quality=${quality}`
}

/** onError fallback: if a transformed URL fails, retry the original object. */
export function fallbackToOriginalImage(e: SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget
  if (img.src.includes(RENDER_SEGMENT)) {
    img.src = img.src.replace(RENDER_SEGMENT, OBJECT_SEGMENT).split('?')[0]
  }
}
