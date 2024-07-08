"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "/Users/saharsh.babu/hacker-news-app/src/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, userName, ...props }, ref) => {
  const [userData, setUserData] = React.useState(null);
  async function fetchUserData(userName: string) {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${userName}.json?print=pretty`);
    const userData = await response.json();
    setUserData(userData)
  }
  React.useEffect(() => {
    if (userName) {
      fetchUserData(userName);
    }
  }, [userName])

  return (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {
      userData ? (
        <div>
          <div className="text-sm font-semibold">{userData.id}</div>
          <div className="text-sm">{userData.karma} karma</div>
          <div className="text-xs text-muted-foreground">{userData.about}</div>
        </div>
      ) : (
        <div>Waiting for response...</div>
      )
    }
  </HoverCardPrimitive.Content>
  )
})

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
