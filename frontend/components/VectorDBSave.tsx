import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Neo4jService } from '@/lib/neo4j-service';

type Tag = {
  name: string;
  active: boolean;
};

type Category = {
  name: string;
  subcategories: string[];
};

export default function VectorDBSave() {

  const [vectorDbInput, setVectorDbInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [tags, setTags] = useState<Tag[]>([
    { name: "slack", active: false },
    { name: "document", active: false },
    { name: "neo4j-driver", active: false },
    { name: "template-response", active: false },
    { name: "code-snippet", active: false },
    { name: "logging-query", active: false },
    { name: "cypher", active: false },
  ]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { name: "Development", subcategories: ["Frontend", "Backend", "DevOps"] },
    { name: "Design", subcategories: ["UI", "UX", "Graphic Design"] },
    { name: "Documentation", subcategories: ["API", "User Guide", "Technical Specs"] }
  ]);

  const [error, setError] = useState<string | null>(null);
  const neo4jService = new Neo4jService();

  const handleTagToggle = (index: number) => {
    const newTags = [...tags];
    newTags[index].active = !newTags[index].active;
    setTags(newTags);
  };

  const handleAddNewTag = () => {
    if (newTag && !tags.some((tag) => tag.name === newTag)) {
      setTags([...tags, { name: newTag, active: true }]);
      setNewTag("");
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory && !categories.some((cat) => cat.name === newCategory)) {
      setCategories([...categories, { name: newCategory, subcategories: [] }]);
      setSelectedCategory(newCategory);
      setNewCategory("");
    }
  };

  const handleAddNewSubcategory = () => {
    if (newSubcategory && selectedCategory) {
      const updatedCategories = categories.map((cat) =>
        cat.name === selectedCategory
          ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
          : cat
      );
      setCategories(updatedCategories);
      setSelectedSubcategory(newSubcategory);
      setNewSubcategory("");
    }
  };

  const handleSaveToVectorDb = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const activeTags = tags.filter((tag) => tag.active).map((tag) => tag.name);
      
      await neo4jService.saveContent({
        text: vectorDbInput,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        tags: activeTags,
      });

      // reset form
      setVectorDbInput("");
      setSelectedCategory("");
      setSelectedSubcategory("");
      setTags(tags.map((tag) => ({ ...tag, active: false })));
      
      // Show success message (you can use your toast system here)
      
    } catch (err) {
      console.error('Error saving to vector DB:', err);
      setError('Failed to save content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={vectorDbInput}
          onChange={(e) => setVectorDbInput(e.target.value)}
          className="w-full h-40"
          placeholder="Enter data to save to Vector DB..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <div className="flex space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="w-1/2"
          />
          <Button variant="blue" onClick={handleAddNewCategory}>Add</Button>
        </div>
      </div>

      {selectedCategory && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <div className="flex space-x-2">
            <Select
              value={selectedSubcategory}
              onValueChange={setSelectedSubcategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .find((cat) => cat.name === selectedCategory)
                  ?.subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              placeholder="New subcategory"
              className="w-1/2"
            />
            <Button variant="blue" onClick={handleAddNewSubcategory}>Add</Button>
          </div>
        </div>
      )}

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Button
              key={tag.name}
              onClick={() => handleTagToggle(index)}
              variant={tag.active ? "default" : "outline"}
              size="sm"
            >
              #{tag.name}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag"
            className="w-full"
          />
          <Button variant="blue" onClick={handleAddNewTag}>Add Tag</Button>
        </div>
      </div>

      <Button
        onClick={handleSaveToVectorDb}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save to Neo4j"
        )}
      </Button>
    </div>
  );
}
