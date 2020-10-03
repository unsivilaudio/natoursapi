import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
    try {
        const res = await axios.post('/api/v1/users/login', {
            email,
            password,
        });

        if (res.data.status === 'success') {
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
        showAlert('success', 'Sucessfully logged in!');
    } catch (err) {
        const { message } = err.response.data;
        showAlert('error', message);
    }
};

export const logout = async () => {
    try {
        const res = await axios.get('/api/v1/users/logout');
        if (res.data.status === 'success') {
            showAlert('success', 'Successfully logged out!');
            window.setTimeout(() => {
                location.reload(true);
            }, 1500);
        }
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
    }
};
