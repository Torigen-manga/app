import { Button } from '@renderer/components/ui/button'

interface ErrorProps {
  code: number
  message?: string
}

const errorMessages: Record<number, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  500: 'Internal Server Error'
}

export function ErrorPage({ code, message }: ErrorProps): React.JSX.Element {
  const errorMessage = errorMessages[code] || 'Unknown Error'

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h1 className="text-destructive text-3xl font-bold">
          {code} - {errorMessage}
        </h1>
        {message && <p className="text-muted-foreground mt-2">{message}</p>}
        <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  )
}
