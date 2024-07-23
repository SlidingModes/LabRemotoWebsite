import PocketBase from 'pocketbase';
import { pocketbaseURL } from '$lib/config';

function newPocketBase() {
    const pb = new PocketBase(pocketbaseURL);

    return {
        login(username: string, password: string) {
            try {
                return pb.collection('users').authWithPassword(username, password);
            } catch (error) {
                // Handle the error here
                console.log('Aqui')
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
        }

    };
}

export const pb = newPocketBase();