import { Button } from './ui/button'
import { Minus, Plus } from 'lucide-react'
import React from 'react'

interface StepperProps {
  value?: number
  step?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
}

export function Stepper({ value = 0, onChange, min = 0, max, step = 1 }: StepperProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(value)
  const currentValue = isControlled ? value! : internalValue

  const setValueSafely = (newValue: number) => {
    if (min !== undefined && newValue < min) return
    if (max !== undefined && newValue > max) return

    if (!isControlled) setInternalValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="inline-flex">
      <Button
        size="icon"
        className="size-9 rounded-r-none"
        onClick={() => setValueSafely(currentValue - step)}
        aria-label="Decrease value"
        variant="outline"
        disabled={currentValue <= (min ?? -Infinity)}
      >
        <Minus />
      </Button>
      <div
        className="dark:border-input size-9 place-content-center border border-y text-center"
        role="spinbutton"
        aria-valuenow={currentValue}
        aria-valuemin={min}
        aria-valuemax={max}
      >
        {currentValue}
      </div>
      <Button
        size="icon"
        className="size-9 rounded-l-none"
        onClick={() => setValueSafely(currentValue + step)}
        disabled={currentValue >= (max ?? Infinity)}
        aria-label="Increase value"
        variant="outline"
      >
        <Plus />
      </Button>
    </div>
  )
}
