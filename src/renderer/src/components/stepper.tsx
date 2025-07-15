import { Minus, Plus } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

interface StepperProps {
  value?: number;
  step?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({
  value = 0,
  onChange,
  min = 0,
  max,
  step = 1,
}: StepperProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(value);
  const currentValue = isControlled ? value : internalValue;

  const setValueSafely = (newValue: number) => {
    if (min !== undefined && newValue < min) {
      return;
    }
    if (max !== undefined && newValue > max) {
      return;
    }

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className="inline-flex">
      <Button
        aria-label="Decrease value"
        className="size-9 rounded-r-none"
        disabled={currentValue <= (min ?? Number.NEGATIVE_INFINITY)}
        onClick={() => setValueSafely(currentValue - step)}
        size="icon"
        variant="outline"
      >
        <Minus />
      </Button>
      <div
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={currentValue}
        className="size-9 place-content-center border-y bg-background text-center dark:border-input"
        role="spinbutton"
      >
        {currentValue}
      </div>
      <Button
        aria-label="Increase value"
        className="size-9 rounded-l-none"
        disabled={currentValue >= (max ?? Number.POSITIVE_INFINITY)}
        onClick={() => setValueSafely(currentValue + step)}
        size="icon"
        variant="outline"
      >
        <Plus />
      </Button>
    </div>
  );
}
