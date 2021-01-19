/* ==========================================================
VARIABLES
========================================================== */

let settings = {
  initialise: undefined,
  fetch: undefined,
  populate: undefined,
  saveProfile: undefined,
  saveAccount: undefined,
  saveNotification: undefined
}

/* ==========================================================
FUNCTIONS
========================================================== */

settings.initialise = async () => {
  // Fetch data
  const data = await settings.fetch();
  // Validate incoming data
  if (data.status === "error") {
    return console.log(data.content);
  } else if (data.status === "failed") {
    return console.log(data.content);
  }
  // Populate fields
  settings.populate(data.content.account, data.content.user);
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