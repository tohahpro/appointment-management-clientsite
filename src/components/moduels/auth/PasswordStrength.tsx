import { cn } from '@/lib/utils'
import  { useMemo } from 'react'


interface PasswordStrengthProps {
  password?: string
}

export function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    let score = 0
    if (!password) return 0
    if (password.length > 6) score += 1
    if (password.length > 10) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    return Math.min(score, 4)
  }, [password])
  return (
    <div className="flex gap-1 h-1 mt-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-full flex-1 rounded-full transition-all duration-300 ease-out',
            i < strength
              ? strength <= 2
                ? 'bg-red-500'
                : strength === 3
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              : 'bg-transparent',
          )}
        />
      ))}
    </div>
  )
}
