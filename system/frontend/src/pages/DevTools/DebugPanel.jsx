// src/components/DevDebugPanel.jsx (FIXED)

import React from 'react'
// ✅ Import the custom hooks from each context file
import { useTheme } from '@/contexts/ThemeContext.jsx'
import { useLoading } from '@/contexts/LoadingContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useNotification } from '@/contexts/NotificationContext.jsx'
import { useModal } from '@/contexts/ModalContext.jsx'
import { useError } from '@/contexts/ErrorContext.jsx'
import { useNetwork } from '@/contexts/NetworkContext.jsx'
import { useFeatureFlag } from '@/contexts/FeatureFlagContext.jsx'

export default function DevDebugPanel() {
    // ✅ Use the custom hooks directly. Much cleaner!
    const { theme, setTheme } = useTheme()
    const { isLoading, setLoading } = useLoading()
    const { user, login, logout } = useAuth()
    const { notify } = useNotification()
    const { openModal, closeModal } = useModal()
    const { setError } = useError() // Changed from throwError for consistency
    const { online } = useNetwork()
    const { isEnabled } = useFeatureFlag()

    return (
        <div style={{
            position: 'fixed', bottom: 0, right: 0,
            background: 'rgba(0,0,0,0.8)', color: '#fff',
            padding: '1rem', fontSize: '0.8rem', zIndex: 9999,
            maxWidth: '300px', borderTopLeftRadius: '8px'
        }}>
            <h4>🐞 Dev Debug Panel</h4>

            {/* The rest of the component JSX remains the same */}
            <div>
                <strong>Theme</strong>: {theme}
                <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                    toggle
                </button>
            </div>

            <div>
                <strong>Loading</strong>: {isLoading ? 'yes' : 'no'}
                <button onClick={() => setLoading(!isLoading)}>toggle</button>
            </div>

            <div>
                <strong>Auth</strong>: {user ? user.name : 'not logged in'}
                <button onClick={() => login(/* mock user data */)}>log in</button>
                <button onClick={() => logout()}>log out</button>
            </div>

            <div>
                <strong>Notify</strong>
                <button onClick={() => notify('Hello from Dev Panel', { type: 'info' })}>
                    👍 toast
                </button>
            </div>

            <div>
                <strong>Modal</strong>
                <button onClick={() => openModal('articleEditor', { article: { id: '123' } })}>
                    open
                </button>
                <button onClick={closeModal}>close</button>
            </div>

            <div>
                <strong>Error</strong>
                <button onClick={() => setError(new Error('Test error from Dev Panel'))}>
                    throw
                </button>
            </div>

            <div>
                <strong>Network</strong>: {online ? 'online' : 'offline'}
            </div>

            <div>
                <strong>Flag “betaFeature”</strong>: {isEnabled('betaFeature')?.toString()}
            </div>
        </div>
    )
}