import { dev } from '$app/environment';

export const title = 'Laboratorio Remoto';
export const description = 'Laboratorio Remoto - Análisis de Sistemas y Señales';
export const url = dev ? 'http://127.0.0.1:8090' : 'http://192.168.50.107:8090';
export const pocketbaseURL = dev ? url : url;
export const streamURL = dev
	? 'http://localhost:10000/api/whep'
	: 'http://192.168.50.117:10000/api/whep';
export const streamKey = 'RemoteLabStream';
