import { useEffect, useState } from 'react'
import { getStore, restoreFromStorage, ModalContainer, ToastContainer } from '@sonhoseong/mfa-lib'
import App from './App'

function Root() {
    const [initialized, setInitialized] = useState(false)
    useEffect(() => {
        restoreFromStorage(getStore())
        setInitialized(true)
    }, [])
    if (!initialized) return null
    return (
        <>
            <ModalContainer />
            <ToastContainer />
            <App />
        </>
    )
}

export default Root
