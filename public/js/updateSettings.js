import axios from 'axios';
import { showAlert } from './alert';

const instance = axios.create({
    baseURL: '/api/v1/users',
});

export const updateSettings = async (data, type) => {
    const URL = type === 'password' ? '/updatepassword' : '/updateme';
    try {
        await instance.patch(URL, data);
        // window.setTimeout(() => window.location.reload(true), 1500);
        showAlert('success', 'Successfully updated user profile.');
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
