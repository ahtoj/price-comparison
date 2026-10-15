import axios from 'axios'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const httpCLient = axios.create({
    baseURL: process.env.VUE_APP_API_URL || ((process.env.NODE_ENV === 'production') ? 'https://api.shopleech.com' : 'http://localhost:8080'),
    headers: {
        'Content-type': 'application/json'
    },
})

export default httpCLient
