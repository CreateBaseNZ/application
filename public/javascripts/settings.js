/* ==========================================================
VARIABLES
========================================================== */

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

  events: {
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

  fetch: undefined,
  accountSave: undefined,
  badgesSave: undefined,
  notificationsSave: undefined,
  profileSave: undefined,

  // TO DO: check if variables can be scoped as const
  badgeConfigScreen: document.querySelector('.badge-edit-screen'),
  badges: ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'], // temp
  cache: {},
  inputChanges: 0,
  pass: document.querySelector('#acc-pass'),
  passConf: document.querySelector('#acc-pass-conf'),
  profileSaveBtn: document.querySelector('.profile-save'),
  accountSaveBtn: document.querySelector('.account-save'),
  notificationsSaveBtn: document.querySelector('.notifications-save'),
  trophyCase: document.querySelector('.badges-container')
}

/* ==========================================================
INIT FUNCTIONS
========================================================== */

/**
 * Gets called on DOM load and initialises the Settings page. User data is fetched from backend to populate the page with relevant markup. Event listeners are attached and user data is cached. Session storage is checked for any references from the previous page.
 * 
 * | **Invokes**
 * | :func:`settings.fetch`, :func:`settings.init.loadBadges`, :func:`settings.init.attachAllListeners`, :func:`settings.init.cacheInit`, :func:`settings.init.sessionStorageCheck`
 */
settings.init.init = async () => {
  // Fetch data
  const data = await settings.fetch();
  // Validate incoming data
  if (data.status === "error") {
    console.log(data.content);
  } else if (data.status === "failed") {
    console.log(data.content);
  }
  // Load badges
  settings.init.loadBadges()
  // Populate fields
  settings.init.populate(data.content.account, data.content.user, data.content.notification);
  // Add event listeners
  settings.init.attachAllListeners()
  // Initialise SortableJS
  settings.init.sortableJSInit()
  // Cache data
  settings.init.cacheInit(data.content)
  // Check if coming from another page
  settings.init.sessionStorageCheck()
}

/**
 * Creates the badge elements in preview (Profile container) and on the badge configuration menu. Badges in preview are created in the order of the user-set configuration. Badges on the configuration menu are separated by achievement into the relevant containers. The badges that have been achieved are again sorted by the previous set configuration. Event listeners for the badges are also attached here.
 * 
 * | **Invokes**
 * | :func:`settings.events.badgeConfigToggle`
 * 
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.loadBadges = () => {

  for (var i = 0; i < 4; i++) {
    badge = settings.badges[i]
    var el = document.createElement('div');
    el.className = 'badge ' + badge;
    el.setAttribute('caption', badge);
    var img = document.createElement('img');
    img.src = '/public/images/badges/' + badge + '.png';
    el.appendChild(img);
    settings.trophyCase.appendChild(el);
  }

  settings.badges.forEach((badge, ind) => {
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
    ind < 4 ? document.querySelector('.badge-achieved-section').appendChild(el) : document.querySelector('.badge-not-achieved-section').appendChild(el)

    // badgeName is used in the badgeConfigToggle function
    input.badgeName = badge;
    input.addEventListener('change', settings.events.badgeConfigToggle);
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
  new Sortable(document.querySelector('.badge-achieved-section'), {
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
 * | :func:`global.inputs.checkChange`, :func:`settings.profileSave`, :func:`settings.accountSave`, :func:`settings.notificationsSave`, :func:`settings.badgesSave`, :func:`settings.profileCancel`, :func:`settings.accountCancel`, :func:`settings.notificationsCancel`, :func:`settings.badgesCancel`
 * 
 * | **Invoked by**
 * | :func:`settings.init.init`
 * 
 * @see `SortableJS <https://github.com/SortableJS/Sortable>`_
 */
settings.init.attachAllListeners = () => {
  // Show badge config screen
  settings.trophyCase.addEventListener('click', settings.badgeConfigMenuShow)
  // Toggle password visibility
  document.querySelector('#acc-pass-vis').addEventListener('click', settings.events.passVisToggle)
  // Toggle confirm password visibility
  document.querySelector('#acc-pass-conf-vis').addEventListener('click', settings.events.confirmPassVisToggle)
  // Check for changes in Profile inputs 
  document.querySelector('.profile-container').querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.profileInputsCheck)
  })
  // Check for changes in Account inputs
  document.querySelector('.acc-container').querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.accountInputsCheck)
  })
  // Check for changes in Notification inputs
  document.querySelector('.notifications-container').querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', settings.notificationsInputsCheck)
  })
  // Save Profile settings
  document.querySelector('.profile-save').addEventListener('click', settings.profileSave)
  // Cancel Profile settings
  document.querySelector('.profile-cancel').addEventListener('click', settings.profileCancel)
  // Cancel Profile settings (mobile)
  document.querySelector('.profile-container').querySelector('.back-to-main-sections').addEventListener('click', settings.events.profileCancelMobile)
  // Save Account settings
  document.querySelector('.account-save').addEventListener('click', settings.accountSave)
  // Cancel Account settings
  document.querySelector('.account-cancel').addEventListener('click', settings.accountCancel)
  // Cancel Account settings (mobile)
  document.querySelector('.acc-container').querySelector('.back-to-main-sections').addEventListener('click', settings.events.accountCancelMobile)
  // Save Notifications settings
  document.querySelector('.notifications-save').addEventListener('click', settings.notificationsSave)
  // Cancel Notifications settings
  document.querySelector('.notifications-cancel').addEventListener('click', settings.notificationsCancel)
  // Cancel Notifications settings (mobile)
  document.querySelector('.notifications-container').querySelector('.back-to-main-sections').addEventListener('click', settings.events.notificationsCancelMobile)
  // Saving badge configuration
  document.querySelector('.badge-config-done').addEventListener('click', settings.events.badgeConfigMenuSave)
  // Closing the badge configuration menu
  document.querySelector('.badge-config-close').addEventListener('click', settings.events.badgeConfigMenuCancel)
  // Escape key exits badge configuration menu
  document.addEventListener('keydown', settings.events.badgeConfigMenuEscape)
  // Enabling and exiting edit mode
  document.querySelectorAll('.section').forEach(function (section) {
    section.addEventListener('click', settings.events.sectionClick)
  })
  // Cancel button to go back to main sections (mobile only)
  document.querySelectorAll('.back-to-main-sections').forEach((btn) => {
    btn.addEventListener('click', settings.events.sectionCancelMobile)
  })
}

/**
 * Populates input fields with user settings.
 * 
 * | **Invoked by**
 * | :func:`settings.init.init`
 * 
 * @param {Object} account       - User account settings.
 * @param {Object} user          - User profile settings.
 * @param {Object} notification  - User notification settings.
 */
settings.init.populate = (account = {}, user = {}, notification = {}) => {
  // Profile
  document.querySelector("#prof-name").value = user.displayName ? user.displayName : "";
  document.querySelector("#prof-email").value = user.displayEmail ? user.displayName : "";
  document.querySelector("#prof-loc").value = user.location ? user.location : "";
  // Account
  document.querySelector("#acc-name").value = user.name;
  document.querySelector("#acc-email").value = account.email;
  document.querySelector("#acc-street").value = user.address.street ? user.address.street : "";
  document.querySelector("#acc-city").value = user.address.city ? user.address.city : "";
  document.querySelector("#acc-zip").value = user.address.postcode ? user.address.postcode : "";
  document.querySelector("#acc-unit").value = user.address.unit ? user.address.unit : "";
  document.querySelector("#acc-state").value = user.address.suburb ? user.address.suburb : "";
  document.querySelector("#acc-country").value = user.address.country ? user.address.country : "";
  // Notifications
  document.querySelector("#mail").checked = notification.newsletter;
}

/**
 * Initialises the cache with user data.
 * 
 * | **Invoked by**
 * | :func:`settings.init.init`
 */
settings.init.cacheInit = (data) => {
  settings.cache = {
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

/* ==========================================================
FRONT-END FUNCTIONS
========================================================== */

/**
 * TO DO
 */
settings.cacheUpdate = () => {
  // TO DO: update cache

}

/**
 * Reverts account to cached settings and hides the save button.
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`, :func:`settings.events.accountCancelMobile`
 * }
 */
settings.accountCancel = () => {
  // Revert to cached settings and hide save button
  document.querySelector('#acc-name').value = settings.cache.name;
  document.querySelector('#acc-email').value = settings.cache.email;
  document.querySelector('#acc-street').value = settings.cache.street;
  document.querySelector('#acc-unit').value = settings.cache.unit;
  document.querySelector('#acc-city').value = settings.cache.city;
  document.querySelector('#acc-state').value = settings.cache.state;
  document.querySelector('#acc-zip').value = settings.cache.zip;
  document.querySelector('#acc-country').value = settings.cache.country;
  document.querySelector('.account-save').classList.add('hide');
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
 * | :func:`settings.init.attachAllListeners`, :func:`settings.events.profileCancelMobile`
 * }
 */
settings.profileCancel = () => {
  // Revert to cached settings and hide save button
  document.querySelector('#prof-name').value = settings.cache.displayName;
  document.querySelector('#prof-email').value = settings.cache.displayEmail;
  document.querySelector('#prof-loc').value = settings.cache.location;
  document.querySelector('.profile-save').classList.add('hide');
}

/**
 * Reverts notifications to cached settings and hides the save button.
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`, :func:`settings.events.notificationsCancelMobile`
 * }
 */
settings.notificationsCancel = () => {
  // Revert to cached settings and hide save button
  document.querySelector('#mail').checked = settings.cache.mailing;
  document.querySelector('.notifications-save').classList.add('hide');
}

/**
 * Shows the configure badge menu when the preview badge container is clicked.
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`, :func:`settings.init.sessionStorageCheck`
 */
settings.badgeConfigMenuShow = () => {
  global.darkenOverlay.classList.add('desktop-show');
  settings.badgeConfigScreen.classList.remove('hide');
  document.querySelectorAll('.section').forEach((section) => {
    section.classList.add('mobile-hide');
  })
}

/**
 * Closes the badge configuration menu.
 * 
 * | **Invoked by**
 * | :func:`settings.events.badgeConfigMenuCancel`, :func:`settings.events.badgeConfigMenuEscape`, :func:`settings.events.badgeConfigMenuSave`
 */
settings.badgeConfigMenuClose = () => {
  global.darkenOverlay.classList.remove('desktop-show')
  settings.badgeConfigScreen.classList.add('hide');
  document.querySelector('.edit-mode').classList.remove('mobile-hide');
}

/**
 * Exits editing mode for ``selected`` and returns the user to the main Settings page if on mobile.
 * 
 * | **Invoked by**
 * | :func:`settings.events.badgeConfigMenuSave`, :func:`settings.init.attachAllListeners`, :func:`settings.events.sectionClick`, :func:`settings.events.sectionCancelMobile`
 * 
 * @param {Object} selected - A section container.
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
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * | **Invokes**
 * | :func:`global.inputs.checkChange`
 */
settings.profileInputsCheck = () => {
  const dict = {
    displayName: {
      value: document.querySelector('#prof-name').value,
      cache: settings.cache.displayName
    },
    displayEmail: {
      value: document.querySelector('#prof-email').value,
      cache: settings.cache.displayEmail
    },
    location: {
      value: document.querySelector('#prof-loc').value,
      cache: settings.cache.location
    }
  }
  global.inputs.checkChange(dict, settings.profileSaveBtn);
}

/**
 * Checks for changes in account settings.
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * | **Invokes**
 * | :func:`global.inputs.checkChange`
 */
settings.accountInputsCheck = () => {
  const dict = {
    name: {
      value: document.querySelector('#acc-name').value,
      cache: settings.cache.name
    },
    email: {
      value: document.querySelector('#acc-email').value,
      cache: settings.cache.email
    },
    street: {
      value: document.querySelector('#acc-street').value,
      cache: settings.cache.street
    },
    unit: {
      value: document.querySelector('#acc-unit').value,
      cache: settings.cache.unit
    },
    city: {
      value: document.querySelector('#acc-city').value,
      cache: settings.cache.city
    },
    state: {
      value: document.querySelector('#acc-state').value,
      cache: settings.cache.state
    },
    zip: {
      value: document.querySelector('#acc-zip').value,
      cache: settings.cache.zip
    },
    country: {
      value: document.querySelector('#acc-country').value,
      cache: settings.cache.country
    }
  }
  global.inputs.checkChange(dict, settings.accountSaveBtn);
}

/**
 * Checks for changes in notifications settings.
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * | **Invokes**
 * | :func:`global.inputs.checkChange`
 */
settings.notificationsInputsCheck = function() {
  const dict = {
    mailing: {
      value: document.querySelector('#mail').checked,
      cache: settings.cache.mailing
    }
  }
  global.inputs.checkChange(dict, settings.notificationsSaveBtn);
}

/* ==========================================================
EVENTS FUNCTIONS
========================================================== */

/**
 * Handles all clicks on a section. Clicking the cancel or save button exits edit mode. Clicking anywhere on a section enables edit mode, if not already enabled.
 * 
 * | **Invokes**
 * | :func:`settings.editModeExit`
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 * 
 * @param {Object} e - An event object.
 */
settings.events.sectionClick = function(e) {
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
 * | :func:`settings.profileCancel`, :func:`settings.editModeExit`
 * 
 * @param {Object} e - An event object.
 */
settings.events.profileCancelMobile = (e) => {
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
 * @param {Object} e - An event object.
 */
settings.events.accountCancelMobile = (e) => {
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
 * @param {Object} e - An event object.
 */
settings.events.notificationsCancelMobile = (e) => {
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
 * | :func:`settings.badgesSave`, :func:`settings.badgeConfigMenuClose`, :func:`settings.events.badgeConfigMenuSave`
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.events.badgeConfigMenuSave = () => {
  // Send badges to back-end
  settings.badgesSave();
  // Close the config menu
  settings.badgeConfigMenuClose();
  // Exit Profile edit mode
  settings.editModeExit(document.querySelector('profile-container'))
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
 * @param {Object} e - An event object.
 */
settings.events.badgeConfigMenuEscape = (e) => {
  if (e.key === 'Escape' && !settings.badgeConfigScreen.classList.contains('hide')) {
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
settings.events.badgeConfigMenuCancel = () => {
  // TO DO: revert to cached badge configuration

  settings.badgeConfigMenuClose();
}

/**
 * Toggles password visibility.
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.events.passVisToggle = function() {
  const type = settings.pass.getAttribute('type') === 'password' ? 'text' : 'password';
  settings.pass.setAttribute('type', type);
  this.classList.toggle('visible');
}

/**
 * Toggles confirm password visibility.
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.events.confirmPassVisToggle = function() {
  const type = settings.passConf.getAttribute('type') === 'password' ? 'text' : 'password';
  settings.passConf.setAttribute('type', type);
  this.classList.toggle('visible');
}

/**
 * Focuses the configuration badge being selected and shows the respective badge details. Also unfocus the previously selected badge (if any).
 * 
 * | **Invoked by**
 * | :func:`settings.init.loadBadges`
 */
settings.events.badgeConfigToggle = function() {
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


/* ==========================================================
BACKEND REQUEST
========================================================== */

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
settings.fetch = () => {
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
settings.profileSave = async () => {
  // Collect input
  let userUpdate = {
    displayName: document.querySelector("#prof-name").value,
    displayEmail: document.querySelector("#prof-email").value,
    location: document.querySelector("#prof-loc").value
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
  // Success handler
  settings.cacheUpdate();
  return;
}

/**
 * Posts badge configuration to the database. If successful, the local cache and preview badges are updated.
 * 
 * | **Invokes**
 * | :func:`axios.post`, :func:`settings.cacheUpdate`
 * 
 * | **Invoked by**
 * | :func:`settings.init.attachAllListeners`
 */
settings.badgesSave = async () => {
  let data = [];
  document.querySelector('.badge-achieved-section').querySelectorAll('.config-badge').forEach((badge) => {
    data.push(badge.classList[1])
  })
  console.log(data)
  // TO DO: Post badge configuration

  settings.cacheUpdate();
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
settings.accountSave = async () => {
  // Collect input
  let userUpdate = {
    name: document.querySelector("#acc-name").value,
    address: {
      unit: document.querySelector("#acc-unit").value,
      street: document.querySelector("#acc-street").value,
      suburb: document.querySelector("#acc-state").value,
      city: document.querySelector("#acc-city").value,
      postcode: document.querySelector("#acc-zip").value,
      country: document.querySelector("#acc-country").value
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
  // Success handler
  settings.cacheUpdate();
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
settings.notificationsSave = async () => {
  // Collect input
  let notificationUpdate = {
    newsletter: document.querySelector("#mail").checked
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
  // Success handler
  settings.cacheUpdate();
  return;
}