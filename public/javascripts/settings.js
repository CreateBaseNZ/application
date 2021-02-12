// ==========================================================
// VARIABLES
// ==========================================================

// const e = require("express");

let settings = {

  init: {
    attachAllListeners: undefined,
    cacheInit: undefined,
    init: undefined,
    loadBadges: undefined,
    populate: undefined,
    sessionStorageCheck: undefined,
    sortableJSInit: undefined
  },

  event: {
    avatarPreview: undefined,
    badgeConfigScreenEscape: undefined,
    badgeConfigScreenSave: undefined,
    badgeConfigToggle: undefined,
    emailPassInputCheck: undefined,
    emailInputCheck: undefined,
    sectionClick: undefined,
  },

  accountCancel: undefined,
  accountInputsCheck: undefined,
  badgeConfigScreenCancel: undefined,
  badgeConfigScreenClose: undefined,
  badgeConfigScreenShow: undefined,
  badgesCancel: undefined,
  cacheUpdate: undefined,
  editModeExit: undefined,
  emailScreenShow: undefined,
  emailScreenClose: undefined,
  emailScreenCancel: undefined,
  notificationsCancel: undefined,
  notificationsInputsCheck: undefined,
  passVisToggle: undefined,
  passwordScreenShow: undefined,
  profileCancel: undefined,
  profileInputsCheck: undefined,
  screenClose: undefined,
  screenShow: undefined,

  backend: {
    fetch: undefined,
    accountSave: undefined,
    badgesSave: undefined,
    emailPassVerification: undefined,
    notificationsSave: undefined,
    profileSave: undefined,
  },
  
  var: {
    // temp
    badges: ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'], 
    cache: {},
  },
  
  elem: {
    avatarPreview: document.querySelector('.avatar-preview'),
    badgeConfigScreen: document.querySelector('.badge-edit-screen'),
    badgePreviewContainer: document.querySelector('.badges-container'),
    accountCancelBtn: document.querySelector('.account-cancel'),
    accountSaveBtn: document.querySelector('.account-save'),
    notificationsCancelBtn: document.querySelector('.notifications-cancel'),
    notificationsSaveBtn: document.querySelector('.notifications-save'),
    profileCancelBtn: document.querySelector('.profile-cancel'),
    profileSaveBtn: document.querySelector('.profile-save'),
    avatarInput: document.querySelector('#avatar-input'),
    displayNameInput: document.querySelector('#prof-name'),
    displayEmailInput: document.querySelector('#prof-email'),
    locationInput: document.querySelector('#prof-loc'),
    nameInput: document.querySelector('#acc-name'),
    emailInput: document.querySelector('#acc-email'),
    emailStatic: document.querySelector('.email-static'),
    emailPasswordInput: document.querySelector('#email-pass'),
    passwordInput: document.querySelector('#acc-pass'),
    streetInput: document.querySelector('#acc-street'),
    unitInput: document.querySelector('#acc-unit'),
    cityInput: document.querySelector('#acc-city'),
    stateInput: document.querySelector('#acc-state'),
    zipInput: document.querySelector('#acc-zip'),
    countryInput: document.querySelector('#acc-country'),
    mailingInput: document.querySelector('#mail'),
    profileSection: document.querySelector('.profile-section'),
    accountSection: document.querySelector('.account-section'),
    notificationsSection: document.querySelector('.notifications-section'),
    badgeAchievedSection: document.querySelector('.badge-achieved-section'),
    badgeNotAchievedSection: document.querySelector('.badge-not-achieved-section'),
    emailScreen: document.querySelector('.email-edit-screen'),
    passwodConfirmInput: document.querySelector('#acc-pass-conf')
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
    // TO DO: load config badges
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

    // TO DO: add to achieved section

    // TO DO: add to not achieved section

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
 * | :func:`settings.event.avatarPreview` :func:`settings.badgeConfigScreenShow` :func:`settings.emailScreenShow` :func:`settings.passVisToggle` :func:`settings.profileInputsCheck` :func:`settings.accountInputsCheck` :func:`settings.notificationsInputsCheck` :func:`settings.event.emailPassInputCheck` :func:`settings.event.emailInputCheck` :func:`settings.backend.profileSave` :func:`settings.profileCancel` :func:`settings.backend.accountSave` :func:`settings.accountCancel` :func:`settings.backend.notificationsSave` :func:`settings.notificationsCancel` :func:`settings.event.badgeConfigScreenSave` :func:`settings.badgeConfigScreenCancel` :func:`settings.event.badgeConfigScreenEscape` :func:`settings.event.sectionClick`
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.attachAllListeners = () => {
  // Previews new avatar
  document.querySelector('#avatar-input').addEventListener('change', settings.event.avatarPreview)
  // Show badge config screen
  settings.elem.badgePreviewContainer.addEventListener('click', settings.badgeConfigScreenShow)
  // Show change email screen
  document.querySelector('.email-container').querySelector('button').addEventListener('click', settings.emailScreenShow)
  // Show change password screen
  document.querySelector('.pass-container').querySelector('button').addEventListener('click', settings.passwordScreenShow)
  // Toggle password visibility
  document.querySelectorAll('.vis-icon').forEach((btn) => {
    btn.addEventListener('click', settings.passVisToggle)
  })
  // Check for changes in Profile inputs 
  settings.elem.profileSection.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.profileInputsCheck)
  })
  // Check for changes in Account inputs
  settings.elem.accountSection.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.accountInputsCheck)
  })
  // Check for changes in Notification inputs
  settings.elem.notificationsSection.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.notificationsInputsCheck)
  })
  // Check for changes in change email step one (password) input
  settings.elem.emailPasswordInput.addEventListener('input', settings.event.emailPassInputCheck)
  // Check for changes in change email step two (new email) input
  settings.elem.emailInput.addEventListener('input', settings.event.emailInputCheck)
  // Save Profile settings
  settings.elem.profileSaveBtn.addEventListener('click', settings.backend.profileSave)
  // Cancel Profile settings
  settings.elem.profileCancelBtn.addEventListener('click', settings.profileCancel)
  // Cancel Profile settings (mobile)
  settings.elem.profileSection.querySelector('.back-to-main-sections').addEventListener('click', settings.profileCancel)
  // Save Account settings
  settings.elem.accountSaveBtn.addEventListener('click', settings.backend.accountSave)
  // Cancel Account settings
  settings.elem.accountCancelBtn.addEventListener('click', settings.accountCancel)
  // Cancel Account settings (mobile)
  settings.elem.accountSection.querySelector('.back-to-main-sections').addEventListener('click', settings.accountCancel)
  // Save Notifications settings
  settings.elem.notificationsSaveBtn.addEventListener('click', settings.backend.notificationsSave)
  // Cancel Notifications settings
  settings.elem.notificationsCancelBtn.addEventListener('click', settings.notificationsCancel)
  // Cancel Notifications settings (mobile)
  settings.elem.notificationsSection.querySelector('.back-to-main-sections').addEventListener('click', settings.notificationsCancel)
  // Saving badge configuration
  document.querySelector('.badge-config-done').addEventListener('click', settings.event.badgeConfigScreenSave)
  // Closing the badge configuration screen
  settings.elem.badgeConfigScreen.querySelector('.screen-close').addEventListener('click', settings.badgeConfigScreenCancel)
  // Closing the email edit screen
  settings.elem.emailScreen.querySelector('.screen-close').addEventListener('click', settings.emailScreenCancel)
  // Closing the edit email screen
  settings.elem.emailScreen.querySelector('.cancel-back').addEventListener('click', settings.emailScreenCancel)
  // Escape key exits all screens
  document.addEventListener('keydown', settings.event.badgeConfigScreenEscape)
  // Enabling and exiting edit mode
  document.querySelectorAll('.section').forEach(function (section) {
    section.addEventListener('click', settings.event.sectionClick)
  })
  // Submit password for email validation
  settings.elem.emailScreen.querySelector('.continue-btn').addEventListener('click', settings.backend.emailPassVerification)
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
  // settings.elem.emailInput.value = account.email;
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
 * | :func:`settings.badgeConfigScreenShow`
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.sessionStorageCheck = () => {
  // Check if coming from Dashboard
  const badge = sessionStorage.getItem('dashboard')
  if (badge) {
    settings.badgeConfigScreenShow();
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
    // TO DO: cache badge config
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
 * Shows a screen.
 * 
 * @param {Object} e        Event object.
 * @param {Object} screen   Screen element shown.
 */
settings.screenShow = (e, screen) => {
  console.log('screenShow')
  // e.stopPropagation();
  screen.classList.remove('hide');
  global.elem.darkenOverlay.classList.remove('hide');
  document.querySelectorAll('.section-container').forEach((section) => {
    section.classList.add('mobile-hide');
  })
}

/**
 * Closese a screen.
 * 
 * @param {Object} e        Event object.
 * @param {Object} screen   Screen element closed.
 */
settings.screenClose = (e, screen) => {
  console.log('screenClose')
  e.stopPropagation();
  global.elem.darkenOverlay.classList.add('hide');
  document.querySelector('.edit-mode').classList.remove('mobile-hide');
  screen.classList.add('hide');
}

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
 * TO DO
 */
settings.badgesCancel = () => {
  // TO DO: load cached badges data

}

/**
 * Closes the badge configuration (when X button is clicked). Also reverts to cached badge configuration.
 * 
 * | **Invokes**
 * | :func:`settings.badgeConfigScreenClose`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.badgeConfigScreenCancel = (e) => {
  // TO DO: revert to cached badge configuration

  settings.badgeConfigScreenClose(e);
}

settings.emailScreenCancel = (e) => {
  settings.elem.emailInput.value = "";
  settings.elem.emailPasswordInput.value = "";
  settings.elem.emailScreen.classList.add('on-step-one')
  settings.elem.emailScreen.classList.remove('on-step-two')
  settings.elem.emailScreen.querySelector('.continue-btn').classList.remove('unsaved-changes')
  settings.elem.emailScreen.querySelector('.save-btn').classList.remove('unsaved-changes')
  settings.emailScreenClose(e);
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
 * Shows the configure badge screen when the preview badge container is clicked.
 * 
 * | **Invokes**
 * | :func:`settings.screenShow`
 */
settings.badgeConfigScreenShow = (e) => {
  settings.screenShow(e, settings.elem.badgeConfigScreen)
}

/**
 * Closes the badge configuration screen.
 * 
 * | **Invokes**
 * | :func:`settings.screenClose`
 *
 * | **Invoked by**
 * | :func:`settings.event.badgeConfigScreenSave` :func:`settings.event.badgeConfigScreenEscape` :func:`settings.event.badgeConfigScreenCancel`
 */
settings.badgeConfigScreenClose = (e) => {
  settings.screenClose(e, settings.elem.badgeConfigScreen);
}


/**
 * Shows the email editing screen.
 * 
 * | **Invokes**
 * | :func:`settings.screenShow`
 */
settings.emailScreenShow = (e) => {
  settings.screenShow(e, document.querySelector('.email-edit-screen'))
}

settings.passwordScreenShow = (e) => {
  settings.screenShow(e, document.querySelector('.pass-edit-screen'))
}

/**
 * Closes the email editing screen.
 * 
 * | **Invokes**
 * | :func:`settings.screenClose`
 */
settings.emailScreenClose = (e) => {
  settings.screenClose(e, document.querySelector('.email-edit-screen'))
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
settings.profileInputsCheck = () => {
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
 * Checks for changes in account settings.
 * 
 * | **Invokes**
 * | :func:`global.input.checkChange`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.accountInputsCheck = () => {
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
 * Checks for changes in notifications settings.
 * 
 * | **Invokes**
 * | :func:`global.input.checkChange`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.notificationsInputsCheck = () => {
  const dict = {
    mailing: {
      value: settings.elem.mailingInput.checked,
      cache: settings.var.cache.mailing
    }
  }
  global.input.checkChange(dict, [settings.elem.notificationsSection.querySelector('.btn-container')], ['unsaved-changes']);
}

settings.event.emailPassInputCheck = () => {
  const dict = {
    mailing: {
      value: settings.elem.emailPasswordInput.value,
      cache: ""
    }
  }
  global.input.checkChange(dict, [settings.elem.emailScreen.querySelector('.step-one').querySelector('.continue-btn')], ['unsaved-changes']);
}

/**
 * Toggles password visibility.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.passVisToggle = function() {
  const type = this.previousElementSibling.getAttribute('type') === 'password' ? 'text' : 'password';
  this.previousElementSibling.setAttribute('type', type);
  this.classList.toggle('visible');
}

settings.event.emailInputCheck = () => {
  const dict = {
    mailing: {
      value: settings.elem.emailInput.value,
      cache: ""
    }
  }
  global.input.checkChange(dict, [settings.elem.emailScreen.querySelector('.step-two').querySelector('.save-btn')], ['unsaved-changes']);
}

// ==========================================================
// EVENTS FUNCTIONS
// ==========================================================

/**
 * Handles all clicks on a section. Clicking the cancel or save button exits edit mode. Clicking anywhere on a section enables edit mode, if not already enabled.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e An event object.
 */
settings.event.sectionClick = function() {
  console.log('sectionClick')
  if (!this.classList.contains('edit-mode')) {
    document.querySelectorAll('.section-container').forEach((section) => {
      if (this === section) {
        this.classList.add('edit-mode');
        // this.classList.remove('mobile-hide');
      } else {
        section.classList.add('mobile-hide');
        section.classList.remove('edit-mode');
      }
    })
  }
}

/**
 * Sends badge configuration to back-end, closes badge configuration screen, and exits Profile edit mode.
 * 
 * | **Invokes**
 * | :func:`settings.backend.badgesSave` :func:`settings.badgeConfigScreenClose` :func:`settings.event.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.badgeConfigScreenSave = (e) => {
  // Send badges to back-end
  settings.backend.badgesSave();
  // Close the config screen
  settings.badgeConfigScreenClose(e);
  // Exit Profile edit mode
  settings.editModeExit(settings.elem.profileSection);
}

/**
 * Closes the badge configuration screen if ``Esc`` key press. Also reverts to cached badge configuration.
 * 
 * | **Invokes**
 * | :func:`settings.badgeConfigScreenCancel` :func:`settings.emailScreenCancel`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e An event object.
 */
settings.event.badgeConfigScreenEscape = (e) => {
  if (e.key === 'Escape') {
    settings.badgeConfigScreenCancel(e);
    settings.emailScreenCancel(e);
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


// ==========================================================
// BACKEND REQUEST
// ==========================================================

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

/**
 * Posts badge configuration to the database. If successful, the local cache and preview badges are updated.
 * 
 * | **Invokes**
 * | :func:`axios.post` :func:`settings.cacheUpdate`
 *
 * | **Invoked by**
 * | :func:`settings.event.badgeConfigScreenSave`
 */
settings.backend.badgesSave = async () => {
  let data = [];
  settings.elem.badgeAchievedSection.querySelectorAll('.config-badge').forEach((badge) => {
    data.push(badge.classList[1])
  })
  console.log(data)
  // TO DO: Post badge configuration

  settings.cacheUpdate('badges');
  // TO DO: update badge preview

}

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
  let userUpdate = {
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
    data = (await axios.post("/settings/update", { userUpdate }))["data"];
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
  let notificationUpdate = {
    newsletter: settings.elem.mailingInput.checked
  }
  // Validate input

  // Send update request
  let data;
  try {
    data = (await axios.post("/settings/update", { notificationUpdate }))["data"];
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

settings.backend.emailPassVerification = async () => {
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

  settings.elem.emailScreen.classList.add('on-step-two');
  settings.elem.emailScreen.classList.remove('on-step-one');
  settings.elem.emailScreen.querySelector('.continue-btn').classList.remove('unsaved-changes');
}