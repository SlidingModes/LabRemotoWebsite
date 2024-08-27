import PocketBase, { type RecordListOptions, type RecordModel } from 'pocketbase';
import { pocketbaseURL } from '$lib/config';
import { ClientResponseError } from 'pocketbase';

export type User = {
	id?: string;
	name: string;
	username: string;
	email: string;
	collectionName?: string;
	collectionId?: string;
	emailVisibility?: boolean;
	role?: string;
};
export class userNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UserNotFoundError';
	}
}

export class invalidEmailError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidEmailError';
	}
}

export class invalidUsernameError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidUsernameError';
	}
}

export class invalidPasswordError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidPasswordError';
	}
}

export class invalidNameError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidNameError';
	}
}

export class invalidCollectionNameError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidCollectionName';
	}
}

function mapUser(record: RecordModel): User {
	let role = record.collectionName;
	switch (role) {
		case 'students':
			role = 'Estudiante';
			break;
		case 'collaborators':
			role = 'Colaborador';
			break;
		case 'supervisors':
			role = 'Administrador';
			break;
		default:
			role = 'Usuario';
			break;
	}

	return {
		id: record.id,
		name: record.name,
		username: record.username,
		email: record.email,
		collectionName: record.collectionName,
		collectionId: record.collectionId,
		emailVisibility: record.emailVisibility,
		role: role
	};
}

function newPocketBase() {
	const pb = new PocketBase(pocketbaseURL);

	async function resetPassword(email: string, role: string): Promise<User | null> {
		try {
			await pb.collection(role).requestPasswordReset(email);
			return null;
		} catch (error) {
			if (error instanceof ClientResponseError) {
				console.error('No encontrado', error);
			}
			return null;
		}
	}

	async function createUser(collection: string, data: User): Promise<User | null> {
		try {
			return await pb.collection(collection).create(data);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				if (error.data.data.email) {
					throw new invalidEmailError(error.data.data.email);
				} else if (error.data.data.username) {
					throw new invalidUsernameError(error.data.data.username);
				} else if (error.data.data.password) {
					throw new invalidPasswordError(error.data.data.password);
				} else {
					console.log(error.data.data);
				}
			}
			return null;
		}
	}

	async function getAll(collection: string): Promise<User[] | null> {
		try {
			const records = await pb.collection(collection).getFullList({
				sort: 'name'
			});
			return records.map(mapUser);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				console.error('No encontrado', error);
			}
			return null;
		}
	}

	async function getByField(
		field: string,
		value: string,
		collection: string
	): Promise<User | null> {
		try {
			const record = await pb.collection(collection).getFirstListItem(`${field}='${value}'`);
			return mapUser(record);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				throw new userNotFoundError(`No se encontró el usuario con ${field} = ${value}`);
			}
			return null;
		}
	}

	async function deleteUser(user: User) {
		try {
			await pb.collection(user.collectionName!).delete(user.id!);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				console.log(error.data.data);
			}
		}
	}

	async function deleteByField(field: string, value: string, collection: string) {
		const user = await getByField(field, value, collection);
		if (user) {
			deleteUser(user);
		}
	}

	return {
		get instance() {
			return pb;
		},
		login(username: string, password: string, role: string = 'users') {
			try {
				return pb.collection(role).authWithPassword(username, password);
			} catch (error) {
				console.error('Error authenticating with password:', error);
				throw error; // Rethrow the error to be handled by the caller
			}
		},
		authStoreIsValid() {
			return pb.authStore.isValid;
		},
		logout() {
			pb.authStore.clear();
		},
		authStoreToken() {
			return pb.authStore.token;
		},
		authStoreModel() {
			return pb.authStore.model;
		},
		isLoggedIn() {
			return this.authStoreIsValid();
		},
		get loggedUser() {
			return this.authStoreModel();
		},
		isRole(role: string) {
			const authStoreModel = this.authStoreModel();
			return authStoreModel && authStoreModel.collectionName === role;
		},
		resetPassword(email: string, role: string) {
			return resetPassword(email, role);
		},
		async createUser(collection: string, data: User): Promise<User | null> {
			return await createUser(collection, data);
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
			if (!name || !username || !email || !password) {
				console.error('Missing required fields');
				return null;
			}
			if (passwordConfirm.length === 0) {
				passwordConfirm = password;
			}
			if (password !== passwordConfirm) {
				console.error('Passwords do not match');
				return null;
			}
			const data = {
				name,
				username,
				email,
				emailVisibility,
				passwordConfirm,
				password
			};
			return await createUser(collection, data);
		},
		getAll(collection: string) {
			return getAll(collection);
		},
		getByField(field: string, value: string, collection: string) {
			return getByField(field, value, collection);
		},
		getByName(name: string, collection: string) {
			return getByField('name', name, collection);
		},
		deleteByField(field: string, value: string, collection: string) {
			return deleteByField(field, value, collection);
		},
		deleteByName(name: string, collection: string) {
			return deleteByField('name', name, collection);
		},
		deleteUser(user: User) {
			return deleteUser(user);
		},
		addUsersFromFile(data: FormData) {
			return pb.collection('files').update('lastUploadedCSV', data);
		},
		async getFirstListItem(collection: string, filter: string, options?: RecordListOptions) {
			try {
				const record = await pb.collection(collection).getFirstListItem(filter, options);
				return mapUser(record);
			} catch (error) {
				if (error instanceof ClientResponseError) {
					throw new userNotFoundError(`No se encontró el usuario.`);
				}
				return null;
			}
		}
	};
}

export const pb = newPocketBase();
