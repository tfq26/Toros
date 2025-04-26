// src/pages/News/NewsPage.jsx
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx'
import {
    fetchLatestNews,
    fetchNewsByCategory,
    deleteNewsItem,
} from '@/utils/functions/newsFunctions.js'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '../../components/ui/carousel.jsx'
import { AspectRatio } from '../../components/ui/aspect-ratio.jsx'
import ArticleModal from '../Modals/ArticleModal.jsx'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '../../components/ui/context-menu.jsx'
import { useAuth } from '../Auth/useAuth.js'
import PropTypes from 'prop-types'
import {Button} from "@/components/ui/button.jsx";

const CATEGORIES = ['all', 'equipment', 'local', 'app']
const DEFAULT_COVER = '/images/default-cover.jpg'

export default function NewsPage() {
    // only pull what you actually use
    const { isDev, loadingProfile } = useAuth()

    // your normal state
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setModalOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('all')
    const [selectedArticle, setSelectedArticle] = useState(null)

    // always call hooks top-level
    useEffect(() => {
        setLoading(true)
        setError(null)
        ;(async () => {
            try {
                const items =
                    activeCategory === 'all'
                        ? await fetchLatestNews()
                        : await fetchNewsByCategory(activeCategory)
                setNews(items)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        })()
    }, [activeCategory])

    // now that all hooks have run, we can early-return guards
    if (loadingProfile) {
        return <div className="p-6 text-center">Checking permissions…</div>
    }
    if (loading) {
        return <div className="flex justify-center items-center p-6">Loading news…</div>
    }
    if (error) {
        return <div className="text-red-500 p-6">Failed to load news.</div>
    }

    // handlers
    const handleSave = (article) => {
        setNews((prev) => {
            if (article.id && prev.some((a) => a.id === article.id)) {
                return prev.map((a) => (a.id === article.id ? article : a))
            }
            return [article, ...prev]
        })
        setModalOpen(false)
        setSelectedArticle(null)
    }

    const handleDelete = async (id) => {
        try {
            await deleteNewsItem(id)
            setNews((prev) => prev.filter((a) => a.id !== id))
        } catch (err) {
            console.error('Delete failed', err)
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Category Filters */}
            <div className="flex space-x-2">
                {CATEGORIES.map((cat) => (
                    <Button
                        key={cat}
                        className={`px-3 py-1 rounded ${
                            activeCategory === cat
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Button>
                ))}
            </div>

            {/* Add Article (devs only) */}
            {isDev && (
                <>
                    <Button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            setSelectedArticle(null)
                            setModalOpen(true)
                        }}
                    >
                        Add News Article
                    </Button>

                    <ArticleModal
                        isOpen={isModalOpen}
                        article={selectedArticle}
                        onClose={() => {
                            setModalOpen(false)
                            setSelectedArticle(null)
                        }}
                        onSave={handleSave}
                    />
                </>
            )}

            {/* Carousel */}
            <Carousel className="relative">
                <CarouselContent>
                    {news.map((item) => (
                        <CarouselItem key={item.id} className="w-[20%] px-20 py-6">
                            {isDev ? (
                                <ContextMenu>
                                    <ContextMenuTrigger>
                                        <ArticleCard item={item} />
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem
                                            onSelect={() => {
                                                setSelectedArticle(item)
                                                setModalOpen(true)
                                            }}
                                        >
                                            Edit Details
                                        </ContextMenuItem>
                                        <ContextMenuItem onSelect={() => handleDelete(item.id)}>
                                            Delete Article
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            ) : (
                                <ArticleCard item={item} />
                            )}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
            </Carousel>
        </div>
    )
}

function ArticleCard({ item }) {
    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[20%] block hover:shadow-lg transition-shadow"
        >
            <Card className="mx-2 rounded-lg shadow-md overflow-hidden">
                <AspectRatio ratio={16 / 9}>
                    <img
                        src={item.coverImageUrl || DEFAULT_COVER}
                        alt={item.title}
                        className="object-cover w-full h-full"
                    />
                </AspectRatio>

                <CardHeader className="px-4 pt-4">
                    <CardTitle className="text-lg font-semibold">
                        {item.title}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground mt-1">
                        {new Date(item.publishedAt).toLocaleString()}
                    </div>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                    <p className="text-sm mb-2">{item.summary}</p>
                    <span className="text-blue-600 hover:underline text-sm">
            Read full article →
          </span>
                </CardContent>
            </Card>
        </a>
    )
}

ArticleCard.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        coverImageUrl: PropTypes.string,
        title: PropTypes.string.isRequired,
        publishedAt: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
    }).isRequired,
}
