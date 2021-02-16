// ==========================================================
// VARIABLES
// ==========================================================

// const e = require("express");

// function initPlaces() {
//   new google.maps.places.Autocomplete(settings.elem.streetInput, settings.places.options); 
// }

let settings = {

  init: {
    attachAllListeners: undefined,
    cacheInit: undefined,
    init: undefined,
    loadBadges: undefined,
    placesInit: undefined,
    populate: undefined,
    sessionStorageCheck: undefined,
    sortableJSInit: undefined
  },

  event: {
    avatarPreview: undefined,
    accountInputsCheck: undefined,
    badgeConfigToggle: undefined,
    emailPassInputCheck: undefined,
    emailPassInputEnter: undefined,
    emailInputCheck: undefined,
    emailInputEnter: undefined,
    escapeKeyPress: undefined,
    notificationsInputsCheck: undefined,
    passVisToggle: undefined,
    passwordInputsCheck: undefined,
    passwordInputsEnter: undefined,
    profileInputsCheck: undefined,
    sectionClick: undefined,
    verificationInputsCheck: undefined,
    verificationInputsEnter: undefined
  },

  accountCancel: undefined,
  badgeScreenCancel: undefined,
  badgeScreenShow: undefined,
  cacheUpdate: undefined,
  editModeExit: undefined,
  emailScreenShow: undefined,
  emailScreenCancel: undefined,
  notificationsCancel: undefined,
  passwordScreenShow: undefined,
  passwordScreenCancel: undefined,
  profileCancel: undefined,
  screenClose: undefined,
  screenShow: undefined,

  backend: {
    fetch: undefined,
    accountSave: undefined,
    badgesSave: undefined,
    emailContinue: undefined,
    emailSave: undefined,
    notificationsSave: undefined,
    passwordContinue: undefined,
    passwordSave: undefined,
    profileSave: undefined
  },
  
  var: {
    // temp
    badges: ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'], 
    cache: {}
  },
  
  elem: {
    accountCancelBtn: document.querySelector('.account-cancel'),
    accountSaveBtn: document.querySelector('.account-save'),
    accountSection: document.querySelector('.account-section'),
    avatarInput: document.querySelector('#avatar-input'),
    avatarPreview: document.querySelector('.avatar-preview'),
    badgeAchievedSection: document.querySelector('.badge-achieved-section'),
    badgeNotAchievedSection: document.querySelector('.badge-not-achieved-section'),
    badgeScreen: document.querySelector('.badge-edit-screen'),
    badgePreviewContainer: document.querySelector('.badges-container'),
    displayNameInput: document.querySelector('#prof-name'),
    displayEmailInput: document.querySelector('#prof-email'),
    cityInput: document.querySelector('#acc-city'),
    countryInput: document.querySelector('#acc-country'),
    emailInput: document.querySelector('#acc-email'),
    emailScreen: document.querySelector('.email-edit-screen'),
    emailStatic: document.querySelector('.email-static'),
    emailPasswordInput: document.querySelector('#email-pass'),
    locationInput: document.querySelector('#prof-loc'),
    mailingInput: document.querySelector('#mail'),
    nameInput: document.querySelector('#acc-name'),
    notificationsCancelBtn: document.querySelector('.notifications-cancel'),
    notificationsSaveBtn: document.querySelector('.notifications-save'),
    notificationsSection: document.querySelector('.notifications-section'),
    passwordConfirmInput: document.querySelector('#pass-conf'),
    passwordInput: document.querySelector('#pass-new'),
    passwordScreen: document.querySelector('.pass-edit-screen'),
    profileCancelBtn: document.querySelector('.profile-cancel'),
    profileSaveBtn: document.querySelector('.profile-save'),
    profileSection: document.querySelector('.profile-section'),
    stateInput: document.querySelector('#acc-state'),
    streetInput: document.querySelector('#acc-street'),
    unitInput: document.querySelector('#acc-unit'),
    zipInput: document.querySelector('#acc-zip')
  },

  places: {
    center: {},
    options: {}
  }
}

// ==========================================================
// INIT FUNCTIONS
// ==========================================================

/**
 * Gets called on DOM load and initialises the Settings page. User data is fetched from backend to populate the page with relevant markup. Event listeners are attached and user data is cached. Session storage is checked for any references from the previous page.
 * 
 * | **Invokes**
 * | :func:`settings.backend.fetch` :func:`settings.init.loadBadges` :func:`settings.init.populate` :func:`settings.init.attachAllListeners` :func:`settings.init.sortableJSInit` :func:`settings.init.cacheInit` :func:`settings.init.sessionStorageCheck`
 */
settings.init.init = async () => {
  // Global Initialisation
  global.init.init();
  // Fetch data
  const data = await settings.backend.fetch();
  // Validate incoming data
  if (data.status === "error") {
    console.log(data.content);
  } else if (data.status === "failed") {
    console.log(data.content);
  }
  // Load badges
  settings.init.loadBadges();
  // Populate fields
  settings.init.populate(data.content.account, data.content.user, data.content.notification);
  // Add event listeners
  settings.init.attachAllListeners();
  // Initialise SortableJS
  settings.init.sortableJSInit();
  // Cache data
  settings.init.cacheInit(data.content);
  // Check if coming from another page
  settings.init.sessionStorageCheck();
  // When initialisation is complete "unhide" the body element
  document.querySelector("body").classList.remove("hide");
}

/**
 * Creates the badge elements in preview (Profile container) and on the badge configuration menu. Badges in preview are created in the order of the user-set configuration. Badges on the configuration menu are separated by achievement into the relevant containers. The badges that have been achieved are again sorted by the previous set configuration. Event listeners for the badges are also attached here.
 * 
 * | **Invokes**
 * | :func:`settings.event.badgeConfigToggle`
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.loadBadges = () => {

  for (var i = 0; i < 4; i++) {
    badge = settings.var.badges[i]
    var el = document.createElement('div');
    el.className = 'badge ' + badge;
    el.setAttribute('caption', badge);
    var img = document.createElement('img');
    img.src = '/public/images/badges/' + badge + '.png';
    el.appendChild(img);
    settings.elem.badgePreviewContainer.appendChild(el);
  }

  settings.var.badges.forEach((badge, ind) => {
    // TODO: load config badges
    var el = document.createElement('div');
    el.className = 'config-badge ' + badge;
    el.dataset.name = badge.charAt(0).toUpperCase() + badge.slice(1);
    if (ind < 4) {
      document.querySelector('.' + badge + '-details').classList.add('badge-achieved')
    } else {
      el.classList.add('badge-not-achieved')
    }
    var label = document.createElement('label');
    var input = document.createElement('input');
    input.type = 'radio';
    input.id = 'config-' + badge;
    input.name = 'badge-config';
    var img = document.createElement('img');
    img.src = '/public/images/badges/' + badge + '.png';
    label.appendChild(input)
    label.appendChild(img)
    el.appendChild(label)
    var i = document.createElement('i');
    i.className = "material-icons-round"
    i.innerHTML = 'drag_indicator'
    el.appendChild(i)

    // temp
    ind < 4 ? settings.elem.badgeAchievedSection.appendChild(el) : settings.elem.badgeNotAchievedSection.appendChild(el)

    // TODO: add to achieved section

    // TODO: add to not achieved section

    // badgeName is used in the badgeConfigToggle function
    input.badgeName = badge;
    input.addEventListener('change', settings.event.badgeConfigToggle);
  })
}

/**
 * Initialises the SortableJS for drag and drop functionality on the badge configuration menu.
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.sortableJSInit = () => {
  // Drag and drop menu using SortableJS library
  new Sortable(settings.elem.badgeAchievedSection, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true,
    onStart: () => {
      document.documentElement.classList.add("draggable-cursor");
    },
    onEnd: () => {
      document.documentElement.classList.remove("draggable-cursor");
    }
  })
}


/**
 * Attaches event listeners to all DOM objects.
 * 
 * | **Invokes**
 * | :func:`settings.event.sectionClick` :func:`settings.badgeScreenShow` :func:`settings.emailScreenShow` :func:`settings.event.passwordScreenShow` :func:`settings.event.profileInputsCheck` :func:`settings.event.accountInputsCheck` :func:`settings.event.notificationsInputsCheck` :func:`settings.event.emailPassInputCheck` :func:`settings.event.emailInputCheck` :func:`settings.event.verificationInputsCheck` :func:`settings.event.passwordInputsCheck` :func:`settings.backend.profileSave` :func:`settings.backend.accountSave` :func:`settings.backend.notificationsSave` :func:`settings.event.badgesSave` :func:`settings.emailContinue` :func:`settings.profileCancel` :func:`settings.accountCancel` :func:`settings.notificationsCancel` :func:`settings.badgeScreenCancel` :func:`settings.emailScreenCancel` :func:`settings.passwordScreenCancel` :func:`settings.event.escapeKeyPress` :func:`settings.event.avatarPreview` :func:`settings.event.passVisToggle`
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.attachAllListeners = () => {

  // Enabling and exiting edit mode
  document.querySelectorAll('.panel-left').forEach(function (section) {
    section.addEventListener('click', settings.event.sectionClick)
  })

  // Show badge config screen
  settings.elem.badgePreviewContainer.addEventListener('click', settings.badgeScreenShow)
  // Show change email screen
  document.querySelector('.email-container.btn-to-input').querySelector('button').addEventListener('click', settings.emailScreenShow)
  // Show change password screen
  document.querySelector('.pass-container.btn-to-input').querySelector('button').addEventListener('click', settings.passwordScreenShow)

  // Check for changes in Profile inputs 
  settings.elem.profileSection.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.event.profileInputsCheck)
  })
  // Check for changes in Account inputs
  settings.elem.accountSection.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.event.accountInputsCheck)
  })
  // Check for changes in Notification inputs
  settings.elem.notificationsSection.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.event.notificationsInputsCheck)
  })
  // Check for changes in change email step one (password) input
  settings.elem.emailPasswordInput.addEventListener('input', settings.event.emailPassInputCheck)
  // Check for changes in change email step two (new email) input
  settings.elem.emailInput.addEventListener('input', settings.event.emailInputCheck)
  // Check for changes in change password step one (verification) inputs
  document.querySelectorAll('.code-input').forEach((input) => {
    input.addEventListener('keyup', settings.event.verificationInputsCheck)
  })
  // Check for changes in change password step two (new and confirm) inputs
  settings.elem.passwordScreen.querySelector('.step-two').querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.event.passwordInputsCheck)
  })

  // Save Profile settings
  settings.elem.profileSaveBtn.addEventListener('click', settings.backend.profileSave)
  // Save Account settings
  settings.elem.accountSaveBtn.addEventListener('click', settings.backend.accountSave)
  // Save Notifications settings
  settings.elem.notificationsSaveBtn.addEventListener('click', settings.backend.notificationsSave)
  // Save badge configuration
  document.querySelector('.badge-config-done').addEventListener('click', settings.event.badgesSave)
  // Continue email
  settings.elem.emailScreen.querySelector('.continue-btn').addEventListener('click', settings.backend.emailContinue)
  settings.elem.emailPasswordInput.addEventListener('keypress', settings.event.emailPassInputEnter)
  // Save email
  settings.elem.emailScreen.querySelector('.save-btn').addEventListener('click', settings.backend.emailSave)
  settings.elem.emailInput.addEventListener('keypress', settings.event.emailInputEnter)
  // Continue password
  settings.elem.passwordScreen.querySelector('.continue-btn').addEventListener('click', settings.backend.passwordContinue)
  document.querySelectorAll('.code-input').forEach((input) => {
    input.addEventListener('keypress', settings.event.verificationInputsEnter)
  })
  // Save password
  settings.elem.passwordScreen.querySelector('.save-btn').addEventListener('click', settings.backend.passwordSave)
  settings.elem.passwordConfirmInput.addEventListener('keypress', settings.event.passwordInputsEnter)

  // Cancel Profile settings
  settings.elem.profileCancelBtn.addEventListener('click', settings.profileCancel)
  // Cancel Profile settings (mobile)
  settings.elem.profileSection.querySelector('.back-to-main-sections').addEventListener('click', settings.profileCancel)
  // Cancel Account settings
  settings.elem.accountCancelBtn.addEventListener('click', settings.accountCancel)
  // Cancel Account settings (mobile)
  settings.elem.accountSection.querySelector('.back-to-main-sections').addEventListener('click', settings.accountCancel)
  // Cancel Notifications settings
  settings.elem.notificationsCancelBtn.addEventListener('click', settings.notificationsCancel)
  // Cancel Notifications settings (mobile)
  settings.elem.notificationsSection.querySelector('.back-to-main-sections').addEventListener('click', settings.notificationsCancel)
  // Cancel the badge edit screen
  settings.elem.badgeScreen.querySelector('.screen-close').addEventListener('click', settings.badgeScreenCancel)
  // Cancel the email edit screen
  settings.elem.emailScreen.querySelector('.screen-close').addEventListener('click', settings.emailScreenCancel)
  // Cancel the password edit screen
  settings.elem.passwordScreen.querySelector('.screen-close').addEventListener('click', settings.passwordScreenCancel)

  // Escape key exits all screens
  document.addEventListener('keydown', settings.event.escapeKeyPress)

  // Previews new avatar
  document.querySelector('#avatar-input').addEventListener('change', settings.event.avatarPreview)
  // Toggle password visibility
  document.querySelectorAll('.vis-icon').forEach((btn) => {
    btn.addEventListener('click', settings.event.passVisToggle)
  })
}

/**
 * Populates input fields with user settings.
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 * 
 * @param {Object} account       User account settings.
 * @param {Object} user          User profile settings.
 * @param {Object} notification  User notification settings.
 */
settings.init.populate = (account = {}, user = {}, notification = {}) => {
  // Profile
  settings.elem.displayNameInput.value = user.displayName ? user.displayName : "";
  settings.elem.displayEmailInput.value = user.displayEmail ? user.displayEmail : "";
  settings.elem.locationInput.value = user.location ? user.location : "";
  // Account
  settings.elem.nameInput.value = user.name;
  settings.elem.emailStatic.innerHTML = account.email;
  settings.elem.streetInput.value = user.address.street ? user.address.street : "";
  settings.elem.cityInput.value = user.address.city ? user.address.city : "";
  settings.elem.zipInput.value = user.address.postcode ? user.address.postcode : "";
  settings.elem.unitInput.value = user.address.unit ? user.address.unit : "";
  settings.elem.stateInput.value = user.address.suburb ? user.address.suburb : "";
  settings.elem.countryInput.value = user.address.country ? user.address.country : "";
  // Notifications
  settings.elem.mailingInput.checked = notification.newsletter;
}

/**
 * Initialises the cache with user data.
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.cacheInit = (data) => {
  settings.var.cache = {
    avatar: "/settings/fetch-avatar",
    city: data.user.address.city,
    displayName: data.user.displayName,
    displayEmail: data.user.displayEmail,
    location: data.user.location,
    name: data.user.name,
    email: data.account.email,
    street: data.user.address.street,
    unit: data.user.address.unit,
    state: data.user.address.suburb,
    zip: data.user.address.postcode,
    country: data.user.address.country,
    mailing: data.notification.newsletter
  }
}

/**
 * Checks ``sessionStorage`` for references from previous page and styles the page accordingly; storage is cleared after.
 * 
 * | **Invokes**
 * | :func:`settings.badgeScreenShow`
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.sessionStorageCheck = () => {
  // Check if coming from Dashboard
  const badge = sessionStorage.getItem('dashboard')
  if (badge) {
    settings.badgeScreenShow();
    // Display relevant badge
    if (badge !== 'empty') {
      document.querySelector('.' + badge + '-details').classList.add('badge-details-show')
      document.querySelector('.config-badge.' + badge).classList.add('badge-focus')
    }
    // Clear storage
    sessionStorage.clear()
  }
}

// ==========================================================
// FRONT-END FUNCTIONS
// ==========================================================

/**
 * Reverts account to cached settings and hides the save button.
 *
 * | **Invokes**
 * | :func:`settings.editModeExit`
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners` :func:`settings.event.accountCancelMobile`
 */
settings.accountCancel = (e) => {
  e.stopPropagation();
  settings.editModeExit(settings.elem.accountSection);
  settings.elem.accountSection.querySelector('.btn-container').classList.remove('unsaved-changes');
  // Revert to cached settings and hide save button
  settings.elem.nameInput.value = settings.var.cache.name;
  settings.elem.emailInput.value = settings.var.cache.email;
  settings.elem.streetInput.value = settings.var.cache.street;
  settings.elem.unitInput.value = settings.var.cache.unit;
  settings.elem.cityInput.value = settings.var.cache.city;
  settings.elem.stateInput.value = settings.var.cache.state;
  settings.elem.zipInput.value = settings.var.cache.zip;
  settings.elem.countryInput.value = settings.var.cache.country;
}

/**
 * Shows the configure badge screen when the preview badge container is clicked.
 * 
 * | **Invokes**
 * | :func:`settings.screenShow`
 */
settings.badgeScreenShow = () => {
  settings.screenShow(settings.elem.badgeScreen, settings.elem.profileSection)
}

/**
 * Closes the badge configuration (when X button is clicked). Also reverts to cached badge configuration.
 * 
 * | **Invokes**
 * | :func:`settings.screenClose`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.badgeScreenCancel = () => {
  // TODO: revert to cached badge configuration

  settings.elem.profileSection.classList.add('edit-mode');
  settings.elem.profileSection.classList.remove('mobile-hide');
  settings.screenClose(settings.elem.badgeScreen);
}

/**
 * Updates the cache with current inputs.
 *
 * | **Invoked by**
 * | :func:`settings.backend.profileSave` :func:`settings.backend.badgesSave` :func:`settings.backend.accountSave` :func:`settings.backend.notificationsSave`
 */
settings.cacheUpdate = (section) => {
  if (section === 'profile') {
    const profileCache = {
      displayName: settings.elem.displayNameInput.value,
      displayEmail: settings.elem.displayEmailInput.value,
      location: settings.elem.locationInput.value,
    };
    settings.var.cache = {...settings.var.cache, ...profileCache};
  } else if (section === 'badges') {
    // TODO: cache badge config
    const badgesCache = {

    }
    settings.var.cache = {...settings.var.cache, ...badgesCache};
  } else if (section === 'account') {
    const accountCache = {
      name: settings.elem.nameInput.value,
      email: settings.elem.emailInput.value,
      street: settings.elem.streetInput.value,
      unit: settings.elem.unitInput.value,
      city: settings.elem.cityInput.value,
      state: settings.elem.stateInput.value,
      zip: settings.elem.zipInput.value,
      country: settings.elem.countryInput.value
    };
    settings.var.cache = {...settings.var.cache, ...accountCache};
  } else if (section === 'notifications') {
    const notificationsCache = {
      mailing: settings.elem.mailingInput.checked
    };
    settings.var.cache = {...settings.var.cache, ...notificationsCache};
  }
}

/**
 * Exits editing mode for ``selected`` and returns the user to the main Settings page if on mobile.
 *
 * | **Invoked by**
 * | :func:`settings.event.sectionClick` :func:`settings.event.profileCancelMobile` :func:`settings.event.accountCancelMobile` :func:`settings.event.notificationsCancelMobile`
 * 
 * @param {Object} selected A section container.
 */
settings.editModeExit = (selected) => {
  selected.classList.remove('edit-mode');
  document.querySelectorAll('.mobile-hide').forEach((section) => {
    section.classList.remove('mobile-hide');
  })
}

/**
 * TODO 
 * 
 * | **Invokes**
 * | :func:`settings.screenClose`
 * 
 * @param {*} e Event object.
 */
settings.emailScreenCancel = () => {
  settings.elem.emailInput.value = "";
  settings.elem.emailPasswordInput.value = "";
  settings.elem.emailScreen.classList.add('on-step-one');
  settings.elem.emailScreen.classList.remove('on-step-two');
  settings.elem.emailScreen.querySelector('.continue-btn').classList.remove('unsaved-changes');
  settings.elem.emailScreen.querySelector('.save-btn').classList.remove('unsaved-changes');
  settings.screenClose(settings.elem.emailScreen);
}

/**
 * Shows the email editing screen.
 * 
 * | **Invokes**
 * | :func:`settings.screenShow`
 */
settings.emailScreenShow = () => {
  settings.screenShow(settings.elem.emailScreen, settings.elem.accountSection)
}

/**
 * Reverts notifications to cached settings and hides the save button.
 *
 * | **Invokes**
 * | :func:`settings.editModeExit`
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners` :func:`settings.event.notificationsCancelMobile`
 */
settings.notificationsCancel = (e) => {
  e.stopPropagation();
  settings.editModeExit(settings.elem.notificationsSection);
  settings.elem.notificationsSection.querySelector('.btn-container').classList.remove('unsaved-changes');
  // Revert to cached settings and hide save button
  settings.elem.mailingInput.checked = settings.var.cache.mailing;
}

/**
 * TODO
 * 
 * | **Invokes**
 * | :func:`settings.screenClose`
 */
settings.passwordScreenCancel = () => {
  // TODO
  settings.elem.passwordInput.value = "";
  settings.elem.passwordConfirmInput.value = "";
  settings.elem.passwordScreen.classList.add('on-step-one');
  settings.elem.passwordScreen.classList.remove('on-step-two');
  settings.elem.passwordScreen.querySelector('.continue-btn').classList.remove('unsaved-changes');
  settings.elem.passwordScreen.querySelector('.save-btn').classList.remove('unsaved-changes');
  settings.screenClose(settings.elem.passwordScreen);
}

/**
 * Shows the password editing screen.
 * 
 * | **Invokes**
 * | :func:`settings.screenShow`
 */
settings.passwordScreenShow = () => {
  settings.screenShow(settings.elem.passwordScreen, settings.elem.accountSection)
}

/**
 * Reverts profile to cached settings and hides the save button.
 *
 * | **Invokes**
 * | :func:`settings.editModeExit`
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.profileCancel = (e) => {
  e.stopPropagation();
  settings.editModeExit(settings.elem.profileSection);
  settings.elem.profileSection.querySelector('.btn-container').classList.remove('unsaved-changes');
  // Revert to cached settings and hide save button
  settings.elem.avatarPreview.src = "settings/fetch-avatar"
  settings.elem.displayNameInput.value = settings.var.cache.displayName;
  settings.elem.displayEmailInput.value = settings.var.cache.displayEmail;
  settings.elem.locationInput.value = settings.var.cache.location;
}

/**
 * Closes a screen.
 * 
 * @param {Object} screen   Screen element closed.
 */
settings.screenClose = (screen) => {
  global.elem.darkenOverlay.classList.add('hide-overlay');
  global.elem.darkenOverlay.classList.remove('mobile-hide');
  document.querySelector('.edit-mode').classList.remove('mobile-hide');
  screen.classList.add('hide');
}

/**
 * Shows a screen.
 * 
 * @param {Object} screen   Screen element shown.
 * @param {Object} section  Section corresponding to the screen.
 */
settings.screenShow = (screen, section) => {
  screen.classList.remove('hide');
  global.elem.darkenOverlay.classList.remove('hide-overlay');
  global.elem.darkenOverlay.classList.add('mobile-hide');
  document.querySelectorAll('.section-container').forEach((section) => {
    section.classList.add('mobile-hide');
    section.classList.remove('edit-mode');
  })
  section.classList.add('edit-mode');
}

// ==========================================================
// EVENTS FUNCTIONS
// ==========================================================

/**
 * Checks for changes in account settings.
 * 
 * | **Invokes**
 * | :func:`global.input.checkChange`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.accountInputsCheck = () => {
  const dict = {
    name: {
      value: settings.elem.nameInput.value,
      cache: settings.var.cache.name
    },
    email: {
      value: settings.elem.emailInput.value,
      cache: settings.var.cache.email
    },
    street: {
      value: settings.elem.streetInput.value,
      cache: settings.var.cache.street
    },
    unit: {
      value: settings.elem.unitInput.value,
      cache: settings.var.cache.unit
    },
    city: {
      value: settings.elem.cityInput.value,
      cache: settings.var.cache.city
    },
    state: {
      value: settings.elem.stateInput.value,
      cache: settings.var.cache.state
    },
    zip: {
      value: settings.elem.zipInput.value,
      cache: settings.var.cache.zip
    },
    country: {
      value: settings.elem.countryInput.value,
      cache: settings.var.cache.country
    }
  }
  global.input.checkChange(dict, [settings.elem.accountSection.querySelector('.btn-container')], ['unsaved-changes']);
}

/**
 * Previews the uploaded avatar image. The original image is hidden until the new image is loaded, at which point it will fade in.
 */
settings.event.avatarPreview = function() {
  if (this.files && this.files[0]) {
    settings.elem.avatarPreview.classList.add('fade');
    var reader = new FileReader();
    reader.onload = (e) => {
      settings.elem.avatarPreview.src = e.target.result;
      settings.elem.avatarPreview.classList.remove('fade');
    }
    reader.readAsDataURL(this.files[0]);
  }
}

/**
 * Closes the badge configuration screen if ``Esc`` key press. Also reverts to cached badge configuration.
 * 
 * | **Invokes**
 * | :func:`settings.badgeScreenCancel` :func:`settings.emailScreenCancel` :func:`settings.passwordScreenCancel`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e An event object.
 */
settings.event.escapeKeyPress = (e) => {
  if (e.key === 'Escape') {
    settings.badgeScreenCancel();
    settings.emailScreenCancel();
    settings.passwordScreenCancel();
  }
}

/**
 * Focuses the configuration badge being selected and shows the respective badge details. Also unfocus the previously selected badge (if any).
 *
 * | **Invoked by**
 * | :func:`settings.init.loadBadges`
 */
settings.event.badgeConfigToggle = function() {
  // Deselect currently select badge (if any)
  if (document.querySelector('.badge-details-show')) {
    document.querySelector('.badge-details-show').classList.remove('badge-details-show');
    document.querySelector('.badge-focus').classList.remove('badge-focus');
  }
  // Select this badge if checked
  if (this.checked) {
    document.querySelector('.' + this.badgeName + '-details').classList.add('badge-details-show');
    document.querySelector('.config-badge.' + this.badgeName).classList.add('badge-focus');
  }
}

/**
 * Checks new email input is not empty before showing the save button, otherwise hides it.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.emailInputCheck = () => {
  if (settings.elem.emailInput.value) {
    settings.elem.emailScreen.querySelector('.save-btn').classList.add('unsaved-changes')
  } else {
    settings.elem.emailScreen.querySelector('.save-btn').classList.remove('unsaved-changes')
  }
}

// TODO
settings.event.emailInputEnter = (e) => {
  if (e.key === 'Enter') {
    settings.backend.emailSave();
  }
}

/**
 * Checks the password input required to change email is not empty before showing the continue button, otherwise hides it.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.emailPassInputCheck = () => {
  if (settings.elem.emailPasswordInput.value) {
    settings.elem.emailScreen.querySelector('.continue-btn').classList.add('unsaved-changes')
  } else {
    settings.elem.emailScreen.querySelector('.continue-btn').classList.remove('unsaved-changes')
  }
}

// TODO
settings.event.emailPassInputEnter = (e) => {
  if (e.key === 'Enter') {
    settings.backend.emailContinue();
  }
}

/**
 * Checks for changes in notifications settings.
 * 
 * | **Invokes**
 * | :func:`global.input.checkChange`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.notificationsInputsCheck = () => {
  const dict = {
    mailing: {
      value: settings.elem.mailingInput.checked,
      cache: settings.var.cache.mailing
    }
  }
  global.input.checkChange(dict, [settings.elem.notificationsSection.querySelector('.btn-container')], ['unsaved-changes']);
}

/**
 * Toggles password visibility.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.passVisToggle = function() {
  const type = this.previousElementSibling.getAttribute('type') === 'password' ? 'text' : 'password';
  this.previousElementSibling.setAttribute('type', type);
  this.classList.toggle('visible');
}


/**
 * Checks new password and confirm password inputs are not empty before showing the save button, otherwise hides it.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.passwordInputsCheck = () => {
  if (settings.elem.passwordInput.value && settings.elem.passwordConfirmInput.value) {
    settings.elem.passwordScreen.querySelector('.save-btn').classList.add('unsaved-changes')
  } else {
    settings.elem.passwordScreen.querySelector('.save-btn').classList.remove('unsaved-changes')
  }
}

settings.event.passwordInputsEnter = (e) => {
  if (e.key === 'Enter') {
    settings.backend.passwordSave();
  }
}

/**
 * Checks for changes in profile settings.
 * 
 * | **Invokes**
 * | :func:`global.input.checkChange`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.profileInputsCheck = () => {
  const dict = {
    avatar: {
      value: settings.elem.avatarPreview.getAttribute('src'),
      cache: settings.var.cache.avatar
    },
    displayName: {
      value: settings.elem.displayNameInput.value,
      cache: settings.var.cache.displayName
    },
    displayEmail: {
      value: settings.elem.displayEmailInput.value,
      cache: settings.var.cache.displayEmail
    },
    location: {
      value: settings.elem.locationInput.value,
      cache: settings.var.cache.location
    }
  }
  global.input.checkChange(dict, [settings.elem.profileSection.querySelector('.btn-container')], ['unsaved-changes']);
}

/**
 * Handles all clicks on a section. Clicking the cancel or save button exits edit mode. Clicking anywhere on a section enables edit mode, if not already enabled.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.sectionClick = function() {
  document.querySelectorAll('.section-container').forEach((section) => {
    if (this.parentElement === section) {
      section.classList.add('edit-mode');
      section.classList.remove('mobile-hide');
    } else {
      section.classList.add('mobile-hide');
      section.classList.remove('edit-mode');
    }
  })
}

/**
 * Checks all six verification code inputs are not empty before showing the continue button, otherwise hides it.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.verificationInputsCheck = () => {
  var valid = true;
  document.querySelectorAll('.code-input').forEach((input) => {
    if (!input.value) {
      valid = false;
      return;
    }
  })
  if (valid) {
    settings.elem.passwordScreen.querySelector('.continue-btn').classList.add('unsaved-changes');
  } else {
    settings.elem.passwordScreen.querySelector('.continue-btn').classList.remove('unsaved-changes');
  }
}

settings.event.verificationInputsEnter = (e) => {
  if (e.key === 'Enter') {
    settings.backend.passwordContinue();
  }
}

// ==========================================================
// BACKEND REQUEST
// ==========================================================

/**
 * Posts Account section changes to the database; these include the account name and location. If successful, the local cache is updated.
 * 
 * | **Invokes**
 * | :func:`axios.post` :func:`settings.cacheUpdate` :func:`settings.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.backend.accountSave = async () => {
  // Collect input
  let input = {
    name: settings.elem.nameInput.value,
    address: {
      unit: settings.elem.unitInput.value,
      street: settings.elem.streetInput.value,
      suburb: settings.elem.stateInput.value,
      city: settings.elem.cityInput.value,
      postcode: settings.elem.zipInput.value,
      country: settings.elem.countryInput.value
    }
  }
  // Validate input
  
  // Send update request
  let data;
  try {
    data = (await axios.post("/settings/update-account", input))["data"];
  } catch (error) {
    data = {status: "error", content: error};
  }
  // Validation
  if (data.status === "failed") {
    return console.log(data.content);
  } else if (data.status === "error") {
    return console.log(data.content);
  }
  // Update cache
  settings.cacheUpdate('account');
  settings.editModeExit(settings.elem.accountSection);
  // Hide save button
  settings.elem.accountSection.querySelector('.btn-container').classList.remove('unsaved-changes');
  return;
}

/**
 * Posts badge configuration to the database. If successful, the local cache and preview badges are updated.
 * 
 * | **Invokes**
 * | :func:`axios.post` :func:`settings.cacheUpdate` :func:`settings.screenClose`
 *
 * | **Invoked by**
 * | :func:`settings.event.badgesSave`
 */
settings.backend.badgesSave = async () => {
  let data = [];
  settings.elem.badgeAchievedSection.querySelectorAll('.config-badge').forEach((badge) => {
    data.push(badge.classList[1])
  })
  console.log(data)
  // TODO: Post badge configuration

  settings.cacheUpdate('badges');
  // TODO: update badge preview


  // Close badge screen
  settings.screenClose(settings.elem.badgeScreen);
}

// TODO
settings.backend.emailContinue = async () => {
  // TODO: validate input


  let emailPass = settings.elem.emailPasswordInput.value;

  let data;
  try {
    data = await delay(emailPass);
  } catch(error) {
    data = {status: "error", content: error};
  }

  // Validation
  if (data.status === "failed") {
    return console.log(data.content);
  } else if (data.status === "error") {
    return console.log(data.content);
  }

  // Clean up step one UI
  settings.elem.emailPasswordInput.value = "";
  settings.elem.emailScreen.querySelector('.continue-btn').classList.remove('unsaved-changes');
  // Change to step two UI
  settings.elem.emailInput.focus();
  settings.elem.emailInput.select();
  settings.elem.emailScreen.classList.add('on-step-two');
  settings.elem.emailScreen.classList.remove('on-step-one');
}

// TODO
settings.backend.emailSave = async () => {
  // TODO: validate input

  
  let email = settings.elem.emailInput.value;

  let data;
  try {
    data = await delay(email);
  } catch(error) {
    data = {status: "error", content: error};
  }

  // Validation
  if (data.status === "failed") {
    return console.log(data.content);
  } else if (data.status === "error") {
    return console.log(data.content);
  }

  // Update static email
  settings.elem.emailStatic.innerHTML = email;
  // Clean up UI and close screen
  settings.screenClose(settings.elem.emailScreen);
  settings.elem.emailInput.value = "";
  settings.elem.emailScreen.classList.remove('on-step-two');
  settings.elem.emailScreen.classList.add('on-step-one');
  settings.elem.emailScreen.querySelector('.save-btn').classList.remove('unsaved-changes');
}

/**
 * Fetches user data from the database.
 * 
 * | **Invokes**
 * | :func:`axios.post`
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 * 
 * @return {Object} Promise - User data.
 */
settings.backend.fetch = () => {
  return new Promise(async (resolve, reject) => {
    // Fetch data
    let data;
    try {
      data = (await axios.post("/settings"))["data"];
    } catch (error) {
      data = { status: "error", content: error };
    }
    return resolve(data);
  });
}

/**
 * Posts mailing list changes to the database. If successful, the local cache is updated.
 * 
 * | **Invokes**
 * | :func:`axios.post` :func:`settings.cacheUpdate` :func:`settings.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.backend.notificationsSave = async () => {
  // Collect input
  let input = {
    newsletter: settings.elem.mailingInput.checked
  }
  // Validate input

  // Send update request
  let data;
  try {
    data = (await axios.post("/settings/update-notification", input))["data"];
  } catch (error) {
    data = {status: "error", content: error};
  }
  // Validation
  if (data.status === "failed") {
    return console.log(data.content);
  } else if (data.status === "error") {
    return console.log(data.content);
  }
  // Update cache
  settings.cacheUpdate('notifications');
  settings.editModeExit(settings.elem.notificationsSection);
  // Hide save button
  settings.elem.notificationsSection.querySelector('.btn-container').classList.remove('unsaved-changes');
  return;
}

// TODO
settings.backend.passwordContinue = async () => {
  // TODO: validate input


  let code = "123456";

  let data;
  try {
    data = await delay(code);
  } catch(error) {
    data = {status: "error", content: error};
  }

  // Validation
  if (data.status === "failed") {
    return console.log(data.content);
  } else if (data.status === "error") {
    return console.log(data.content);
  }

  // Clean up step one UI
  document.querySelectorAll('.code-input').forEach((input) => {
    input.value = ""
  })
  settings.elem.passwordScreen.querySelector('.continue-btn').classList.remove('unsaved-changes');
  // Change to step two UI
  settings.elem.passwordInput.focus();
  settings.elem.passwordInput.select();
  settings.elem.passwordScreen.classList.add('on-step-two');
  settings.elem.passwordScreen.classList.remove('on-step-one');
}

// TODO
settings.backend.passwordSave = async () => {
  // TODO: validate input

  let password = settings.elem.passwordInput.value;

  let data;
  try {
    data = await delay(password);
  } catch(error) {
    data = {status: "error", content: error};
  }

  // Validation
  if (data.status === "failed") {
    return console.log(data.content);
  } else if (data.status === "error") {
    return console.log(data.content);
  }

  // Clean up UI and close screen
  settings.screenClose(settings.elem.passwordScreen);
  settings.elem.passwordInput.value = "";
  settings.elem.passwordConfirmInput.value = "";
  settings.elem.passwordScreen.classList.remove('on-step-two');
  settings.elem.passwordScreen.classList.add('on-step-one');
  settings.elem.passwordScreen.querySelector('.save-btn').classList.remove('unsaved-changes');
}

/**
 * Posts Profile section changes to the database; these include the display name, display email, and display location. If successful, the local cache is updated.
 * 
 * | **Invokes**
 * | :func:`axios.post` :func:`settings.cacheUpdate` :func:`settings.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.backend.profileSave = async () => {
  // Collect input
  let input;
  const file = document.querySelector("#avatar-input");
  if (file.files.length !== 0) {
    input = await global.compressImage(".avatar-form", "avatar", 400);
  } else {
    input = new FormData();
  }
  input.append("displayName", settings.elem.displayNameInput.value);
  input.append("displayEmail", settings.elem.displayEmailInput.value);
  input.append("location", settings.elem.locationInput.value);
  // Validate input
  
  // Send update request
  let data;
  try {
    data = (await axios.post("/settings/update-profile", input))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // Validation
  if (data.status === "failed") {
    return console.log(data.content);
  } else if (data.status === "error") {
    return console.log(data.content);
  }
  // Update cache
  settings.cacheUpdate('profile');
  settings.editModeExit(settings.elem.profileSection);
  // Hide save button
  settings.elem.profileSection.querySelector('.btn-container').classList.remove('unsaved-changes');
  return;
}

// ==========================================================
// PLACES API
// ==========================================================

// Search bias
settings.places.center = {
  lat: -36.848461,
  lng: 174.763336
};


settings.places.options = {
  bounds: {
    north: settings.places.center.lat + 0.1,
    south: settings.places.center.lat - 0.1,
    east: settings.places.center.lng + 0.1,
    west: settings.places.center.lng - 0.1,
  },
  componentRestrictions: {
    country: ["us", "au", "nz", "cn"]
  },
  fields: ["address_components"],
  origin: settings.places.center,
  strictBounds: false,
  types: ["address"]
}

