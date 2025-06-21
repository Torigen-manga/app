import { useSidebar, SidebarTrigger } from './ui/sidebar'
import { ChevronLeft, ChevronRight, Minus, Square, X } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'

export function TitleBar() {
  const { state, isMobile } = useSidebar()
  const navigate = useNavigate()

  function handleMinimize(): void {
    window.electron.ipcRenderer.invoke('window:minimize')
  }

  function handleToggleMaximize(): void {
    window.electron.ipcRenderer.invoke('window:maximize')
  }

  function handleClose(): void {
    window.electron.ipcRenderer.invoke('window:close')
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleForward = () => {
    navigate(1)
  }

  const getLeftOffset = () => {
    if (isMobile) {
      return '0px'
    }

    if (state === 'expanded') {
      return '16rem'
    } else {
      return '3rem'
    }
  }

  const NavigationButtons = () => (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50 size-8 transition-colors"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          <p>Go back</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50 size-8 transition-colors"
            onClick={handleForward}
            aria-label="Go forward"
          >
            <ChevronRight className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          <p>Go forward</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )

  return (
    <header
      className="items-center-2 bg-sidebar fixed top-0 right-0 z-50 flex h-8 items-center justify-between pl-2 transition-[left,width] duration-200 ease-linear"
      style={
        {
          left: getLeftOffset(),
          width: `calc(100% - ${getLeftOffset()})`,
          WebkitAppRegion: 'drag'
        } as React.CSSProperties
      }
    >
      <div className="inline-flex" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <SidebarTrigger className="size-8" />
        <NavigationButtons />
      </div>

      <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={handleMinimize}
          className="dark:hover:bg-sidebar-border flex size-8 items-center justify-center transition-colors hover:bg-black/10"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleToggleMaximize}
          className="dark:hover:bg-sidebar-border flex size-8 items-center justify-center transition-colors hover:bg-black/10"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <Square size={14} />
        </button>
        <button
          onClick={handleClose}
          className="flex size-8 items-center justify-center transition-colors hover:bg-red-400 hover:text-white"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <X size={16} />
        </button>
      </div>
    </header>
  )
}
