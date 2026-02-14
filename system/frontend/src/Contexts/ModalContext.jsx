import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Note: You would import your actual modal components here
// import ArticleEditorModal from '@/components/Modals/ArticleEditorModal.jsx';

// 1. Create the context (private)
const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modal, setModal] = useState({ id: null, props: {} });

    const openModal = (id, props = {}) => setModal({ id, props });
    const closeModal = () => setModal({ id: null, props: {} });

    return (
        <ModalContext.Provider value={{ openModal, closeModal, modal }}>
            {children}
        </ModalContext.Provider>
    );
}

ModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// 2. Create and export the custom hook
export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === null) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};