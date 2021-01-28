/* ==========================================================
VARIABLES
========================================================== */

// const e = require("express");

let settings = {
  cancelAccount: undefined,
  cancelBadges: undefined,
  cancelNotifications: undefined,
  cancelProfile: undefined,
  fromPreviousPage: undefined,
  initCache: undefined,
  initialise: undefined,
  loadBadges: undefined,
  loadEventListeners: undefined,
  populate: undefined,
  updateCache: undefined,

  fetch: undefined,
  saveAccount: undefined,
  saveBadges: undefined,
  saveNotifications: undefined,
  saveProfile: undefined,

  // TO DO: check if variables can be scoped as const
  badgeConfigScreen: document.querySelector('.badge-edit-screen'),
  badges: ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'], // temp
  cache: undefined,
  pass: document.querySelector('#acc-pass'),
  passConf: document.querySelector('#acc-pass-conf'),
  profileSaveBtn: document.querySelector('.profile-save'),
  accountSaveBtn: document.querySelector('.account-save'),
  notificationsSaveBtn: document.querySelector('.notifications-save'),
  trophyCase: document.querySelector('.badges-container')
}

/* ==========================================================
FUNCTIONS
========================================================== */

/**
 * Gets called on DOM load and initialises the Settings page. User data is fetched from backend to populate the page with relevant markup. Event listeners are attached and user data is cached. Session storage is checked for any references from the previous page.
 * 
 * | **Invokes**
 * | :func:`settings.fetch`, :func:`settings.loadBadges`, :func:`settings.loadEventListeners`, :func:`settings.initCache`, :func:`settings.fromPreviousPage`
 */
settings.initialise = async () => {
  // Fetch data
  const data = await settings.fetch();
  // // Validate incoming data
  // if (data.status === "error") {
  //   console.log(data.content);
  // } else if (data.status === "failed") {
  //   console.log(data.content);
  // }
  // Load badges
  settings.loadBadges()
  // // Populate fields
  // settings.populate(data.content.account, data.content.user, data.content.notification);
  // Add event listeners
  settings.loadEventListeners()
  // Cache data
  settings.initCache()
  // Check if coming from another page
  settings.fromPreviousPage()
}

/**
 * TO DO: description
 * 
 * | **Invoked by**
 * | :func:`settings.initialise`
 */
settings.loadBadges = () => {

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
    input.addEventListener('change', function() {
      if (document.querySelector('.badge-details-show')) {
        document.querySelector('.badge-details-show').classList.remove('badge-details-show')
        document.querySelector('.badge-focus').classList.remove('badge-focus')
      }
      if (this.checked) {
        document.querySelector('.' + badge + '-details').classList.add('badge-details-show')
        document.querySelector('.config-badge.' + badge).classList.add('badge-focus')
      }
    })
    var i = document.createElement('i');
    i.className = "material-icons-round"
    i.innerHTML = 'drag_indicator'
    el.appendChild(i)
    // temp
    ind < 4 ? document.querySelector('.badge-achieved-section').appendChild(el) : document.querySelector('.badge-not-achieved-section').appendChild(el)
  })
}

/**
 * Attaches event listeners to all DOM objects.
 * 
 * | **Invokes**
 * | @see {@link https://github.com/SortableJS/Sortable}, :func:`inputGeneral.checkChange`, :func:`settings.saveProfile`, :func:`settings.saveAccount`, :func:`settings.saveNotifications`, :func:`settings.saveBadges`, :func:`settings.cancelProfile`, :func:`settings.cancelAccount`, :func:`settings.cancelNotifications`, :func:`settings.cancelBadges`
 * 
 * | **Invoked by**
 * | :func:`settings.initialise`
 * 
 * @see `SortableJS <https://github.com/SortableJS/Sortable>`_
 */
settings.loadEventListeners = () => {

  // Show badge config screen
  settings.trophyCase.addEventListener('click', () => {
    global.darkenOverlay.classList.add('desktop-show')
    settings.badgeConfigScreen.classList.remove('hide')
    document.querySelectorAll('.section').forEach((section) => {
      section.classList.add('mobile-hide')
    })
  })

  // Toggle password visibility
  document.querySelector('#acc-pass-vis').addEventListener('click', function (e) {
    const type = settings.pass.getAttribute('type') === 'password' ? 'text' : 'password';
    settings.pass.setAttribute('type', type);
    this.classList.toggle('visible');
  })

  // Toggle confirm password visibility
  document.querySelector('#acc-pass-conf-vis').addEventListener('click', function (e) {
    const type = settings.passConf.getAttribute('type') === 'password' ? 'text' : 'password';
    settings.passConf.setAttribute('type', type);
    this.classList.toggle('visible');
  })

  // Check for changes in Profile inputs 
  document.querySelector('.profile-container').querySelectorAll('.input-container').forEach((container) => {
    container.querySelector('input').addEventListener('input', function() {
      inputGeneral.checkChange(this.value, 'testing', settings.profileSaveBtn)
    })
  })

  // TO DO: check for changes in Account inputs
  
  // TO DO: check for changes in Notification inputs

  // Save Profile settings
  document.querySelector('.profile-save').addEventListener('click', () => {
    settings.saveProfile();
  })
  
  // Cancel Profile settings
  document.querySelector('.profile-cancel').addEventListener('click', () => {
    settings.cancelProfile();
  })

  // Save Account settings
  document.querySelector('.account-save').addEventListener('click', () => {
    settings.saveAccount();
  })
  
  // Cancel Account settings
  document.querySelector('.account-cancel').addEventListener('click', () => {
    settings.cancelAccount();
  })

  // Save Notifications settings
  document.querySelector('.notifications-save').addEventListener('click', () => {
    settings.saveNotifications();
  })
  
  // Cancel Notifications settings
  document.querySelector('.notifications-cancel').addEventListener('click', () => {
    settings.cancelNotifications();
  })

  // Saving badge configuration
  document.querySelector('.badge-config-done').addEventListener('click', () => {
    // TO DO: post new badge config
    settings.saveBadges()
    // TO DO: update badge preview
    // TO DO: update cache
    global.darkenOverlay.classList.remove('desktop-show')
    settings.badgeConfigScreen.classList.add('hide');
    document.querySelectorAll('.section').forEach((section) => {
      section.classList.remove('mobile-hide');
    })
    document.querySelector('.edit-mode').classList.remove('edit-mode')
  })

  // Closing the badge configuration menu
  document.querySelector('.badge-config-close').addEventListener('click', () => {
    // TO DO: revert to cached badge config
    global.darkenOverlay.classList.remove('desktop-show')
    settings.badgeConfigScreen.classList.add('hide');
    document.querySelector('.edit-mode').classList.remove('mobile-hide')
  })

  // Escape key exits badge configuration menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !settings.badgeConfigScreen.classList.contains('hide')) {
      global.darkenOverlay.classList.remove('desktop-show')
      settings.badgeConfigScreen.classList.add('hide');
      document.querySelector('.edit-mode').classList.remove('mobile-hide')
    }
  })

  // Enabling and exiting edit mode
  document.querySelectorAll('.section').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target.classList.contains('save-btn') && this.classList.contains('edit-mode')) {
        // Save button - exit edit mode
        this.classList.remove('edit-mode');
        document.querySelectorAll('.mobile-hide').forEach((section) => {
          section.classList.remove('mobile-hide')
        })
      } else if (e.target.classList.contains('cancel-btn') && this.classList.contains('edit-mode')) {
        // Cancel button - exit edit mode
        this.classList.remove('edit-mode');
        document.querySelectorAll('.mobile-hide').forEach((section) => {
          section.classList.remove('mobile-hide')
        })
      } else if (!this.classList.contains('edit-mode')) {
        // Clicking anywhere else on the container enables edit mode if not already enabled
        document.querySelectorAll('.section-container').forEach((section) => {
          el === section ? el.classList.add('edit-mode') : section.classList.add('mobile-hide')
        })
      }
    })
  })

  // Cancel button to go back to main sections (mobile only)
  document.querySelectorAll('.back-to-main-sections').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      // Leave edit mode
      document.querySelector('.edit-mode').classList.remove('edit-mode')
      // Show all the other sections
      document.querySelectorAll('.mobile-hide').forEach((section) => {
        section.classList.remove('mobile-hide')
      })
    })
  })

  // Drag and drop menu using SortableJS library
  new Sortable(document.querySelector('.badge-achieved-section'), {
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true,
    onStart: function (evt) {
      document.documentElement.classList.add("draggable-cursor");
    },
    onEnd: function (evt) {
      document.documentElement.classList.remove("draggable-cursor");
    }
  })
}

/**
 * Populates input fields with user settings.
 * 
 * @param {*} account 
 * @param {*} user 
 * @param {*} notification 
 * 
 * | **Invokes**
 * | :func:`settings.initialise`
 */
settings.populate = (account = {}, user = {}, notification = {}) => {
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
 * TO DO
 */
settings.initCache = () => {
  // TO DO: cache data coming in

}


/**
 * Checks ``sessionStorage`` for references from previous page and styles the page accordingly; cleared after.
 * 
 * | **Invoked by**
 * | :func:`settings.initialise`
 */
settings.fromPreviousPage = () => {
  // Check if coming from Dashboard
  const badge = sessionStorage.getItem('dashboard')
  if (badge) {
    // Display relevant badge
    settings.badgeConfigScreen.classList.toggle('hide')
    global.darkenOverlay.classList.toggle('hide')
    if (badge !== 'empty') {
      document.querySelector('.' + badge + '-details').classList.add('badge-details-show')
      document.querySelector('.config-badge.' + badge).classList.add('badge-focus')
    }
    // Clear storage
    sessionStorage.clear()
  }
}

/**
 * TO DO
 */
settings.updateCache = () => {
  // TO DO: update cache

}

/**
 * TO DO
 */
settings.cancelAccount = () => {
  // TO DO: load cached account data
  
}

/**
 * TO DO
 */
settings.cancelBadges = () => {
  // TO DO: load cached badges data

}

/**
 * TO DO
 */
settings.cancelProfile = () => {
  // TO DO: load cached profile data

}

/**
 * TO DO
 */
settings.cancelNotifications = () => {
  // TO DO: load cached notifications data

}



/* ==========================================================
BACKEND REQUEST
========================================================== */

/**
 * Fetches user data from the database.
 * 
 * @return {Promise} User data.
 * 
 * | **Invokes**
 * | :func:`axios.post`
 * 
 * | **Invoked by**
 * | :func:`settings.initialise`
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
 * | :func:`axios.post`, :func:`settings.updateCache`
 * 
 * | **Invoked by**
 * | :func:`settings.loadEventListeners`
 */
settings.saveProfile = async () => {
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
  settings.updateCache();
  return;
}

/**
 * Posts badge configuration to the database. If successful, the local cache is updated.
 * 
 * | **Invokes**
 * | :func:`axios.post`, :func:`settings.updateCache`
 * 
 * | **Invoked by**
 * | :func:`settings.loadEventListeners`
 */
settings.saveBadges = async () => {
  let data = [];
  document.querySelector('.badge-achieved-section').querySelectorAll('.config-badge').forEach((badge) => {
    data.push(badge.classList[1])
  })
  console.log(data)
  // TO DO: Post badge configuration
  settings.updateCache();
}

/**
 * Posts Account section changes to the database; these include the account name and location. If successful, the local cache is updated.
 * 
 * | **Invokes**
 * | :func:`axios.post`, :func:`settings.updateCache`
 * 
 * | **Invoked by**
 * | :func:`settings.loadEventListeners`
 */
settings.saveAccount = async () => {
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
  settings.updateCache();
  return;
}

/**
 * Posts mailing list changes to the database. If successful, the local cache is updated.
 * 
 * | **Invokes**
 * | :func:`axios.post`, :func:`settings.updateCache`
 * 
 * | **Invoked by**
 * | :func:`settings.loadEventListeners`
 */
settings.saveNotifications = async () => {
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
  settings.updateCache();
  return;
}