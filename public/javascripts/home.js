// Password Visibility toggle
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

// Remember me checkbox
const rememberMe = document.querySelector('#remember-checkbox');
const rememberText = document.querySelector('#remember-text');

rememberMe.addEventListener('click', function (e) {
    rememberText.classList.toggle('nonactive-p');
});

rememberText.addEventListener('click', function (e) {
    rememberMe.checked = !rememberMe.checked;
});

// Switch between user input forms ===============================
const loginBtn = document.querySelector('#login');
const signUp = document.querySelector('#signUp');

const signUpDiv = document.querySelector('.sign-up-container');
const loginDiv = document.querySelector('.login-container');
const recoverPassDiv = document.querySelector('.recover-container');

// Sign up -> login
loginBtn.addEventListener('click', function (e) {
    // ******Testing animations - optimise later*******

    // Hide sign up
    signUpDiv.classList.add('slide-left');
    signUpDiv.classList.add('no-interaction');

    // Remove div previous interactions
    loginDiv.classList.remove('slide-right');
    loginDiv.classList.remove('inactive');

    // Show next screen
    loginDiv.classList.add('enter-screen-right');
    loginDiv.classList.add('no-interaction');

    setTimeout(function() {
        // Remove altering classes
        loginDiv.classList.remove('no-interaction');
        loginDiv.classList.remove('enter-screen-right')

        // After animation reset classes and hide
        signUpDiv.classList.add('inactive')
        signUpDiv.classList.remove('slide-left');
    }, 900);
});
//  Sign up back
const loginBackBtn = document.querySelector('#login-back-btn');
loginBackBtn.addEventListener('click', function (e) {
    // Testing animations - optimise later
    loginDiv.classList.add('slide-right');
    loginDiv.classList.add('no-interaction');

    signUpDiv.classList.add('enter-screen-left');
    signUpDiv.classList.remove('inactive');
    signUpDiv.classList.add('no-interaction');
    
    setTimeout(function() {
        signUpDiv.classList.remove('no-interaction');
        loginDiv.classList.add('inactive')
        signUpDiv.classList.remove('enter-screen-left');
        loginDiv.classList.remove('slide-right')
    }, 900);
})


// Login -> recover
const forgotPasswordBtn = document.querySelector('.forgot-password-container');

forgotPasswordBtn.addEventListener('click', function (e) {
    // Testing animations - optimise later
    loginDiv.classList.add('slide-left');
    loginDiv.classList.add('no-interaction');

    recoverPassDiv.classList.remove('slide-right');
    recoverPassDiv.classList.remove('inactive');

    recoverPassDiv.classList.add('enter-screen-right');
    recoverPassDiv.classList.add('no-interaction');
    
    setTimeout(function() {
        recoverPassDiv.classList.remove('no-interaction');
        recoverPassDiv.classList.remove('enter-screen-right');    

        loginDiv.classList.add('inactive');
        loginDiv.classList.remove('slide-left');
    }, 900);
});
//  Login back
const recoverBackBtn = document.querySelector('#recover-back-btn');
recoverBackBtn.addEventListener('click', function (e) {
    // Testing animations - optimise later
    recoverPassDiv.classList.add('slide-right');
    recoverPassDiv.classList.add('no-interaction');

    loginDiv.classList.add('enter-screen-left');
    loginDiv.classList.remove('inactive');
    loginDiv.classList.add('no-interaction');

    setTimeout(function () {
        loginDiv.classList.remove('no-interaction');
        recoverPassDiv.classList.add('inactive');
        loginDiv.classList.remove('enter-screen-left');
        recoverPassDiv.classList.remove('slide-right');
    }, 900)
})



