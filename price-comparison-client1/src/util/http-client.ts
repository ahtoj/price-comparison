import axios from 'axios'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const httpCLient = axios.create({
    baseURL: `${import.meta.env.VITE_PUBLIC_API_URL}`,
    headers: {
        'Content-type': 'application/json'
    },
})

export default httpCLient
