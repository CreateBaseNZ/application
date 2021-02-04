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
    accountCancelMobile: undefined,
    badgeConfigMenuCancel: undefined,
    badgeConfigMenuEscape: undefined,
    badgeConfigMenuSave: undefined,
    badgeConfigToggle: undefined,
    confirmPassVisToggle: undefined,
    notificationsCancelMobile: undefined,
    passVisToggle: undefined,
    profileCancelMobile: undefined,
    sectionClick: undefined,
  },

  accountCancel: undefined,
  accountInputsCheck: undefined,
  badgeConfigMenuClose: undefined,
  badgeConfigMenuShow: undefined,
  badgesCancel: undefined,
  cacheUpdate: undefined,
  editModeExit: undefined,
  notificationsCancel: undefined,
  notificationsInputsCheck: undefined,
  profileCancel: undefined,
  profileInputsCheck: undefined,
  sortableJSInit: undefined,

  backend: {
    fetch: undefined,
    accountSave: undefined,
    badgesSave: undefined,
    notificationsSave: undefined,
    profileSave: undefined,
  },
  
  var: {
    // temp
    badges: ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'], 
    cache: {},
  },
  
  elem: {
    badgeConfigScreen: document.querySelector('.badge-edit-screen'),
    badgePreviewContainer: document.querySelector('.badges-container'),
    accountSaveBtn: document.querySelector('.account-save'),
    notificationsSaveBtn: document.querySelector('.notifications-save'),
    profileSaveBtn: document.querySelector('.profile-save'),
    displayNameInput: document.querySelector('#prof-name'),
    displayEmailInput: document.querySelector('#prof-email'),
    locationInput: document.querySelector('#prof-loc'),
    nameInput: document.querySelector('#acc-name'),
    emailInput: document.querySelector('#acc-email'),
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
    passwordInput: document.querySelector('#acc-pass'),
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
 * | :func:`settings.backend.fetch`, :func:`settings.init.loadBadges`, :func:`settings.init.populate`, :func:`settings.init.attachAllListeners`, :func:`settings.init.sortableJSInit`, :func:`settings.init.cacheInit`, :func:`settings.init.sessionStorageCheck`
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
 * | :func:`settings.badgeConfigMenuShow`, :func:`settings.event.passVisToggle`, :func:`settings.event.confirmPassVisToggle`, :func:`settings.profileInputsCheck`, :func:`settings.accountInputsCheck`, :func:`settings.notificationsInputsCheck`, :func:`settings.backend.profileSave`, :func:`settings.profileCancel`, :func:`settings.event.profileCancelMobile`, :func:`settings.backend.accountSave`, :func:`settings.accountCancel`, :func:`settings.event.accountCancelMobile`, :func:`settings.backend.notificationsSave`, :func:`settings.notificationsCancel`, :func:`settings.event.notificationsCancelMobile`, :func:`settings.event.badgeConfigMenuSave`, :func:`settings.event.badgeConfigMenuCancel`, :func:`settings.event.badgeConfigMenuEscape`, :func:`settings.event.sectionClick`, :func:`settings.event.sectionCancelMobile`
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.attachAllListeners = () => {
  // Show badge config screen
  settings.elem.badgePreviewContainer.addEventListener('click', settings.badgeConfigMenuShow)
  // Toggle password visibility
  document.querySelector('#acc-pass-vis').addEventListener('click', settings.event.passVisToggle)
  // Toggle confirm password visibility
  document.querySelector('#acc-pass-conf-vis').addEventListener('click', settings.event.confirmPassVisToggle)
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
  // Save Profile settings
  settings.elem.profileSaveBtn.addEventListener('click', settings.backend.profileSave)
  // Cancel Profile settings
  document.querySelector('.profile-cancel').addEventListener('click', settings.profileCancel)
  // Cancel Profile settings (mobile)
  settings.elem.profileSection.querySelector('.back-to-main-sections').addEventListener('click', settings.event.profileCancelMobile)
  // Save Account settings
  settings.elem.accountSaveBtn.addEventListener('click', settings.backend.accountSave)
  // Cancel Account settings
  document.querySelector('.account-cancel').addEventListener('click', settings.accountCancel)
  // Cancel Account settings (mobile)
  settings.elem.accountSection.querySelector('.back-to-main-sections').addEventListener('click', settings.event.accountCancelMobile)
  // Save Notifications settings
  settings.elem.notificationsSaveBtn.addEventListener('click', settings.backend.notificationsSave)
  // Cancel Notifications settings
  document.querySelector('.notifications-cancel').addEventListener('click', settings.notificationsCancel)
  // Cancel Notifications settings (mobile)
  settings.elem.notificationsSection.querySelector('.back-to-main-sections').addEventListener('click', settings.event.notificationsCancelMobile)
  // Saving badge configuration
  document.querySelector('.badge-config-done').addEventListener('click', settings.event.badgeConfigMenuSave)
  // Closing the badge configuration menu
  document.querySelector('.badge-config-close').addEventListener('click', settings.event.badgeConfigMenuCancel)
  // Escape key exits badge configuration menu
  document.addEventListener('keydown', settings.event.badgeConfigMenuEscape)
  // Enabling and exiting edit mode
  document.querySelectorAll('.section').forEach(function (section) {
    section.addEventListener('click', settings.event.sectionClick)
  })
  // Cancel button to go back to main sections (mobile only)
  document.querySelectorAll('.back-to-main-sections').forEach((btn) => {
    btn.addEventListener('click', settings.event.sectionCancelMobile)
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
  settings.elem.emailInput.value = account.email;
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
    city: data.user.address.suburb,
    displayName: data.user.displayName,
    displayEmail: data.user.displayEmail,
    location: data.user.location,
    name: data.user.name,
    email: data.account.email,
    street: data.user.address.street,
    unit: data.user.address.unit,
    state: data.user.address.city,
    zip: data.user.address.postcode,
    country: data.user.address.country,
    mailing: data.notification.newsletter
  }
}

/**
 * Checks ``sessionStorage`` for references from previous page and styles the page accordingly; storage is cleared after.
 * 
 * | **Invokes**
 * | :func:`settings.badgeConfigMenuShow`
 *
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.sessionStorageCheck = () => {
  // Check if coming from Dashboard
  const badge = sessionStorage.getItem('dashboard')
  if (badge) {
    settings.badgeConfigMenuShow();
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
 * Reverts account to cached settings and hides the save button.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners` :func:`settings.event.accountCancelMobile`
 */
settings.accountCancel = () => {
  // Revert to cached settings and hide save button
  settings.elem.nameInput.value = settings.var.cache.name;
  settings.elem.emailInput.value = settings.var.cache.email;
  settings.elem.streetInput.value = settings.var.cache.street;
  settings.elem.unitInput.value = settings.var.cache.unit;
  settings.elem.cityInput.value = settings.var.cache.city;
  settings.elem.stateInput.value = settings.var.cache.state;
  settings.elem.zipInput.value = settings.var.cache.zip;
  settings.elem.countryInput.value = settings.var.cache.country;
  settings.elem.accountSaveBtn.classList.add('hide');
}

/**
 * TO DO
 */
settings.badgesCancel = () => {
  // TO DO: load cached badges data

}

/**
 * Reverts profile to cached settings and hides the save button.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.profileCancel = () => {
  // Revert to cached settings and hide save button
  settings.elem.displayNameInput.value = settings.var.cache.displayName;
  settings.elem.displayEmailInput.value = settings.var.cache.displayEmail;
  settings.elem.locationInput.value = settings.var.cache.location;
  settings.elem.profileSaveBtn.classList.add('hide');
}

/**
 * Reverts notifications to cached settings and hides the save button.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners` :func:`settings.event.notificationsCancelMobile`
 */
settings.notificationsCancel = () => {
  // Revert to cached settings and hide save button
  settings.elem.mailingInput.checked = settings.var.cache.mailing;
  settings.elem.notificationsSaveBtn.classList.add('hide');
}

/**
 * Shows the configure badge menu when the preview badge container is clicked.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners` :func:`settings.init.sessionStorageCheck`
 */
settings.badgeConfigMenuShow = () => {
  global.elem.darkenOverlay.classList.add('desktop-show');
  settings.elem.badgeConfigScreen.classList.remove('hide');
  document.querySelectorAll('.section').forEach((section) => {
    section.classList.add('mobile-hide');
  })
}

/**
 * Closes the badge configuration menu.
 *
 * | **Invoked by**
 * | :func:`settings.event.badgeConfigMenuSave` :func:`settings.event.badgeConfigMenuEscape` :func:`settings.event.badgeConfigMenuCancel`
 */
settings.badgeConfigMenuClose = () => {
  global.elem.darkenOverlay.classList.remove('desktop-show')
  settings.elem.badgeConfigScreen.classList.add('hide');
  document.querySelector('.edit-mode').classList.remove('mobile-hide');
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
  document.querySelectorAll('.section').forEach((section) => {
    section.classList.remove('mobile-hide');
  })
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
  global.input.checkChange(dict, settings.elem.profileSaveBtn);
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
  global.input.checkChange(dict, settings.elem.accountSaveBtn);
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
settings.notificationsInputsCheck = function() {
  const dict = {
    mailing: {
      value: settings.elem.mailingInput.checked,
      cache: settings.var.cache.mailing
    }
  }
  global.input.checkChange(dict, settings.elem.notificationsSaveBtn);
}

// ==========================================================
// EVENTS FUNCTIONS
// ==========================================================

/**
 * Handles all clicks on a section. Clicking the cancel or save button exits edit mode. Clicking anywhere on a section enables edit mode, if not already enabled.
 * 
 * | **Invokes**
 * | :func:`settings.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e An event object.
 */
settings.event.sectionClick = function(e) {
  if (e.target.classList.contains('save-btn') && this.classList.contains('edit-mode')) {
    // Save button - exit edit mode
    settings.editModeExit(this)
  } else if (e.target.classList.contains('cancel-btn') && this.classList.contains('edit-mode')) {
    // Cancel button - exit edit mode
    settings.editModeExit(this)
  } else if (!this.classList.contains('edit-mode')) {
    // Clicking anywhere else on the container enables edit mode if not already enabled
    document.querySelectorAll('.section-container').forEach((section) => {
      if (this === section) {
        this.classList.add('edit-mode')
        this.classList.remove('mobile-hide')
      } else {
        section.classList.add('mobile-hide')
      }
    })
  }
}

/**
 * Cancel button on mobile to go back to main Settings page.
 * 
 * | **Invokes**
 * | :func:`settings.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e An event object.
 */
settings.event.profileCancelMobile = (e) => {
  e.stopPropagation();
  // Revert to cached settings
  settings.profileCancel();
  // Leave edit mode (go back to main Settings page)
  settings.editModeExit(document.querySelector('.edit-mode'));
}

/**
 * Cancel button on mobile to go back to main Settings page.
 * 
 * | **Invokes**
 * | :func:`settings.accountCancel`, :func:`settings.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e An event object.
 */
settings.event.accountCancelMobile = (e) => {
  e.stopPropagation();
  // Revert to cached settings
  settings.accountCancel();
  // Leave edit mode (go back to main Settings page)
  settings.editModeExit(document.querySelector('.edit-mode'));
}

/**
 * Cancel button on mobile to go back to main Settings page.
 * 
 * | **Invokes**
 * | :func:`settings.notificationsCancel`, :func:`settings.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e An event object.
 */
settings.event.notificationsCancelMobile = (e) => {
  e.stopPropagation();
  // Revert to cached settings
  settings.notificationsCancel();
  // Leave edit mode (go back to main Settings page)
  settings.editModeExit(document.querySelector('.edit-mode'));
}

/**
 * Sends badge configuration to back-end, closes badge configuration menu, and exits Profile edit mode.
 * 
 * | **Invokes**
 * | :func:`settings.backend.badgesSave`, :func:`settings.badgeConfigMenuClose`, :func:`settings.event.editModeExit`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.badgeConfigMenuSave = () => {
  // Send badges to back-end
  settings.backend.badgesSave();
  // Close the config menu
  settings.badgeConfigMenuClose();
  // Exit Profile edit mode
  settings.editModeExit(settings.elem.profileSection)
}

/**
 * Closes the badge configuration menu if ``Esc`` key press. Also reverts to cached badge configuration.
 * 
 * | **Invokes**
 * | :func:`settings.badgeConfigMenuClose`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e An event object.
 */
settings.event.badgeConfigMenuEscape = (e) => {
  if (e.key === 'Escape' && !settings.elem.badgeConfigScreen.classList.contains('hide')) {
    // TO DO: revert to cached badge configuration

    settings.badgeConfigMenuClose();
  }
}

/**
 * Closes the badge configuration (when X button is clicked). Also reverts to cached badge configuration.
 * 
 * | **Invokes**
 * | :func:`settings.badgeConfigMenuClose`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.badgeConfigMenuCancel = () => {
  // TO DO: revert to cached badge configuration

  settings.badgeConfigMenuClose();
}

/**
 * Toggles password visibility.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.passVisToggle = function() {
  const type = settings.elem.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  settings.elem.passwordInput.setAttribute('type', type);
  this.classList.toggle('visible');
}

/**
 * Toggles confirm password visibility.
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.event.confirmPassVisToggle = function() {
  const type = settings.elem.passwordConfirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
  settings.elem.passwordConfirmInput.setAttribute('type', type);
  this.classList.toggle('visible');
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
 * | :func:`axios.post`, :func:`settings.cacheUpdate`
 *
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.backend.profileSave = async () => {
  // Collect input
  let input;
  const file = document.querySelector("#");
  if (file.files.length !== 0) {
    input = await global.compressImage("", "", 400);
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
  // Hide save button
  settings.elem.profileSaveBtn.classList.add('hide');
  return;
}

/**
 * Posts badge configuration to the database. If successful, the local cache and preview badges are updated.
 * 
 * | **Invokes**
 * | :func:`axios.post`, :func:`settings.cacheUpdate`
 *
 * | **Invoked by**
 * | :func:`settings.event.badgeConfigMenuSave`
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
 * | :func:`axios.post`, :func:`settings.cacheUpdate`
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
  // Hide save button
  settings.elem.accountSaveBtn.classList.add('hide');
  return;
}

/**
 * Posts mailing list changes to the database. If successful, the local cache is updated.
 * 
 * | **Invokes**
 * | :func:`axios.post`, :func:`settings.cacheUpdate`
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
  // Hide save button
  settings.elem.notificationsSaveBtn.classList.add('hide');
  return;
}