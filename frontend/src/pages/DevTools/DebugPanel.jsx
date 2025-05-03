// src/components/DevDebugPanel.jsx
import React, { useContext } from 'react'
import { ThemeContext }        from '@/contexts/ThemeContext.jsx'
import { LoadingContext }      from '@/contexts/LoadingContext.jsx'
import { AuthContext }         from '@/contexts/AuthContext.jsx'
import { NotificationContext } from '@/contexts/NotificationContext.jsx'
import { ModalContext }        from '@/contexts/ModalContext.jsx'
import { ErrorContext }        from '@/contexts/ErrorContext.jsx'
import { NetworkContext }      from '@/contexts/NetworkContext.jsx'
import { FeatureFlagContext }  from '@/contexts/FeatureFlagContext.jsx'

export default function DevDebugPanel() {
    const { theme, setTheme }       = useContext(ThemeContext)
    const { isLoading, setLoading } = useContext(LoadingContext)
    const { user, login, logout }   = useContext(AuthContext)
    const { notify }                = useContext(NotificationContext)
    const { openModal, closeModal } = useContext(ModalContext)
    const { throwError }            = useContext(ErrorContext)
    const { online }                = useContext(NetworkContext)
    const { isEnabled }             = useContext(FeatureFlagContext)

    return (
        <div style={{
            position: 'fixed', bottom: 0, right: 0,
            background: 'rgba(0,0,0,0.8)', color:'#fff',
            padding: '1rem', fontSize:'0.8rem', zIndex:9999,
            maxWidth: '300px'
        }}>
            <h4>🐞 Dev Debug Panel</h4>

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
                <button onClick={() => login()}>log in</button>
                <button onClick={() => logout()}>log out</button>
            </div>

            <div>
                <strong>Notify</strong>
                <button onClick={() => notify('Hello from Dev Panel', {type:'info'})}>
                    👍 toast
                </button>
            </div>

            <div>
                <strong>Modal</strong>
                <button onClick={() => openModal('articleEditor', {article:{id:'123'}})}>
                    open
                </button>
                <button onClick={closeModal}>close</button>
            </div>

            <div>
                <strong>Error</strong>
                <button onClick={() => throwError(new Error('Test error'), {city:'Dev'})}>
                    throw
                </button>
            </div>

            <div>
                <strong>Network</strong>: {online ? 'online' : 'offline'}
            </div>

            <div>
                <strong>Flag “betaFeature”</strong>: {isEnabled('betaFeature').toString()}
            </div>
        </div>
    )
}
