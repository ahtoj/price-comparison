/**
 * @author Ahto Jalak
 * @since 01.04.2023
 */
export default class Logger {
    className = ''

    constructor (name: string) {
        this.className = name
    }

    log (message: string, level?: 'info' | 'warn' | 'error') {
        if (import.meta.env.NODE_ENV !== 'production') {
            if (level === 'error') {
                console.error(this.className + ': ' + message)
            } else if (level === 'warn') {
                console.warn(this.className + ': ' + message)
            } else {
                console.log(this.className + ': ' + message)
            }
        }
    }

    error (message: string) {
        this.log(message, 'error')
    }

    warn (message: string) {
        this.log(message, 'warn')
    }

    info (message: string) {
        this.log(message, 'info')
    }
}
