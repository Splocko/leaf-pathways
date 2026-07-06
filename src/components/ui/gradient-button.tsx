import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'gold'
  size?: 'sm' | 'md' | 'lg'
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = 'green', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn-gradient',
          variant === 'gold' && 'gold',
          size === 'sm' && 'sm',
          size === 'lg' && 'lg',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

GradientButton.displayName = 'GradientButton'

export default GradientButton
