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
        showAlert(
            'success',
            `Welcome back ${res.data.data.user.name.split(' ')[0]}!`
        );
    } catch (err) {
        const { message } = err.response.data;
        showAlert('error', message);
    }
};

export const signup = async newUser => {
    try {
        const res = await axios.post('/api/v1/users/signup', { ...newUser });

        if (res.data.status === 'success') {
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }

        showAlert(
            'success',
            `Welcome to Natours ${newUser.name.split(' ')[0]}!`
        );
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
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
    }
};
