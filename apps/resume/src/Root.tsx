import React from 'react'
import { RemoteRoot } from '@sonhoseong/mfa-lib'
import App from './exposes/App'

function Root() {
    return <RemoteRoot><App /></RemoteRoot>
}

export default Root
