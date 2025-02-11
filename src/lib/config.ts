/*import { dev } from '$app/environment';

export const title = 'Laboratorio Remoto';
export const description = 'Laboratorio Remoto - Análisis de Sistemas y Señales';
export const url = dev ? 'http://127.0.0.1:8090' : 'http://labremotomd.fi-p.unam.mx';
export const pocketbaseURL = dev ? url : url;
export const streamURL = dev
	? 'http://localhost:10000/api/whep'
	: 'http://labremotomd.fi-p.unam.mx:10000/api/whep';
export const streamKey = 'RemoteLabStream';
*/

/* 
Resumen del propósito
Este código establece una serie de constantes con valores configurables dependiendo de si el entorno de ejecución es desarrollo o producción. Estas constantes podrían ser usadas para:

	1. Configurar URLs base para interactuar con el backend (como PocketBase o servicios de streaming).
	2. Definir metadatos del proyecto (como título y descripción).
	3. Configurar detalles específicos de transmisión o conexiones de red.
 */

import { dev } from '$app/environment';

//export const url_s = "http://labremotomd.fi-p.unam.mx:3000";
export const url_s = "localhost:3000";

export const title = 'Laboratorio Remoto';
export const description = 'Laboratorio Remoto - Análisis de Sistemas y Señales';
//export const url = dev ? 'http://127.0.0.1:8090' : 'http://132.148.52.21:8090';
export const url = dev ? 'http://132.248.52.21:8090' : 'http://132.248.52.21:8090';
export const pocketbaseURL = dev ? url : url;
export const streamURL = dev
	? 'http://localhost:10000/api/whep'
	: 'http://132.248.52.21:10000/api/whep';
export const streamKey = 'RemoteLabStream';