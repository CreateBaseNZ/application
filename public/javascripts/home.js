const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye icon
    this.firstChild.classList.toggle('icon-selected');
});

const togglePasswordConfirm = document.querySelector('#togglePasswordConfirm');
const passwordConfirm = document.querySelector('#confirmPass');

togglePasswordConfirm.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = passwordConfirm.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordConfirm.setAttribute('type', type);
    // toggle the eye icon
    this.firstChild.classList.toggle('icon-selected');
});

const login = document.querySelector('#login');
const signUp = document.querySelector('#signUp');

login.addEventListener('click', function (e) {
    document.querySelector('.sign-up-container').classList.add('slide-left');
    document.querySelector('nav').classList.add('slide-left');
});

const rememberMe = document.querySelector('#remember-checkbox');
const rememberText = document.querySelector('#remember-text');

rememberMe.addEventListener('click', function (e) {
    rememberText.classList.toggle('nonactive-p');
    console.log('yea man')
});