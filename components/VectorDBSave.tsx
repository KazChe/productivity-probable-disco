import React, { useState } from 'react'

type Tag = {
  name: string
  active: boolean
}

export default function VectorDBSave() {
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

  return (
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
  )
}