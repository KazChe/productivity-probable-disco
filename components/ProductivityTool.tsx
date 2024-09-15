'use client'

import { useState } from 'react'
import { Shuffle, Home, Database, Send, Search } from 'lucide-react'
import TodaysNews from './TodaysNews'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Tag = {
  name: string
  active: boolean
}

export default function Component() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [vectorDbInput, setVectorDbInput] = useState('')
  const [tags, setTags] = useState<Tag[]>([
    { name: 'slack', active: false },
    { name: 'document', active: false },
    { name: 'neo4j-driver', active: false },
    { name: 'template-response', active: false },
    { name: 'code-snippet', active: false },
    { name: 'logging-query', active: false },
    { name: 'cypher', active: false },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: `Response to: ${input}` }])
      }, 1000)
      setInput('')
    }
  }

  const handleTagToggle = (index: number) => {
    const newTags = [...tags]
    newTags[index].active = !newTags[index].active
    setTags(newTags)
  }

  const handleSaveToVectorDb = () => {
    const activeTags = tags.filter(tag => tag.active).map(tag => tag.name)
    console.log('Saving to Vector DB:', { text: vectorDbInput, tags: activeTags })
    // Here you would typically send this data to your backend
    setVectorDbInput('')
    setTags(tags.map(tag => ({ ...tag, active: false })))
  }

  const handleHomeClick = () => {
    setSelectedItem(null)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800"
          onClick={handleHomeClick}
        >
          <span className="font-semibold">Productivity Tool</span>
          <Home className="w-4 h-4" />
        </div>
        
        {/* Sidebar content */}
        <div className="p-4 flex-grow">
          {/* Playground */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-gray-600 rounded-sm"></span>
                <span>Playground</span>
              </div>
            </div>
            <div className="pl-6 space-y-2 text-sm text-gray-500">
              <div
                className="flex items-center justify-between cursor-pointer hover:text-gray-200"
                onClick={() => setSelectedItem('Search My Stuff')}
              >
                <span>Search My Stuff</span>
                <Search className="w-4 h-4" />
              </div>
              <div
                className="flex items-center justify-between cursor-pointer hover:text-gray-200"
                onClick={() => setSelectedItem('Save to Vector DB')}
              >
                <span>Save to Vector DB</span>
                <Database className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between cursor-pointer hover:text-gray-200">
                <span>Will do some stuff here</span>
                <Shuffle className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Home button at the bottom */}
        <div className="p-4">
          <div
            className="flex items-center justify-between cursor-pointer hover:text-gray-200 border-6 border-gray-700 p-2 rounded"
            onClick={handleHomeClick}
          >
            <span>Home</span>
            <Home className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {selectedItem === 'Search My Stuff' ? (
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 overflow-auto mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : selectedItem === 'Save to Vector DB' ? (
          <div className="flex-1 flex flex-col p-4">
            <textarea
              value={vectorDbInput}
              onChange={(e) => setVectorDbInput(e.target.value)}
              className="w-full h-40 p-2 mb-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter data to save to Vector DB..."
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <button
                  key={tag.name}
                  onClick={() => handleTagToggle(index)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    tag.active
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleSaveToVectorDb}
              className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex-1 p-4 space-y-4">
            <div className="border border-dashed border-gray-700 rounded-lg p-4 flex items-center justify-center">
              <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
            </div>
            <TodaysNews />
          </div>
        )}
      </div>
    </div>
  )
}