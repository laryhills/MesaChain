"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"



// Define types for menu items
type Category = "Food" | "Drinks" | "Desserts"

interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    category: Category
    image: string
}

// Sample data
const initialMenuItems: MenuItem[] = [
    {
        id: "1",
        name: "Bacon Burger",
        description: "Juicy beef patty with crispy bacon",
        price: 8.63,
        category: "Food",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: "2",
        name: "Cheese Burger",
        description: "Classic burger with melted cheese",
        price: 8.05,
        category: "Food",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: "3",
        name: "Chicken Curry Sandwich",
        description: "Spicy chicken curry in a soft bun",
        price: 3.45,
        category: "Food",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: "4",
        name: "Chocolate Cake",
        description: "Rich chocolate cake with ganache",
        price: 5.99,
        category: "Desserts",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        id: "5",
        name: "Iced Coffee",
        description: "Cold brewed coffee with ice",
        price: 3.25,
        category: "Drinks",
        image: "/placeholder.svg?height=200&width=200",
    },
]

export default function MenuManagement() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
    const [activeCategory, setActiveCategory] = useState<"All" | Category>("All")
    const [searchInput, setSearchInput] = useState("")
    const debouncedSearchQuery = useDebounce(searchInput, 300)

    // Filter menu items based on search query and active category
    const filteredMenuItems = menuItems.filter((item) => {
        const matchesSearch =
            debouncedSearchQuery === "" ||
            item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            item.price.toString().includes(debouncedSearchQuery)

        const matchesCategory = activeCategory === "All" || item.category === activeCategory

        return matchesSearch && matchesCategory
    })

    // Handle menu item deletion
    const handleDelete = (id: string) => {
        setMenuItems(menuItems.filter((item) => item.id !== id))
    }

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold">Menu Management</h1>
                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            className="pl-10"
                            placeholder="Search menu items"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        {searchInput && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Badge variant="secondary" className="font-normal">
                                    {filteredMenuItems.length} results
                                    <button className="ml-1 hover:text-primary" onClick={() => setSearchInput("")}>
                                        ×
                                    </button>
                                </Badge>
                            </div>
                        )}
                    </div>
                    <Button className="whitespace-nowrap">
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                </div>
            </div>

            <Tabs
                defaultValue="All"
                value={activeCategory}
                onValueChange={(value) => setActiveCategory(value as "All" | Category)}
                className="mb-6"
            >
                <TabsList>
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="Food">Food</TabsTrigger>
                    <TabsTrigger value="Drinks">Drinks</TabsTrigger>
                    <TabsTrigger value="Desserts">Desserts</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
                ))}
            </div>
        </div>
    )
}

interface MenuItemCardProps {
    item: MenuItem
    onDelete: () => void
}

function MenuItemCard({ item, onDelete }: MenuItemCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="relative h-48 bg-gray-200">
                <Badge className="absolute top-2 right-2 z-10">{item.category}</Badge>
                <div className="w-full h-full flex items-center justify-center">
                    <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="object-cover"
                    />
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <span className="text-xl font-semibold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>
        </Card>
    )
}

