/**
 * @author Ahto Jalak
 * @since 01.04.2023
 */
export interface IRegisterInfo {
    invitation: string
    email: string
    firstname: string
    lastname: string
    password: string
    consent: boolean
    provider: string
    credential: string
}
