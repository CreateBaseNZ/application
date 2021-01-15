/* ==========================================================
VARIABLES
========================================================== */

let signup = {
    collect: undefined,
    validate: undefined,
    submit: undefined,
    scorePassword: undefined
}

/* ==========================================================
FUNCTIONS
========================================================== */

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

const togglePasswordLogin = document.querySelector('#toggleLoginPassword');
const passwordLogin = document.querySelector('#login-password');

togglePasswordLogin.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = passwordLogin.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordLogin.setAttribute('type', type);
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

    setTimeout(function () {
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

    setTimeout(function () {
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

    setTimeout(function () {
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

/* ----------------------------------------------------------
REGISTRATION
---------------------------------------------------------- */

// @type    STANDARD
// @desc
signup.collect = () => {
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPass").value;
    return { name, email, password, confirmPassword };
}

// @type    STANDARD
// @desc    Front-end validation of the signup form input
signup.validate = (object = {}) => {
    // Declare variables
    let valid = true;
    let error = { email: "", name: "", password: "", confirmPassword: "" }
    let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let nameRE = /^[A-Za-z0-9_-\s]+$/;
    // Validate inputs
    if (!object.name) {
        valid = false;
        error.name = "Name required";
    } else if (!nameRE.test(String(object.name).toLowerCase())) {
        valid = false;
        error.name = "Only letters, numbers, spaces, and underscores allowed";
    }
    if (!object.email) {
        valid = false;
        error.email = "Email required";
    } else if (!emailRE.test(String(object.email).toLowerCase())) {
        valid = false;
        error.email = "Invalid email";
    }
    if (!object.password) {
        valid = false;
        error.password = "Password required";
    } else if (signup.scorePassword(object.password) <= 40) {
        valid = false;
        error.password = "Password is too weak";
    } else if (object.password.includes(" ") || object.password.includes("'") || object.password.includes('"')) {
        valid = false;
        error.password = "Password cannot contain quotation marks or spaces";
    }
    if (!object.confirmPassword) {
        valid = false;
        error.confirmPassword = "Please confirm your password";
    } else if (object.confirmPassword !== object.password) {
        valid = false;
        error.confirmPassword = "Please do not match";
    }
    // Return validity
    console.log(error);
    return valid;
}

// @type    ASYNC
// @desc    
signup.submit = async () => {
    document.querySelector("#signUp").setAttribute("disabled", "");
    // Collect inputs
    const object = signup.collect();
    // Client-side validation
    if (!signup.validate(object)) return document.querySelector("#signUp").removeAttribute("disabled");
    // Server-side validation
    let data;
    try {
        data = (await axios.post("/signup/validate", object))["data"];
    } catch (error) {
        data = { status: "error", content: error };
    }
    if (data.status === "error") {
        console.log(data.content);
        return document.querySelector("#signUp").removeAttribute("disabled");
    } else if (data.status === "failed") {
        console.log(data.content);
        return document.querySelector("#signUp").removeAttribute("disabled");
    }
    // Success handler
    return document.querySelector("#sign-up-form").submit();
}

// @type    STANDARD
// @desc    
signup.scorePassword = (password) => {
    let score = 0;
    // Award every unique letter until 5 repititions
    let letters = new Object();
    for (let i = 0; i < password.length; i++) {
        letters[password[i]] = (letters[password[i]] || 0) + 1;
        score += 5.0 / letters[password[i]];
    }
    // Bonus points for mixing it up
    let variations = {
        digits: /\d/.test(password),
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        nonWords: /\W/.test(password)
    }
    variationCount = 0;
    for (let check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;
    // Return the total score
    return score;
}