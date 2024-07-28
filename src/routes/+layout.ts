export const prerender = true;

import { pb } from '$lib/pb/pocketbase.svelte';

export const load = async ({ params }) => {
    try {
        if (pb.isLoggedIn())
            return {
                user: pb.loggedUser
            }
    }
    catch (error) {
        return {
            user: null
        }
    }
}