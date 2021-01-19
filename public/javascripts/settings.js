/* ==========================================================
VARIABLES
========================================================== */

let settings = {
  initialise: undefined,
  fetch: undefined,
  loadBadges: undefined,
  loadEventListeners: undefined,
  populate: undefined,
  saveProfile: undefined,
  saveAccount: undefined,
  saveNotification: undefined,
  temp: undefined,

  badgeConfigScreen: document.querySelector('.badge-edit-screen'),
  badges: ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'], // temp
  badges2: ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'], // temp
  badgeConfigClose: document.querySelector('.close-btn'),
  badgeConfigDone: document.querySelector('.done-btn'),
  badgeMenu: document.querySelector('.badge-menu'),
  darkenOverlay: document.querySelector('.darken-overlay'),
  pass: document.querySelector('#acc-pass'),
  passConf: document.querySelector('#acc-pass-conf'),
  passConfVis: document.querySelector('#acc-pass-conf-vis'),
  passVis: document.querySelector('#acc-pass-vis'),
  trophyCase: document.querySelector('.badges-container')
}

/* ==========================================================
FUNCTIONS
========================================================== */

settings.initialise = async () => {
  // Fetch data
  const data = await settings.fetch();
  // Validate incoming data
  if (data.status === "error") {
    console.log(data.content);
  } else if (data.status === "failed") {
    console.log(data.content);
  }
  // Load badges
  settings.loadBadges()
  // Add event listeners
  settings.loadEventListeners()
  // Populate fields
  // settings.populate(data.content.account, data.content.user);
}

settings.loadBadges = () => {
  for (var i = 0; i < 8; i++) {
    const rand = Math.floor(Math.random()*settings.badges.length); // temp
    const badge = settings.badges[rand];
    settings.badges.splice(rand, 1);
    var el = document.createElement('div');
    el.className = 'badge ' + badge;
    el.setAttribute('caption', badge);
    var img = document.createElement('img');
    img.src = '/public/images/badges/' + badge + '.png';
    el.appendChild(img);
    settings.trophyCase.appendChild(el);
  }

  settings.badges2.forEach((badge) => {
    var el = document.createElement('div');
    el.className = 'config-badge ' + badge;
    if (Math.random() > 0.5) el.classList.add('badge-achieved') // temp

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
      }
      if (this.checked) {
        document.querySelector('.' + badge + '-details').classList.add('badge-details-show')
      }
    })
    settings.badgeMenu.appendChild(el);
  })
}

settings.loadEventListeners = () => {
  settings.trophyCase.addEventListener('click', () => {
    settings.badgeConfigScreen.classList.toggle('hide')
    settings.darkenOverlay.classList.toggle('hide')
  })
  settings.passVis.addEventListener('click', function (e) {
    const type = settings.pass.getAttribute('type') === 'password' ? 'text' : 'password';
    settings.pass.setAttribute('type', type);
    this.classList.toggle('visible');
  })
  settings.passConfVis.addEventListener('click', function (e) {
    const type = settings.passConf.getAttribute('type') === 'password' ? 'text' : 'password';
    settings.passConf.setAttribute('type', type);
    this.classList.toggle('visible');
  })
  settings.badgeConfigDone.addEventListener('click', () => {
    // TO DO: update config
    settings.badgeConfigScreen.classList.toggle('hide');
    settings.darkenOverlay.classList.toggle('hide');
  })
  settings.badgeConfigClose.addEventListener('click', () => {
    // TO DO: revert to old config
    settings.badgeConfigScreen.classList.toggle('hide');
    settings.darkenOverlay.classList.toggle('hide');
  })
  document.querySelectorAll('.section').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target.classList.contains('save-btn') && this.classList.contains('edit-mode')) {
        // TO DO: save changes
        this.classList.toggle('edit-mode');
      } else if (e.target.classList.contains('cancel-btn') && this.classList.contains('edit-mode')) {
        // TO DO: revert to original
        this.classList.toggle('edit-mode');
      } else if (!this.classList.contains('edit-mode')) {
        // TO DO: enable edit mode
        this.classList.toggle('edit-mode');
      }
    })
  })
}

settings.populate = (account = {}, user = {}) => {
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
  document.querySelector("#mail").checked = account.subscription.newsletter;
}

/* ==========================================================
BACKEND REQUEST
========================================================== */

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
    data = (await axios.post("/settings/update", {userUpdate}));
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
  return;
}

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
    data = (await axios.post("/settings/update", {userUpdate}));
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
  return;
}