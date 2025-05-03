// src/contexts/ModalContext.jsx
import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const ModalContext = createContext({
    openModal: (id, props) => {},
    closeModal: () => {},
})

export function ModalProvider({ children }) {
    const [modal, setModal] = useState({ id: null, props: {} })

    const openModal = (id, props = {}) => setModal({ id, props })
    const closeModal = () => setModal({ id: null, props: {} })

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {/* Example: conditionally render modals by id */}
            {modal.id === 'articleEditor' && (
                <ArticleEditorModal {...modal.props} onClose={closeModal} />
            )}
            {/* Add other modal mappings here */}
        </ModalContext.Provider>
    )
}

ModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
