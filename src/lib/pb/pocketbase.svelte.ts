import PocketBase, { type AuthModel, type RecordModel } from 'pocketbase';
import { pocketbaseURL } from '$lib/config';
import { ClientResponseError, } from 'pocketbase';


export type User = {
    id?: string;
    name: string;
    username: string;
    email: string;
    collectionName?: string;
    collectionId?: string;
    emailVisibility?: boolean,
    role?: string;
};

function mapUser(record: RecordModel): User {

    let role = record.collectionName;
    switch (role) {
        case 'students':
            role = 'Estudiante';
            break;
        case 'teachers':
            role = 'Profesor';
            break;
        case 'admins':
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
            const record = await pb.collection(role).requestPasswordReset(email);
            console.log('Password reset', record);
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
                console.log(error.data.data);
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

    async function getByField(field: string, value: string, collection: string): Promise<User | null> {
        try {
            const record = await pb.collection(collection).getFirstListItem(`${field}='${value}'`);
            return mapUser(record);
        } catch (error) {
            if (error instanceof ClientResponseError) {
                console.error('No encontrado', error);
            }
            return null;
        }
    }

    async function deleteUser(user: User) {
        try {
            const record = await pb.collection('students').delete(user.id!);
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
        createUser(collection: string, data: User) {
            return createUser(collection, data);
        },
        createUserFromFields(
            name: string,
            username: string,
            email: string,
            password: string,
            collection: string,
            passwordConfirm: string = '',
            emailVisibility: boolean = true) {

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
            return createUser(collection, data);
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
        }

    };
}

export const pb = newPocketBase();


export function createUser(initial: AuthModel) {
    let user = $state(initial!);
    return {
        ...initial,
        get username() {
            return user.username;
        },
        get email() {
            return user.email;
        },
        get role() {
            return user.collectionName;
        }
    }
}