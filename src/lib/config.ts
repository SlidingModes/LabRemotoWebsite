import { dev } from '$app/environment'

export const title = 'Laboratorio Remoto'
export const description = 'Laboratorio Remoto - Análisis de Sistemas y Señales'
export const url = dev ? 'https://192.168.68.114' : 'https://192.168.68.114'
export const pocketbaseURL = url + '/pb'
export const streamURL = url + '/stream/api/whep'
export const streamKey = 'RemoteLabStream'