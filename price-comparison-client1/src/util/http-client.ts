import axios from 'axios'
import appConfig from './app-config'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const httpCLient = axios.create({
    baseURL: appConfig.apiBaseUrl,
    headers: {
        'Content-type': 'application/json'
    },
})

export default httpCLient
