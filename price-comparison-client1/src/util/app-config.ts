const defaultApiBaseUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.shopleech.com'
    : 'http://localhost:8080'

const apiBaseUrl = process.env.VUE_APP_API_BASE_URL?.trim() || defaultApiBaseUrl
const googleClientId = process.env.VUE_APP_GOOGLE_CLIENT_ID?.trim() || ''

export const appConfig = {
    apiBaseUrl,
    googleClientId,
    isGoogleAuthEnabled: googleClientId.length > 0,
}

export default appConfig
