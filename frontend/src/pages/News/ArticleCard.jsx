// src/pages/News/ArticleCard.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx'
import { AspectRatio } from '@/components/ui/aspect-ratio.jsx'

const DEFAULT_COVER = '/images/default-cover.jpg'

export default function ArticleCard({ item }) {
    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:shadow-lg transition-shadow"
        >
            <Card className="rounded-lg shadow-md overflow-hidden">
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
        id:            PropTypes.string.isRequired,
        link:          PropTypes.string.isRequired,
        coverImageUrl: PropTypes.string,
        title:         PropTypes.string.isRequired,
        publishedAt:   PropTypes.string.isRequired,
        summary:       PropTypes.string.isRequired,
    }).isRequired,
}
