import { cva } from 'class-variance-authority'

export const coverVariant = cva('rounded-lg', {
  variants: {
    property: {
      default: 'rounded-none',
      shadow: 'shadow-lg dark:shadow-white/10',
      rounded: 'rounded-xl',
      border: 'bourder '
    }
  }
})
