// src/pages/Page.jsx
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'

export default function Page({ title }) {
    useEffect(() => {
        const base = 'Toros'
        if (typeof title === 'string' || typeof title === 'number') {
            document.title = `${base} – ${title}`
        } else {
            console.warn('Invalid Page “title” prop:', title)
            document.title = base
        }
    }, [title])

    return <Outlet />
}

Page.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}
