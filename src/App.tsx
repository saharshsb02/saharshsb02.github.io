import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/Users/saharsh.babu/hacker-news-app/src/components/ui/card"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "/Users/saharsh.babu/hacker-news-app/src/components/ui/navigation-menu.tsx"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "/Users/saharsh.babu/hacker-news-app/src/components/ui/hover-card"
import { Button } from "/Users/saharsh.babu/hacker-news-app/src/components/ui/button"
import './App.css'

function calculatePostTime(postUnixTime: number) {
  const currentUnixTime = Math.floor(Date.now()/1000);
  const difference = currentUnixTime - postUnixTime;
  if (difference < 60) {
    return 'just now'
  }
  else if (difference < 3600) {
    const minutesAgo = Math.floor(difference/60);
    if (minutesAgo == 1)
      return `${minutesAgo} minute ago`
    return `${minutesAgo} minutes ago`
  }
  else if (difference < 86400) {
    const hoursAgo = Math.floor(difference/3600);
    if (hoursAgo == 1)
      return `${hoursAgo} hour ago`
    return `${hoursAgo} hours ago`
  }
  else {
    const daysAgo = Math.floor(difference/86400);
    if (daysAgo == 1)
      return `${daysAgo} day ago`
    return `${daysAgo} days ago`
  }
}

function App() {
  const [stories, setStories] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const getTopStories = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
      const topStoryData = await getTopStories.json();
      const topThirtyStories = topStoryData.splice(0, 30);

      const storyData = topThirtyStories.map(async (storyId: number) => {
        const getStoryData = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`);
        return await getStoryData.json();
      });

      const allStories = await Promise.all(storyData);
      setStories(allStories);
    }
    fetchData(); 
  });
  
  return (
    <>
      <NavigationMenu>
      <span className='title'>HACKER NEWS</span>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Pages</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      { stories ? stories.map(story => (
        <Card>
        <CardHeader>
          <CardTitle>
            <a href={story.url}>{story.title}</a>
          </CardTitle>
          <CardDescription>
            <span>by <HoverCard>
              <HoverCardTrigger asChild>
                <span className='user-name'>{story.by}</span>
              </HoverCardTrigger>
              <HoverCardContent userName={story.by}>
              </HoverCardContent>
              </HoverCard>
            </span>
            <span className='separator'></span>
            <span>{calculatePostTime(story.time)}</span>
            <span className='separator'></span>
            <span>{story.descendants} comments</span>
          </CardDescription>
        </CardHeader>
      </Card>
      )) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default App
