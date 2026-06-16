import { useLocation } from 'react-router-dom'
import { RemoteRoot } from '@sonhoseong/mfa-lib'
import App from '@/App'

function Root() {
    const { pathname } = useLocation()
    return <RemoteRoot hideScrollTop={pathname.endsWith('/login')}><App /></RemoteRoot>
}

export default Root
