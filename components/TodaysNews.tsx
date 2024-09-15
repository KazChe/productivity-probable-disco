'use client'

import { useState, useEffect } from 'react'
import { Rss, SquareX } from 'lucide-react'

type FeedItem = {
  title: string
  link: string
  pubDate: string
  source: string
}

type Feed = {
  url: string
  name: string
}

const initialFeeds: Feed[] = [
  { url: 'https://feed.syntax.fm/rss', name: 'Syntax.fm' },
//   { url: 'https://cloudblog.withgoogle.com/rss/', name: 'Google Cloud Blog' },
]

export default function TodaysNews() {
  const [feeds, setFeeds] = useState<Feed[]>(initialFeeds)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRssFeeds = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const allItems = await Promise.all(
          feeds.map(async (feed) => {
            const response = await fetch(`${feed.url}`)
            if (!response.ok) {
              throw new Error(`Failed to fetch RSS feed: ${feed.name}`)
            }
            const text = await response.text()
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(text, 'text/xml')
            const items = xmlDoc.querySelectorAll('item')
            return Array.from(items).slice(0, 5).map((item) => ({
              title: item.querySelector('title')?.textContent || '',
              link: item.querySelector('link')?.textContent || '',
              pubDate: item.querySelector('pubDate')?.textContent || '',
              source: feed.name,
            }))
          })
        )
        setFeedItems(allItems.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()))
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load RSS feeds')
        setIsLoading(false)
      }
    }

    fetchRssFeeds()
  }, [feeds])

  const removeFeed = (url: string) => {
    setFeeds(feeds.filter(feed => feed.url !== url))
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Rss className="mr-2" />
          Today&apos;s News
        </h2>
        <p>Loadinger...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Rss className="mr-2" />
          Today&apos;s News
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Rss className="mr-2" />
        Today&apos;s News
      </h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Active Feeds:</h3>
        <ul className="space-y-2">
          {feeds.map((feed) => (
            <li key={feed.url} className="flex items-center justify-between ">
              <span className="px-2 py-1 rounded-full border border-gray-600">
              {feed.name}</span>
              <button
                onClick={() => removeFeed(feed.url)}
                className="text-red-500 hover:text-red-400"
              >
                <SquareX className="w-8 h-8" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ul className="space-y-4">
        {feedItems.map((item, index) => (
          <li key={index} className="border-b border-gray-700 pb-2">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              {item.title}
            </a>
            <p className="text-sm text-gray-400">
              {new Date(item.pubDate).toLocaleDateString()} - Source: {item.source}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}