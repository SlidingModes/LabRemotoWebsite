export const prerender = true;
export const ssr = false;

import { pb } from '$lib/pb/pocketbase.svelte';

export const load = async ({ params }) => {
    try {
        if (pb.isLoggedIn())
            return {
                user: pb.loggedUser
            }
        else {
            return {
                user: null
            }
        }
    }
    catch (error) {
        return {
            user: null
        }
    }
}