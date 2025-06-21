// src/components/Error/ErrorHandler.jsx (NEW FILE)

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '@/contexts/ErrorContext';

export default function ErrorHandler() {
    const { error } = useError();
    const navigate = useNavigate();

    useEffect(() => {
        // If an error object exists, navigate to the error page.
        if (error) {
            // You can optionally pass state to the error page
            navigate('/error', { state: { error } });
        }
    }, [error, navigate]);

    // This component renders nothing. It's purely for logic.
    return null;
}