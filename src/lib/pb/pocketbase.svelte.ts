/*
	RESUMEN DEL CÓDIGO:
	Este código proporciona una interfaz estructurada para interactuar con usuarios a través de PocketBase, incluyendo la gestión de errores y el manejo de datos de usuarios.
*/

// Importa la biblioteca PocketBase y tipos específicos para manejar opciones de listas de registros y modelos de registros.
import PocketBase, { type RecordListOptions, type RecordModel } from 'pocketbase';
// Importa la URL de PocketBase desde la configuración de la aplicación.
import { pocketbaseURL } from '$lib/config';
// Importa una clase de error específica para manejar errores de respuesta del cliente.
import { ClientResponseError } from 'pocketbase';

// Define un tipo de usuario con propiedades opcionales y requeridas.
export type User = {
	id?: string; // ID opcional del usuario.
	name: string; // Nombre del usuario.
	username: string; // Nombre de usuario.
	email: string; // Correo electrónico del usuario.
	collectionName?: string; // Nombre de la colección a la que pertenece el usuario.
	collectionId?: string; // ID de la colección.
	emailVisibility?: boolean; // Visibilidad del correo electrónico.
	role?: string; // Rol del usuario.
};

// Clase de error personalizada para manejar el caso en que un usuario no se encuentra.
export class userNotFoundError extends Error {
	constructor(message: string) {
		super(message); // Llama al constructor de la clase base Error.
		this.name = 'UserNotFoundError'; // Asigna un nombre a la clase de error.
	}
}

// Clase de error personalizada para manejar un correo electrónico inválido.
export class invalidEmailError extends Error {
	constructor(message: string) {
		super(message); // Llama al constructor de la clase base Error.
		this.name = 'InvalidEmailError'; // Asigna un nombre a la clase de error.
	}
}

// Clase de error personalizada para manejar un nombre de usuario inválido.
export class invalidUsernameError extends Error {
	constructor(message: string) {
		super(message); // Llama al constructor de la clase base Error.
		this.name = 'InvalidUsernameError'; // Asigna un nombre a la clase de error.
	}
}

// Clase de error personalizada para manejar una contraseña inválida.
export class invalidPasswordError extends Error {
	constructor(message: string) {
		super(message); // Llama al constructor de la clase base Error.
		this.name = 'InvalidPasswordError'; // Asigna un nombre a la clase de error.
	}
}

// Clase de error personalizada para manejar un nombre inválido.
export class invalidNameError extends Error {
	constructor(message: string) {
		super(message); // Llama al constructor de la clase base Error.
		this.name = 'InvalidNameError'; // Asigna un nombre a la clase de error.
	}
}

// Clase de error personalizada para manejar un nombre de colección inválido.
export class invalidCollectionNameError extends Error {
	constructor(message: string) {
		super(message); // Llama al constructor de la clase base Error.
		this.name = 'InvalidCollectionName'; // Asigna un nombre a la clase de error.
	}
}

// Función para mapear un registro de PocketBase a un objeto de tipo User.
function mapUser(record: RecordModel): User {
	let role = record.collectionName; // Obtiene el nombre de la colección como rol.
	// Asigna un rol descriptivo según el nombre de la colección.
	switch (role) {
		case 'students':
			role = 'Estudiante'; // Rol para estudiantes.
			break;
		case 'collaborators':
			role = 'Colaborador'; // Rol para colaboradores.
			break;
		case 'supervisors':
			role = 'Administrador'; // Rol para administradores.
			break;
		default:
			role = 'Usuario'; // Rol por defecto.
			break;
	}

	// Devuelve un objeto User mapeado con propiedades del registro.
	return {
		id: record.id, // ID del registro.
		name: record.name, // Nombre del registro.
		username: record.username, // Nombre de usuario del registro.
		email: record.email, // Correo electrónico del registro.
		collectionName: record.collectionName, // Nombre de la colección.
		collectionId: record.collectionId, // ID de la colección.
		emailVisibility: record.emailVisibility, // Visibilidad del correo electrónico.
		role: role // Rol mapeado.
	};
}

// Función para crear una nueva instancia de PocketBase.
function newPocketBase() {
	const pb = new PocketBase(pocketbaseURL); // Crea una instancia de PocketBase con la URL especificada.

	// Función para restablecer la contraseña de un usuario.
	async function resetPassword(email: string, role: string): Promise<User | null> {
		try {
			await pb.collection(role).requestPasswordReset(email); // Solicita el restablecimiento de contraseña.
			return null; // Retorna null si la operación es exitosa.
		} catch (error) {
			if (error instanceof ClientResponseError) { // Comprueba si el error es una instancia de ClientResponseError.
				console.error('No encontrado', error); // Registra un mensaje de error.
			}
			return null; // Retorna null en caso de error.
		}
	}

	// Función para crear un nuevo usuario en una colección específica.
	async function createUser(collection: string, data: User): Promise<User | null> {
		try {
			return await pb.collection(collection).create(data); // Crea un nuevo registro de usuario.
		} catch (error) {
			if (error instanceof ClientResponseError) { // Comprueba si el error es una instancia de ClientResponseError.
				// Maneja diferentes tipos de errores basados en la respuesta.
				if (error.data.data.email) {
					throw new invalidEmailError(error.data.data.email); // Lanza un error si el correo es inválido.
				} else if (error.data.data.username) {
					throw new invalidUsernameError(error.data.data.username); // Lanza un error si el nombre de usuario es inválido.
				} else if (error.data.data.password) {
					throw new invalidPasswordError(error.data.data.password); // Lanza un error si la contraseña es inválida.
				} else {
					console.log(error.data.data); // Registra otros posibles errores.
				}
			}
			return null; // Retorna null en caso de error.
		}
	}

	// Función para obtener todos los usuarios de una colección específica.
	async function getAll(collection: string): Promise<User[] | null> {
		try {
			const records = await pb.collection(collection).getFullList({ // Obtiene todos los registros de la colección.
				sort: 'name' // Ordena los registros por nombre.
			});
			return records.map(mapUser); // Mapea los registros a objetos User.
		} catch (error) {
			if (error instanceof ClientResponseError) { // Comprueba si el error es una instancia de ClientResponseError.
				console.error('No encontrado', error); // Registra un mensaje de error.
			}
			return null; // Retorna null en caso de error.
		}
	}

	// Función para obtener un usuario por un campo específico.
	async function getByField(
		field: string,
		value: string,
		collection: string
	): Promise<User | null> {
		try {
			const record = await pb.collection(collection).getFirstListItem(`${field}='${value}'`); // Obtiene el primer registro que coincida con el campo y valor especificados.
			return mapUser(record); // Mapea el registro a un objeto User.
		} catch (error) {
			if (error instanceof ClientResponseError) { // Comprueba si el error es una instancia de ClientResponseError.
				throw new userNotFoundError(`No se encontró el usuario con ${field} = ${value}`); // Lanza un error si no se encuentra el usuario.
			}
			return null; // Retorna null en caso de error.
		}
	}

	// Función para eliminar un usuario específico.
	async function deleteUser(user: User) {
		try {
			await pb.collection(user.collectionName!).delete(user.id!); // Elimina el registro del usuario en la colección correspondiente.
		} catch (error) {
			if (error instanceof ClientResponseError) { // Comprueba si el error es una instancia de ClientResponseError.
				console.log(error.data.data); // Registra el mensaje de error.
			}
		}
	}

	// Función para eliminar un usuario por un campo específico.
	async function deleteByField(field: string, value: string, collection: string) {
		const user = await getByField(field, value, collection); // Obtiene el usuario por el campo especificado.
		if (user) { // Si se encuentra el usuario, procede a eliminarlo.
			deleteUser(user); // Llama a la función para eliminar el usuario.
		}
	}

	// Retorna un objeto que contiene métodos y propiedades para interactuar con PocketBase.
	return {
		get instance() {
			return pb; // Devuelve la instancia de PocketBase.
		},
		login(username: string, password: string, role: string = 'users') {
			try {
				return pb.collection(role).authWithPassword(username, password); // Autentica al usuario con nombre de usuario y contraseña.
			} catch (error) {
				console.error('Error authenticating with password:', error); // Registra un mensaje de error en caso de fallo.
				throw error; // Relanza el error para ser manejado por el llamador.
			}
		},
		authStoreIsValid() {
			return pb.authStore.isValid; // Verifica si la tienda de autenticación es válida.
		},
		logout() {
			pb.authStore.clear(); // Limpia la tienda de autenticación.
		},
		authStoreToken() {
			return pb.authStore.token; // Devuelve el token de la tienda de autenticación.
		},
		authStoreModel() {
			return pb.authStore.model; // Devuelve el modelo de la tienda de autenticación.
		},
		isLoggedIn() {
			return this.authStoreIsValid(); // Verifica si el usuario está logueado.
		},
		get loggedUser() {
			return this.authStoreModel(); // Devuelve el usuario que está actualmente logueado.
		},
		isRole(role: string) {
			const authStoreModel = this.authStoreModel(); // Obtiene el modelo de autenticación.
			return authStoreModel && authStoreModel.collectionName === role; // Comprueba si el rol del modelo coincide con el rol proporcionado.
		},
		resetPassword(email: string, role: string) {
			return resetPassword(email, role); // Llama a la función para restablecer la contraseña.
		},
		async createUser(collection: string, data: User): Promise<User | null> {
			return await createUser(collection, data); // Llama a la función para crear un nuevo usuario.
		},
		async createUserFromFields(
			name: string,
			username: string,
			email: string,
			password: string,
			collection: string,
			passwordConfirm: string = '',
			emailVisibility: boolean = true
		) {
			// Comprueba si faltan campos requeridos.
			if (!name || !username || !email || !password) {
				console.error('Missing required fields'); // Registra un mensaje de error.
				return null; // Retorna null si faltan campos.
			}
			if (passwordConfirm.length === 0) {
				passwordConfirm = password; // Asigna passwordConfirm si está vacío.
			}
			if (password !== passwordConfirm) {
				console.error('Passwords do not match'); // Registra un mensaje de error si las contraseñas no coinciden.
				return null; // Retorna null si las contraseñas no coinciden.
			}
			const data = {
				name,
				username,
				email,
				emailVisibility,
				passwordConfirm,
				password
			}; // Crea un objeto de datos para el nuevo usuario.
			return await createUser(collection, data); // Llama a la función para crear un nuevo usuario con los datos proporcionados.
		},
		getAll(collection: string) {
			return getAll(collection); // Llama a la función para obtener todos los usuarios de la colección.
		},
		getByField(field: string, value: string, collection: string) {
			return getByField(field, value, collection); // Llama a la función para obtener un usuario por campo.
		},
		getByName(name: string, collection: string) {
			return getByField('name', name, collection); // Llama a la función para obtener un usuario por nombre.
		},
		deleteByField(field: string, value: string, collection: string) {
			return deleteByField(field, value, collection); // Llama a la función para eliminar un usuario por campo.
		},
		deleteByName(name: string, collection: string) {
			return deleteByField('name', name, collection); // Llama a la función para eliminar un usuario por nombre.
		},
		deleteUser(user: User) {
			return deleteUser(user); // Llama a la función para eliminar un usuario específico.
		},
		addUsersFromFile(data: FormData) {
			return pb.collection('files').update('lastUploadedCSV', data); // Actualiza la colección de archivos con un nuevo archivo CSV.
		},
		// Función para obtener el primer elemento de la lista de una colección con un filtro y opciones.
		async getFirstListItem(collection: string, filter: string, options?: RecordListOptions) {
			try {
				const record = await pb.collection(collection).getFirstListItem(filter, options); // Obtiene el primer registro que coincide con el filtro.
				return mapUser(record); // Mapea el registro a un objeto User.
			} catch (error) {
				if (error instanceof ClientResponseError) { // Comprueba si el error es una instancia de ClientResponseError.
					throw new userNotFoundError(`No se encontró el usuario.`); // Lanza un error si no se encuentra el usuario.
				}
				return null; // Retorna null en caso de error.
			}
		}
	};
}

// Crea y exporta una instancia de PocketBase.
export const pb = newPocketBase();
