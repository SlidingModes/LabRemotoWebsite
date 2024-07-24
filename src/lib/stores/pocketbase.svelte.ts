import PocketBase, { type AuthModel } from 'pocketbase';
import { pocketbaseURL } from '$lib/config';
import { get } from 'svelte/store';

function newPocketBase() {

    const pb = new PocketBase(pocketbaseURL);

    return {
        get pb() {
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
        getUser() {
            return this.authStoreModel();
        },
        isRole(role: string) {
            const authStoreModel = this.authStoreModel();
            return authStoreModel && authStoreModel.collectionName === role;
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