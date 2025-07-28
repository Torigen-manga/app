import type { PageLayout, ReadingDir } from "@common/index";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { Separator } from "@renderer/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
  type LucideIcon,
  Menu,
} from "lucide-react";
import { useState } from "react";

function ReaderMenuButton({
  pageLayout,
  onPageLayoutChange,
  readingDirectory,
  onReadingDirectionChange,
}: ButtonReaderMenuProps) {
  const [menuToolTipVisible, setMenuToolTipVisible] = useState(false);

  return (
    <Tooltip open={menuToolTipVisible}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              onMouseEnter={() => setMenuToolTipVisible(true)}
              onMouseLeave={() => setMenuToolTipVisible(false)}
              size="icon"
              variant="outline"
            >
              <Menu />
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Page Layout</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={pageLayout}>
            <DropdownMenuRadioItem
              onSelect={() => onPageLayoutChange("single-page")}
              value="single-page"
            >
              Single Page
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onSelect={() => onPageLayoutChange("double-page")}
              value="double-page"
            >
              Double Page
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onSelect={() => onPageLayoutChange("vertical-scroll")}
              value="vertical-scroll"
            >
              Vertical Scroll
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Reading Direction</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={readingDirectory}>
            <DropdownMenuRadioItem
              onSelect={() => onReadingDirectionChange("ltr")}
              value="ltr"
            >
              Left to Right
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onSelect={() => onReadingDirectionChange("rtl")}
              value="rtl"
            >
              Right to Left
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent>
        <span>Reader Options</span>
      </TooltipContent>
    </Tooltip>
  );
}

interface ButtonReaderMenuProps {
  pageLayout: PageLayout;
  onPageLayoutChange: (value: PageLayout) => void;
  readingDirectory: ReadingDir;
  onReadingDirectionChange: (value: ReadingDir) => void;
}

function CustomTooltipButton({
  text,
  action,
  icon,
}: {
  text: string;
  action?: () => void;
  icon: LucideIcon;
}) {
  const IconComponent = icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={action} size="icon" variant="outline">
          <IconComponent />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>{text}</span>
      </TooltipContent>
    </Tooltip>
  );
}

interface ButtonGroupProps {
  buttons: { action: () => void; icon: LucideIcon; text: string }[];
  isVertical: boolean;
}

function ReaderButtonGroup({ buttons, isVertical }: ButtonGroupProps) {
  return (
    <div className={cn("flex gap-2", isVertical && "flex-col")}>
      {buttons.map((button) => (
        <CustomTooltipButton
          action={button.action}
          icon={button.icon}
          key={button.text}
          text={button.text}
        />
      ))}
    </div>
  );
}

interface ReaderMenuProps {
  pageLayout: PageLayout;
  onPageLayoutChange: (value: PageLayout) => void;
  readingDirectory: ReadingDir;
  onReadingDirectionChange: (value: ReadingDir) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFirst: () => void;
  onLast: () => void;
  onNextChapter: () => void;
  onPreviousChapter: () => void;
}

function ReaderMenu({
  pageLayout,
  onPageLayoutChange,
  onNext,
  onPrevious,
  onFirst,
  onLast,
  readingDirectory,
  onReadingDirectionChange,
  onNextChapter,
  onPreviousChapter,
}: ReaderMenuProps) {
  const isVertical = pageLayout === "vertical-scroll";

  function fromLTRAction(action1: () => void, action2: () => void) {
    if (isVertical) {
      return action1;
    }

    return readingDirectory === "ltr" ? action1 : action2;
  }

  function fromLTRText(option1: string, option2: string) {
    if (isVertical) {
      return option1;
    }

    return readingDirectory === "ltr" ? option1 : option2;
  }

  const firstGroup = [
    {
      action: fromLTRAction(onFirst, onLast),
      icon: isVertical ? ChevronsUp : ChevronsLeft,
      text: fromLTRText("First Page", "Last Page"),
    },
    {
      action: fromLTRAction(onPrevious, onNext),
      icon: isVertical ? ChevronUp : ChevronLeft,
      text: fromLTRText("Previous Page", "Next Page"),
    },
  ];

  const secondGroup = [
    {
      action: fromLTRAction(onNext, onPrevious),
      icon: isVertical ? ChevronDown : ChevronRight,
      text: fromLTRText("Next Page", "Previous Page"),
    },
    {
      action: fromLTRAction(onLast, onFirst),
      icon: isVertical ? ChevronsDown : ChevronsRight,
      text: fromLTRText("Last Page", "First Page"),
    },
  ];

  const thirdGroup = [
    {
      action: fromLTRAction(onPreviousChapter, onNextChapter),
      icon: isVertical ? ArrowUp : ArrowLeft,
      text: fromLTRText("Previous Chapter", "Next Chapter"),
    },
    {
      action: fromLTRAction(onNextChapter, onPreviousChapter),
      icon: isVertical ? ArrowDown : ArrowRight,
      text: fromLTRText("Next Chapter", "Previous Chapter"),
    },
  ];

  return (
    <div
      className={cn(
        "right-5 bottom-5 flex items-center gap-4 rounded-lg border bg-background p-2 shadow-lg",
        isVertical ? "fixed flex-col" : "absolute h-14 flex-row"
      )}
    >
      <TooltipProvider>
        <ReaderMenuButton
          onPageLayoutChange={onPageLayoutChange}
          onReadingDirectionChange={onReadingDirectionChange}
          pageLayout={pageLayout}
          readingDirectory={readingDirectory}
        />
        <Separator orientation={isVertical ? "horizontal" : "vertical"} />
        <ReaderButtonGroup buttons={firstGroup} isVertical={isVertical} />
        <ReaderButtonGroup buttons={secondGroup} isVertical={isVertical} />
        <Separator orientation={isVertical ? "horizontal" : "vertical"} />
        <ReaderButtonGroup buttons={thirdGroup} isVertical={isVertical} />
      </TooltipProvider>
    </div>
  );
}

export { ReaderMenu };
