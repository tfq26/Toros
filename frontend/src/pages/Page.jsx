// src/pages/Page.jsx
import { useEffect } from 'react'
import PropTypes from 'prop-types'

export default function Page({ title, children }) {
    useEffect(() => {
        const base = 'Toros'
        // only interpolate if it's a primitive
        if (typeof title === 'string' || typeof title === 'number') {
            document.title = `${base} – ${title}`
        } else {
            console.warn('Invalid Page “title” prop:', title)
            document.title = base
        }
    }, [title])

    return <>{children}</>
}

Page.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.node,
}
