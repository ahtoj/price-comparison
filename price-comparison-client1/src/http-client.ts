import axios from 'axios'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const httpCLient = axios.create({
    baseURL: (process.env.NODE_ENV === 'production') ? 'https://api.shopleech.com:8080' : 'http://localhost:8080',
    headers: {
        'Content-type': 'application/json'
    },
})

export default httpCLient
