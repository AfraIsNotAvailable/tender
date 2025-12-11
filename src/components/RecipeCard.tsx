import { motion, useMotionValue, useTransform } from "motion/react";
import type { Tables } from "../types/types";

type Recipe = Tables<'recipes'>

interface RecipeCardProps {
    recipe: Recipe
    index: number
    onSwipe: (direction: 'left' | 'right') => void
}

export default function RecipeCard({ recipe, index, onSwipe }: RecipeCardProps) {
    const isFront = index === 0
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-10, 10])
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])
    const cardStyle = {
        zIndex: 50 - index,
        scale: 1 - index * 0.05,
        y: index * 15,
        opacity: 1 - index * 0.2,
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
    }

    const handleDragEnd = (_: any, info: any) => {
        if (!isFront) return
        const threshold = 100
        if (info.offset.x > threshold) {
            onSwipe('right')
        } else if (info.offset.x < -threshold) {
            onSwipe('left')
        }
    }

    const imageUrl = recipe.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=800&fit=crop"

    return (
        <motion.div
            layout
            style={cardStyle}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            exit={{ x: x.get() < 0 ? -1000 : 1000, opacity: 0, transition: { duration: 0.2 } }}
            className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing origin-top"
            pointerEvents={isFront ? "auto" : "none"}
        >

            <img src={imageUrl} alt={recipe.name} className="w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 w-full p-6 text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{recipe.name}</h2>
                <div className="flex flex-wrap gap-2">
                    {recipe.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}