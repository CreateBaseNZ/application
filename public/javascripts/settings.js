/* ==========================================================
VARIABLES
========================================================== */

// const e = require("express");

let settings = {
  cacheData: undefined,
  cancelAccount: undefined,
  cancelBadges: undefined,
  cancelNotifications: undefined,
  cancelProfile: undefined,
  fromPreviousPage: undefined,
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
 * Reduces a sequence of names to initials.
 * @param  {String} name  Space Delimited sequence of names.
 * @param  {String} sep   A period separating the initials.
 * @param  {String} trail A period ending the initials.
 * @param  {String} hyph  A hypen separating double names.
 * @return {String}       Properly formatted initials.
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
  settings.cacheData()
  // Check if coming from another page
  settings.fromPreviousPage()
}

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
 * Reduces a sequence of names to initials.
 * @param  {String} name  Space Delimited sequence of names.
 * @param  {String} sep   A period separating the initials.
 * @param  {String} trail A period ending the initials.
 * @param  {String} hyph  A hypen separating double names.
 * @return {String}       Properly formatted initials.
 */
settings.loadEventListeners = () => {

  settings.trophyCase.addEventListener('click', () => {
    // Show badge config screen
    global.darkenOverlay.classList.add('desktop-show')
    settings.badgeConfigScreen.classList.remove('hide')
    document.querySelectorAll('.section').forEach((section) => {
      section.classList.add('mobile-hide')
    })
  })

  document.querySelector('#acc-pass-vis').addEventListener('click', function (e) {
    // Toggle password visibility
    const type = settings.pass.getAttribute('type') === 'password' ? 'text' : 'password';
    settings.pass.setAttribute('type', type);
    this.classList.toggle('visible');
  })

  document.querySelector('#acc-pass-conf-vis').addEventListener('click', function (e) {
    // Toggle confirm password visibility
    const type = settings.passConf.getAttribute('type') === 'password' ? 'text' : 'password';
    settings.passConf.setAttribute('type', type);
    this.classList.toggle('visible');
  })

  document.querySelector('.profile-container').querySelectorAll('.input-container').forEach((container) => {
    container.querySelector('input').addEventListener('input', function() {
      inputGeneral.checkChange(this.value, 'testing', settings.profileSaveBtn)
    })
  })

  document.querySelector('.profile-save').addEventListener('click', () => {
    // Save Profile settings and update cache
    settings.saveProfile();
  })
  
  document.querySelector('.profile-cancel').addEventListener('click', () => {
    // Cancel Profile settings
    settings.cancelProfile();
  })

  document.querySelector('.account-save').addEventListener('click', () => {
    // Save Account settings
    settings.saveAccount();
  })
  
  document.querySelector('.account-cancel').addEventListener('click', () => {
    // Cancel Account settings
    settings.cancelAccount();
  })

  document.querySelector('.notifications-save').addEventListener('click', () => {
    // Save Notifications settings
    settings.saveNotifications();
  })
  
  document.querySelector('.notifications-cancel').addEventListener('click', () => {
    // Cancel Notifications settings
    settings.cancelNotifications();
  })

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

  document.querySelector('.badge-config-close').addEventListener('click', () => {
    // TO DO: revert to cached badge config
    global.darkenOverlay.classList.remove('desktop-show')
    settings.badgeConfigScreen.classList.add('hide');
    document.querySelector('.edit-mode').classList.remove('mobile-hide')
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !settings.badgeConfigScreen.classList.contains('hide')) {
      global.darkenOverlay.classList.remove('desktop-show')
      settings.badgeConfigScreen.classList.add('hide');
      document.querySelector('.edit-mode').classList.remove('mobile-hide')
    }
  })

  document.querySelectorAll('.section').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target.classList.contains('save-btn') && this.classList.contains('edit-mode')) {
        // Save button - exit edit mode
        this.classList.remove('edit-mode');
        document.querySelectorAll('.mobile-hide').forEach((section) => {
          section.classList.remove('mobile-hide')
        })
      } else if (e.target.classList.contains('cancel-btn') && this.classList.contains('edit-mode')) {
        // Cancel button - disable edit mode
        this.classList.remove('edit-mode');
        document.querySelectorAll('.mobile-hide').forEach((section) => {
          section.classList.remove('mobile-hide')
        })
      } else if (!this.classList.contains('edit-mode')) {
        document.querySelectorAll('.section-container').forEach((section) => {
          el === section ? el.classList.add('edit-mode') : section.classList.add('mobile-hide')
        })
      }
    })
  })

  // Cancel button to go back to main sections
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

// TO DO: cache data coming in
settings.cacheData = () => {

}

// Load styles 
settings.fromPreviousPage = () => {
  const badge = sessionStorage.getItem('dashboard')
  if (badge) {
    settings.badgeConfigScreen.classList.toggle('hide')
    global.darkenOverlay.classList.toggle('hide')
    if (badge !== 'empty') {
      document.querySelector('.' + badge + '-details').classList.add('badge-details-show')
      document.querySelector('.config-badge.' + badge).classList.add('badge-focus')
    }
    sessionStorage.clear()
  }
}

// TO DO: update cache
settings.updateCache = () => {

}

// TO DO: load cached account data
settings.cancelAccount = () => {
  
}

// TO DO: load cached badges data
settings.cancelBadges = () => {

}

// TO DO: load cached profile data
settings.cancelProfile = () => {

}

// TO DO: load cached notifications data
settings.cancelNotifications = () => {

}



/* ==========================================================
BACKEND REQUEST
========================================================== */

/**
 * Reduces a sequence of names to initials.
 * @param  {String} name  Space Delimited sequence of names.
 * @param  {String} sep   A period separating the initials.
 * @param  {String} trail A period ending the initials.
 * @param  {String} hyph  A hypen separating double names.
 * @return {String}       Properly formatted initials.
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
 * Reduces a sequence of names to initials.
 * @param  {String} name  Space Delimited sequence of names.
 * @param  {String} sep   A period separating the initials.
 * @param  {String} trail A period ending the initials.
 * @param  {String} hyph  A hypen separating double names.
 * @return {String}       Properly formatted initials.
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
 * Reduces a sequence of names to initials.
 * @param  {String} name  Space Delimited sequence of names.
 * @param  {String} sep   A period separating the initials.
 * @param  {String} trail A period ending the initials.
 * @param  {String} hyph  A hypen separating double names.
 * @return {String}       Properly formatted initials.
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
 * Reduces a sequence of names to initials.
 * @param  {String} name  Space Delimited sequence of names.
 * @param  {String} sep   A period separating the initials.
 * @param  {String} trail A period ending the initials.
 * @param  {String} hyph  A hypen separating double names.
 * @return {String}       Properly formatted initials.
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