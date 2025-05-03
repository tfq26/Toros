// src/pages/News/NewsPage.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { LoadingContext } from '@/contexts/LoadingContext.jsx'
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
} from '@/components/ui/carousel.jsx'
import { Button } from '@/components/ui/button.jsx'
import ArticleModal from '../Modals/ArticleModal.jsx'
import ArticleCard from './ArticleCard.jsx'
import PropTypes from 'prop-types'
import { ContextMenuItem } from "@radix-ui/react-context-menu"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from '@/components/ui/context-menu.jsx'

const CATEGORIES = ['all', 'equipment', 'local', 'app']

export default function NewsPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const isAdmin = user?.role === 'DEV'
    const { setLoading } = useContext(LoadingContext)

    const [news, setNews]                       = useState([])
    const [isModalOpen, setModalOpen]           = useState(false)
    const [activeCategory, setActiveCategory]   = useState('all')
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [searchTerm, setSearchTerm]           = useState('')

    // Fetch whenever category changes
    useEffect(() => {
        setLoading(true)
        ;(async () => {
            try {
                const items = activeCategory === 'all'
                    ? await fetchLatestNews()
                    : await fetchNewsByCategory(activeCategory)
                setNews(items)
            } catch (err) {
                navigate('/error', {
                    state: {
                        city: 'News',
                        message: 'Failed to load news articles.',
                        detailedMessage: err.message,
                        errorMessages: [],
                    },
                })
            } finally {
                setLoading(false)
            }
        })()
    }, [activeCategory, navigate, setLoading])

    // Filter & slice
    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const visibleNews = filteredNews.slice(0, 5)

    // Handlers
    const handleSave = article => {
        setNews(prev =>
            prev.some(a => a.id === article.id)
                ? prev.map(a => (a.id === article.id ? article : a))
                : [article, ...prev]
        )
        setModalOpen(false)
        setSelectedArticle(null)
    }

    const handleDelete = async id => {
        try {
            await deleteNewsItem(id)
            setNews(prev => prev.filter(a => a.id !== id))
        } catch (err) {
            console.error('Delete failed', err)
        }
    }

    return (
        <div className="space-y-6 p-4">
            {/* 1. Search */}
            <input
                type="search"
                placeholder="Search news…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none bg-white dark:bg-gray-200 text-gray-700"
            />

            {isAdmin && (
                <>
                    <Button
                        onClick={() => {
                            setSelectedArticle(null)
                            setModalOpen(true)
                        }}
                        className="w-fit px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
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

            {/* 2. Category Pills */}
            <div className="overflow-x-auto whitespace-nowrap px-4 py-2 -mx-4">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`
                            inline-block px-3 py-1 mr-2 rounded-full text-sm font-medium
                            ${activeCategory === cat
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 dark:bg-gray-200 text-gray-700'}
                        `}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* 3. Carousel (sm+) */}
            <div className="hidden sm:block">
                {visibleNews.length > 0 ? (
                    <Carousel>
                        <CarouselContent className="ml-10 px-4">
                            {visibleNews.map(item => (
                                <CarouselItem
                                    key={item.id}
                                    className="
                                        snap-start pl-4 basis-full
                                        sm:basis-1/2 md:basis-1/3 lg:basis-1/5
                                    "
                                >
                                    {isAdmin ? (
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
                                                    Edit
                                                </ContextMenuItem>
                                                <ContextMenuItem onSelect={() => handleDelete(item.id)}>
                                                    Delete
                                                </ContextMenuItem>
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    ) : (
                                        <ArticleCard item={item} />
                                    )}
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2" />
                        <CarouselNext     className="absolute right-1 top-1/2 -translate-y-1/2" />
                    </Carousel>
                ) : (
                    <div className="p-4 text-center text-gray-500">No articles found.</div>
                )}
            </div>

            {/* 4. Mobile List */}
            <ul className="sm:hidden divide-y">
                {filteredNews.map(item => (
                    <li key={item.id} className="py-4">
                        <ArticleCard item={item} className="px-0" />
                    </li>
                ))}
            </ul>

            {/* 5. Admin-only Add/Edit */}
        </div>
    )
}

ArticleCard.propTypes = {
    item: PropTypes.shape({
        id:            PropTypes.string.isRequired,
        link:          PropTypes.string.isRequired,
        coverImageUrl: PropTypes.string,
        title:         PropTypes.string.isRequired,
        publishedAt:   PropTypes.string.isRequired,
        summary:       PropTypes.string.isRequired,
    }).isRequired,
}
