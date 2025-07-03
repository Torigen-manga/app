import { cva } from 'class-variance-authority'

const coverVariant = cva('rounded-lg', {
  variants: {
    property: {
      default: 'rounded-none',
      shadow: 'rounded-none shadow-lg dark:shadow-white/10',
      rounded: 'rounded-xl',
      border: 'border-[0.124rem] border-primary rounded-sm'
    }
  }
})

export { coverVariant }
