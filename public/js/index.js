import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const button = document.querySelector('.btn--save-password');
        button.textContent = 'Updating...';

        const password = document.getElementById('password-current');
        const updatePassword = document.getElementById('password');
        const updatePasswordConfirm = document.getElementById(
            'password-confirm'
        );
        await updateSettings(
            {
                password: password.value,
                updatePassword: updatePassword.value,
                updatePasswordConfirm: updatePasswordConfirm.value,
            },
            'password'
        );
        button.textContent = 'Save Password';
        password.value = '';
        updatePassword.value = '';
        updatePasswordConfirm.value = '';
    });
}
