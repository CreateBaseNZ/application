/* ==========================================================
VARIABLES
========================================================== */
let home = {
  inititalise: undefined
}

let signup = {
  collect: undefined,
  loadEventListeners: undefined,
  passwordStrength: undefined,
  scorePassword: undefined,
  submit: undefined,
  validate: undefined,

  container: document.querySelector('.sign-up-container')
}

let login = {
  collect: undefined,
  loadEventListeners: undefined,
  submit: undefined,
  validate: undefined,

  container: document.querySelector('.login-container'),
  rememberMe: document.querySelector('#remember-checkbox'),
  rememberText: document.querySelector('#remember-text')
}

let forgotPassword = {
  initiate: undefined,
  loadEventListeners: undefined,

  container: document.querySelector('.recover-container')
}

// Testing - check correct
let recoverPassword = {
  loadEventListeners: undefined,

  container: document.querySelector('.code-container')
}

/* ==========================================================
FUNCTIONS
========================================================== */

home.initialise = () => {
  signup.loadEventListeners()
  login.loadEventListeners()
  forgotPassword.loadEventListeners()
  // Testing
  recoverPassword.loadEventListeners()
}

/* ----------------------------------------------------------
SIGNUP
---------------------------------------------------------- */

signup.loadEventListeners = () => {
  // Sign up -> login
  document.querySelector('#login').addEventListener('click', function (e) {
    // ******Testing animations - optimise later*******
    // Hide sign up
    signup.container.classList.add('slide-left');
    signup.container.classList.add('no-interaction');
    // Remove div previous interactions
    login.container.classList.remove('slide-right');
    login.container.classList.remove('inactive');
    // Show next screen
    login.container.classList.add('enter-screen-right');
    login.container.classList.add('no-interaction');
    setTimeout(function () {
      // Remove altering classes
      login.container.classList.remove('no-interaction');
      login.container.classList.remove('enter-screen-right')
      // After animation reset classes and hide
      signup.container.classList.add('inactive')
      signup.container.classList.remove('slide-left');
    }, 900);
  });

  // Password Visibility toggle
  document.querySelector('#togglePassword').addEventListener('click', function (e) {
    const password = document.querySelector('#password');
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye icon
    this.firstChild.classList.toggle('icon-selected');
  });

  document.querySelector('#togglePasswordConfirm').addEventListener('click', function (e) {
    const passwordConfirm = document.querySelector('#confirmPass');
    // toggle the type attribute
    const type = passwordConfirm.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordConfirm.setAttribute('type', type);
    // toggle the eye icon
    this.firstChild.classList.toggle('icon-selected');
  });

  // Enter key
  document.querySelector('#sign-up-form').querySelectorAll('input').forEach((input) => {
    global.events.enterKeyPress(input, signup.submit)
  })
}


// @type  TANDARD
// @desc  This function collects all the inputs from the signup form
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
    error.confirmPassword = "Password do not match";
  }
  // Add/remove error messages
  document.querySelector("#sign-up-email-error").setAttribute("data-error-msg", error.email);
  document.querySelector("#sign-up-name-error").setAttribute("data-error-msg", error.name);
  document.querySelector("#sign-up-password-error").setAttribute("data-error-msg", error.password);
  document.querySelector("#sign-up-confirm-password-error").setAttribute("data-error-msg", error.confirmPassword);
  // Return validity
  return valid;
}

// @type    ASYNC
// @desc    
signup.submit = async () => {
  // Disable "Signup" Button
  document.querySelector("#signUp").setAttribute("disabled", "");
  // Collect Input
  const object = signup.collect();
  // Validate Inputs: Client-side
  if (!signup.validate(object)) return document.querySelector("#signUp").removeAttribute("disabled");
  // Validate Inputs: Backend-side
  let data;
  try {
    data = (await axios.post("/signup/validate", object))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // Error handling
    console.log(data.content);
    // Enable "Signup" Button
    document.querySelector("#signUp").removeAttribute("disabled");
    // Abort
    return;
  } else if (data.status === "failed") {
    // Display Failure Messages (if any)
    const error = data.content;
    document.querySelector("#sign-up-email-error").setAttribute("data-error-msg", error.email);
    document.querySelector("#sign-up-name-error").setAttribute("data-error-msg", error.name);
    document.querySelector("#sign-up-password-error").setAttribute("data-error-msg", error.password);
    // Enable "Signup" Button
    document.querySelector("#signUp").removeAttribute("disabled");
    // Abort
    return;
  }
  // Submit the Signup Form
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

// @type    STANDARD
// @desc    
signup.passwordStrength = (password) => {

}

/* ----------------------------------------------------------
LOGIN
---------------------------------------------------------- */

login.loadEventListeners = () => {
  //  Login back to signup
  document.querySelector('#login-back-btn').addEventListener('click', function (e) {
    // Testing animations - optimise later
    login.container.classList.add('slide-right');
    login.container.classList.add('no-interaction');

    signup.container.classList.add('enter-screen-left');
    signup.container.classList.remove('inactive');
    signup.container.classList.add('no-interaction');

    setTimeout(function () {
      signup.container.classList.remove('no-interaction');
      login.container.classList.add('inactive')
      signup.container.classList.remove('enter-screen-left');
      login.container.classList.remove('slide-right')
    }, 900);
  })

  // Login -> recover
  document.querySelector('.forgot-password-container').addEventListener('click', function (e) {
    // Testing animations - optimise later
    login.container.classList.add('slide-left');
    login.container.classList.add('no-interaction');

    forgotPassword.container.classList.remove('slide-right');
    forgotPassword.container.classList.remove('inactive');

    forgotPassword.container.classList.add('enter-screen-right');
    forgotPassword.container.classList.add('no-interaction');

    setTimeout(function () {
      forgotPassword.container.classList.remove('no-interaction');
      forgotPassword.container.classList.remove('enter-screen-right');

      login.container.classList.add('inactive');
      login.container.classList.remove('slide-left');
    }, 900);
  });

  document.querySelector('#toggleLoginPassword').addEventListener('click', function (e) {
    const passwordLogin = document.querySelector('#login-password');
    // toggle the type attribute
    const type = passwordLogin.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordLogin.setAttribute('type', type);
    // toggle the eye icon
    this.firstChild.classList.toggle('icon-selected');
  });


  // Remember me checkbox
  login.rememberMe.addEventListener('click', function (e) {
    console.log('hello is this working')
    login.rememberText.classList.toggle('nonactive-p');
  });
  login.rememberText.addEventListener('click', function (e) {
    login.rememberText.classList.toggle('nonactive-p');
    login.rememberMe.checked = !login.rememberMe.checked;
  });

  // Enter key
  document.querySelector('#login-form').querySelectorAll('input').forEach((input) => {
    global.events.enterKeyPress(input, login.submit)
  })
}

// @type    STANDARD
// @desc
login.collect = () => {
  const email = document.querySelector("#loginemail").value;
  const password = document.querySelector("#login-password").value;
  const remember = document.querySelector("#remember-checkbox").checked;
  return { email, password, remember };
}

// @type    STANDARD
// @desc
login.validate = async (object = {}) => {
  // Declare variables
  let valid = true;
  let error = { email: "", password: "" }
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // Validate inputs
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
  }
  // Add/remove error messages
  document.querySelector("#login-email-error").setAttribute("data-error-msg", error.email);
  document.querySelector("#login-password-error").setAttribute("data-error-msg", error.password);
  // Return validity
  return valid;
}

// @type    ASNYC
// @desc
login.submit = async () => {
  document.querySelector("#login").setAttribute("disabled", "");
  // Collect inputs
  const object = login.collect();
  // Client-side validation
  if (!login.validate(object)) return document.querySelector("#login").removeAttribute("disabled");
  // Server-side validation
  let data;
  try {
    data = (await axios.post("/login/validate", object))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    console.log(data.content);
    return document.querySelector("#login").removeAttribute("disabled");
  } else if (data.status === "failed") {
    const error = data.content;
    document.querySelector("#login-email-error").setAttribute("data-error-msg", error.email);
    document.querySelector("#login-password-error").setAttribute("data-error-msg", error.password);
    return document.querySelector("#login").removeAttribute("disabled");
  }
  // Success handler
  return document.querySelector("#login-form").submit();
}

/* ----------------------------------------------------------
FORGOT PASSWORD
---------------------------------------------------------- */

forgotPassword.loadEventListeners = () => {
  //  Forgot password back to login
  document.querySelector('#recover-back-btn').addEventListener('click', function (e) {
    // Testing animations - optimise later
    forgotPassword.container.classList.add('slide-right');
    forgotPassword.container.classList.add('no-interaction');

    login.container.classList.add('enter-screen-left');
    login.container.classList.remove('inactive');
    login.container.classList.add('no-interaction');

    setTimeout(function () {
      login.container.classList.remove('no-interaction');
      forgotPassword.container.classList.add('inactive');
      login.container.classList.remove('enter-screen-left');
      forgotPassword.container.classList.remove('slide-right');
    }, 900)
  })

  // Enter key
  // global.events.enterKeyPress(document.querySelector('#recover-email'), forgotPassword.initiate)
}

// forgotPassword.initiate = async () => {
//   const email = document.querySelector("#recover-email").value;
//   let error = "";
//   let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   // Validate inputs
//   if (!email) {
//     valid = false;
//     error = "Email required";
//   } else if (!emailRE.test(String(email).toLowerCase())) {
//     valid = false;
//     error = "Invalid email";
//   }
//   // Send request for password change
//   let data;
//   try {
//     data = (await axios.post("/change-password/request", { email }))["data"];
//   } catch (error) {
//     data = { status: "error", content: error };
//   }
//   if (data.status === "failed") {
//     error = data.content;
//   } else if (data.status === "error") {
//     console.log(data.content);
//   }
//   // Update the error field
//   document.querySelector("#change-password-email-error").setAttribute("data-error-msg", error);
//   // Success handler
//   return;
// }

/* ----------------------------------------------------------
RECOVER PASSWORD
---------------------------------------------------------- */

recoverPassword.loadEventListeners = () => {
    //  Recover password back to Forgot password
    document.querySelector('#code-back-btn').addEventListener('click', function (e) {
      // Testing animations - optimise later
      recoverPassword.container.classList.add('slide-right');
      recoverPassword.container.classList.add('no-interaction');
  
      forgotPassword.container.classList.add('enter-screen-left');
      forgotPassword.container.classList.remove('inactive');
      forgotPassword.container.classList.add('no-interaction');
  
      setTimeout(function () {
        forgotPassword.container.classList.remove('no-interaction');
        recoverPassword.container.classList.add('inactive');
        forgotPassword.container.classList.remove('enter-screen-left');
        recoverPassword.container.classList.remove('slide-right');
      }, 900)
    })
  // Recover -> code input
  document.querySelector('#recover-pass-btn').addEventListener('click', function (e) {
    // Testing animations - optimise later
    forgotPassword.container.classList.add('slide-left');
    forgotPassword.container.classList.add('no-interaction');

    recoverPassword.container.classList.remove('slide-right');
    recoverPassword.container.classList.remove('inactive');

    recoverPassword.container.classList.add('enter-screen-right');
    recoverPassword.container.classList.add('no-interaction');

    setTimeout(function () {
      recoverPassword.container.classList.remove('no-interaction');
      recoverPassword.container.classList.remove('enter-screen-right');

      forgotPassword.container.classList.add('inactive');
      forgotPassword.container.classList.remove('slide-left');
      document.querySelector('#first').focus();
    }, 900);

  });
}

  // Login -> recover
  // document.querySelector('.forgot-password-container').addEventListener('click', function (e) {
  //   // Testing animations - optimise later
  //   login.container.classList.add('slide-left');
  //   login.container.classList.add('no-interaction');

  //   forgotPassword.container.classList.remove('slide-right');
  //   forgotPassword.container.classList.remove('inactive');

  //   forgotPassword.container.classList.add('enter-screen-right');
  //   forgotPassword.container.classList.add('no-interaction');

  //   setTimeout(function () {
  //     forgotPassword.container.classList.remove('no-interaction');
  //     forgotPassword.container.classList.remove('enter-screen-right');

  //     login.container.classList.add('inactive');
  //     login.container.classList.remove('slide-left');
  //   }, 900);
  // });