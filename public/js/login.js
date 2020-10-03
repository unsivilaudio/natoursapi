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
