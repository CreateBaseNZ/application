/* ==========================================================
VARIABLES
========================================================== */

let inbox = {
  initialise: undefined,
  fetch: undefined,
  populate: undefined,
  summary: undefined,
  standard: undefined,
  time: undefined,
  date: undefined,
  sortInbox: undefined,
  sortArchive: undefined,
  sortBin: undefined,
  filterInbox: undefined,
  filterArchive: undefined,
  filterBin: undefined,
  open: undefined,
  openedInbox: undefined,
  openedArchive: undefined,
  openedBin: undefined,
  selectStatus: undefined,
  changeStatus: undefined,
  selectInbox: undefined,
  selectArchive: undefined,
  selectBin: undefined,
  selectAll: undefined,
  selectedStatus: "inbox",
  selectedInbox: [],
  selectedArchive: [],
  selectedBin: [],
  allInbox: [],
  allArchive: [],
  allBin: []
}

/* ==========================================================
FUNCTIONS
========================================================== */

inbox.initialise = async () => {
  // Global Initialisation
  global.init.init();
  const data = await inbox.fetch();
  // Validate incoming data
  if (data.status === "error") {
    return console.log(data.content);
  } else if (data.status === "failed") {
    return console.log(data.content);
  }
  // Filter notifications
  let inboxNotifications = data.content.filter(inbox.filterInbox);
  let archiveNotifications = data.content.filter(inbox.filterArchive);
  let binNotifications = data.content.filter(inbox.filterBin);
  inboxNotifications.sort(inbox.sortInbox);
  archiveNotifications.sort(inbox.sortArchive);
  binNotifications.sort(inbox.sortBin);
  // Populate inbox
  inbox.populate(inboxNotifications);
  inbox.populate(archiveNotifications);
  inbox.populate(binNotifications);
  // When initialisation is complete "unhide" the body element
  document.querySelector("body").classList.remove("hide");
}

inbox.fetch = () => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.post("/inbox"))["data"];
    } catch (error) {
      data = { status: "error", content: error };
    }
    return resolve(data);
  });
}

inbox.populate = (objects = []) => {
  // Date division
  let segments = {
    inbox: [],
    archive: [],
    bin: []
  };
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const momentNow = moment();
    let momentDate;
    switch (object.status) {
      case "inbox":
        momentDate = moment(object.date.inboxed);
        inbox.allInbox.push(object.id);
        break;
      case "archive":
        momentDate = moment(object.date.archived);
        inbox.allArchive.push(object.id);
        break;
      case "bin":
        momentDate = moment(object.date.binned);
        inbox.allBin.push(object.id);
        break;
      default: return console.log("Invalid notification type");
    }
    const difference = momentNow.dayOfYear() - momentDate.dayOfYear();
    let segment;
    // Check if inbox is the first among the status
    let open = false;
    if (segments[object.status].length === 0) open = true;
    if (difference < 7) {
      // Set the segment where the notification summary will be added
      if (difference === 0) {
        segment = "Today";
      } else {
        segment = momentDate.format("dddd");
      }
    } else {
      segment = momentDate.format("MMMM");
    }
    if (segments[object.status].indexOf(segment) === -1) {
      // Segment doesn't exist
      segments[object.status].push(segment);
      const segmentHTML = `<div id="date-group-${object.status}-${segment}" class="date-group"><p>${segment}</p></div>`;
      document.querySelector(`.notif-wrap-${object.status}`).insertAdjacentHTML("beforeend", segmentHTML);
    }
    const summary = inbox.summary(object);
    let detail;
    if (object.type === "standard") {
      detail = inbox.standard(object);
    }
    document.querySelector(`.notif-wrap-${object.status}`).insertAdjacentHTML("beforeend", summary);
    document.querySelector(`#${object.status}-detail-container`).insertAdjacentHTML("beforeend", detail);
    // Evaluate
    if (object.opened) document.querySelector(`#summary-${object._id}`).classList.add("non-active-notif");
    if (open) inbox.open(object._id, object.status);
  }
  // Success Handler
  return;
}

inbox.summary = (object = {}) => {
  // Create date
  let rawDate;
  switch (object.status) {
    case "inbox": rawDate = (object.date.inboxed); break;
    case "archive": rawDate = (object.date.archived); break;
    case "bin": rawDate = (object.date.binned); break;
    default: return console.log("Invalid notification type");
  }
  let date;
  if ((moment().dayOfYear() - moment(rawDate).dayOfYear()) < 7) {
    date = inbox.time(rawDate);
  } else {
    date = inbox.date(rawDate);
  }
  // Create notification summary
  const notification = `
  <div id="summary-${object._id}" class="single-notif-container">
    <div class="checkbox-container">
      <label class="checkbox path">
        <input type="checkbox" id="${object._id}-checkbox" class="selec-checkbox" name="select" value="${object._id}" onchange="inbox.selectInbox(this.value, this.checked);">
        <svg viewBox="0 0 21 21">
          <path
            d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186">
          </path>
        </svg>
      </label>
    </div>
    <div class="notif-dp">
      <img src="/public/images/logo.svg" alt="dp">
      <div class="dp-sub-icon">
        <i class="material-icons-outlined md-36 md-light">local_shipping</i>
      </div>
    </div>
    <div class="notif-content-container">
      <div class="notif-title-container">
        <div class="notif-title">${object.title}</div>
        <div class="notif-origin-date">
          <p class="date-text">${date}</p>
        </div>
      </div>
      <div class="contents-container">${object.message[0]}</div>
    </div>
  </div>
  `;
  return notification;
}

inbox.standard = (object = {}) => {
  // Create date
  let rawDate;
  switch (object.status) {
    case "inbox": rawDate = (object.date.inboxed); break;
    case "archive": rawDate = (object.date.archived); break;
    case "bin": rawDate = (object.date.binned); break;
    default: return console.log("Invalid notification type");
  }
  let date;
  if ((moment().dayOfYear() - moment(rawDate).dayOfYear()) < 7) {
    date = inbox.time(rawDate);
  } else {
    date = inbox.date(rawDate);
  }
  // Create body message
  let body = "";
  for (let i = 0; i < object.message.length; i++) {
    const element = object.message[i];
    body += `<p class="detail-content-p">${element}</p>`;
  }
  // Actions
  const inboxAction = { status: object.status, date: object.date.inboxed, id: object._id, newStatus: "inbox" };
  const archiveAction = { status: object.status, date: object.date.archived, id: object._id, newStatus: "archive" };
  const binAction = { status: object.status, date: object.date.binned, id: object._id, newStatus: "bin" };
  // Complete message
  const notification =
  `<div id="detail-${object._id}" class="detail-container hide">
    <div class="detail-header">
      <div class="header-text-container">
        <div class="detail-notif-title-container">
          <p class="detail-title-p">${object.title}</p>
          <div class="notif-info">
            <div class="info-container">
              <div class="detail-dp notif-dp">
                <img src="/public/images/logo.svg" alt="dp">
                <div class="dp-sub-icon">
                  <i class="material-icons-outlined md-36 md-light">local_shipping</i>
                </div>
              </div>
              <div class="detail-notif-origin">
                <p class="detail-date-text">${date}</p>
                <p class="tab-origin">Inbox</p>
              </div>
            </div>

            <div class="inbox-button-wrap">
              <div class="inbox-btn-container detail-btn-container">
                <p class="inbox-btn-title">Restore</p>
                <button class="inbox-btn icon-btn" onclick='inbox.changeStatus(${JSON.stringify(inboxAction)});'>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/></svg>
                </button>
              </div>
              <div class="archive-btn-container detail-btn-container">
                <p class="archive-btn-title">Archive</p>
                <button class="archive-btn icon-btn" onclick='inbox.changeStatus(${JSON.stringify(archiveAction)});'>              
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M20,2H4C3,2,2,2.9,2,4v3.01C2,7.73,2.43,8.35,3,8.7V20c0,1.1,1.1,2,2,2h14c0.9,0,2-0.9,2-2V8.7c0.57-0.35,1-0.97,1-1.69V4 C22,2.9,21,2,20,2z M19,20H5V9h14V20z M20,7H4V4h16V7z"/><rect height="2" width="6" x="9" y="12"/></g></g></svg>
                </button>
              </div>
              <div class="bin-btn-container detail-btn-container">
                <p class="bin-btn-title icon-btn">Delete</p>
                <button class="bin-btn icon-btn" onclick='inbox.changeStatus(${JSON.stringify(binAction)});'>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="divider"></div>
    <div class="detail-content-container scrollable">
      <div class="detail-contents-container scrollable">${body}</div>
    </div>
  </div>`
  return notification;
}

inbox.time = (date) => moment(date).format("hh:mma");

inbox.date = (date) => moment(date).format("DD MMM YY");

inbox.sortInbox = (notificationA, notificationB) => {
  const dateA = notificationA.date.inboxed;
  const dateB = notificationB.date.inboxed;
  const momentA = moment(dateA);
  const momentB = moment(dateB);
  const difference = momentA.diff(momentB);
  if (difference > 0) {
    return -1;
  } else if (difference < 0) {
    return 1;
  } else {
    return 0;
  }
}

inbox.sortArchive = (notificationA, notificationB) => {
  const dateA = notificationA.date.archived;
  const dateB = notificationB.date.archived;
  const momentA = moment(dateA);
  const momentB = moment(dateB);
  const difference = momentA.diff(momentB);
  if (difference > 0) {
    return -1;
  } else if (difference < 0) {
    return 1;
  } else {
    return 0;
  }
}

inbox.sortBin = (notificationA, notificationB) => {
  const dateA = notificationA.date.binned;
  const dateB = notificationB.date.binned;
  const momentA = moment(dateA);
  const momentB = moment(dateB);
  const difference = momentA.diff(momentB);
  if (difference > 0) {
    return -1;
  } else if (difference < 0) {
    return 1;
  } else {
    return 0;
  }
}

inbox.filterInbox = (notification) => notification.status === "inbox";

inbox.filterArchive = (notification) => notification.status === "archive";

inbox.filterBin = (notification) => notification.status === "bin";

inbox.open = async (id, status) => {
  // Update frontend
  document.querySelector(`#summary-${id}`).classList.add("selected-notif");
  document.querySelector(`#summary-${id}`).classList.remove("non-active-notif");
  document.querySelector(`#detail-${id}`).classList.remove("hide");
  if (status === "inbox" && inbox.openedInbox !== undefined) {
    document.querySelector(`#summary-${inbox.openedInbox}`).classList.remove("selected-notif");
    document.querySelector(`#summary-${inbox.openedInbox}`).classList.add("non-active-notif");
    document.querySelector(`#detail-${inbox.openedInbox}`).classList.add("hide");
    inbox.openedInbox = id;
  } else if (status === "archive" && inbox.openedArchive !== undefined) {
    document.querySelector(`#summary-${inbox.openedArchive}`).classList.remove("selected-notif");
    document.querySelector(`#summary-${inbox.openedArchive}`).classList.add("non-active-notif");
    document.querySelector(`#detail-${inbox.openedArchive}`).classList.add("hide");
    inbox.openedArchive = id;
  } else if (status === "bin" && inbox.openedBin !== undefined) {
    document.querySelector(`#summary-${inbox.openedBin}`).classList.remove("selected-notif");
    document.querySelector(`#summary-${inbox.openedBin}`).classList.add("non-active-notif");
    document.querySelector(`#detail-${inbox.openedBin}`).classList.add("hide");
    inbox.openedBin = id;
  }
  // Update backend
  let data;
  try {
    data = (await axios.post("/notification-opened", { id }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // Success handler
  return;
}

inbox.selectStatus = (status = "") => {
  if (status === "inbox") {
    document.querySelector(".inbox-btn").classList.add("active-inbox");
    document.querySelector(".archive-btn").classList.remove("active-archive");
    document.querySelector(".bin-btn").classList.remove("active-bin");
    document.querySelector(".notif-wrap-inbox").classList.remove("hide");
    document.querySelector(".notif-wrap-archive").classList.add("hide");
    document.querySelector(".notif-wrap-bin").classList.add("hide");
    document.querySelector("#inbox-detail-container").classList.remove("hide");
    document.querySelector("#archive-detail-container").classList.add("hide");
    document.querySelector("#bin-detail-container").classList.add("hide");
  } else if (status === "archive") {
    document.querySelector(".inbox-btn").classList.remove("active-inbox");
    document.querySelector(".archive-btn").classList.add("active-archive");
    document.querySelector(".bin-btn").classList.remove("active-bin");
    document.querySelector(".notif-wrap-inbox").classList.add("hide");
    document.querySelector(".notif-wrap-archive").classList.remove("hide");
    document.querySelector(".notif-wrap-bin").classList.add("hide");
    document.querySelector("#inbox-detail-container").classList.add("hide");
    document.querySelector("#archive-detail-container").classList.remove("hide");
    document.querySelector("#bin-detail-container").classList.add("hide");
  } else if (status === "bin") {
    document.querySelector(".inbox-btn").classList.remove("active-inbox");
    document.querySelector(".archive-btn").classList.remove("active-archive");
    document.querySelector(".bin-btn").classList.add("active-bin");
    document.querySelector(".notif-wrap-inbox").classList.add("hide");
    document.querySelector(".notif-wrap-archive").classList.add("hide");
    document.querySelector(".notif-wrap-bin").classList.remove("hide");
    document.querySelector("#inbox-detail-container").classList.add("hide");
    document.querySelector("#archive-detail-container").classList.add("hide");
    document.querySelector("#bin-detail-container").classList.remove("hide");
  }
  inbox.selectedStatus = status;
}

inbox.changeStatus = async (object = {}) => {
  // Check if there is a change in status
  if (object.status === object.newStatus) return;
  // Remove the notification from the status group
  document.querySelector(`#summary-${object.id}`).remove();
  document.querySelector(`#detail-${object.id}`).remove();
  // Update the notification in the backend to change its status
  let data;
  try {
    data = (await axios.post("/notification-change-status", { id: object.id, status: object.newStatus }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // Validate incoming data
  if (data.status === "error") {
    return console.log(data.content);
  } else if (data.status === "failed") {
    return console.log(data.content);
  }
  // Render the notification onto the correct status group
  const notification = data.content;
  const segment = "Today";
  let segmentHTML = `<div id="date-group-${notification.status}-${segment}" class="date-group"><p>${segment}</p></div>`;
  if (document.querySelector(`#date-group-${notification.status}-${segment}`)) {
    document.querySelector(`#date-group-${notification.status}-${segment}`).remove();
  }
  const summary = inbox.summary(notification);
  let detail;
  if (notification.type === "standard") {
    detail = inbox.standard(notification);
  }
  document.querySelector(`.notif-wrap-${notification.status}`).insertAdjacentHTML("afterbegin", summary);
  document.querySelector(`.notif-wrap-${notification.status}`).insertAdjacentHTML("afterbegin", segmentHTML);
  document.querySelector(`#${notification.status}-detail-container`).insertAdjacentHTML("afterbegin", detail);
  return;
}

inbox.selectAll = (select, type = "checkbox") => {
  if (inbox.selectedStatus === "inbox") {
    for (let i = 0; i < inbox.allInbox.length; i++) {
      const id = inbox.allInbox[i];
      inbox.selectInbox(id, select, "auto");
    }
  } else if (inbox.selectedStatus === "archive") {
    for (let i = 0; i < inbox.allArchive.length; i++) {
      const id = inbox.allArchive[i];
      inbox.selectInbox(id, select, "auto");
    }
  } else if (inbox.selectedStatus === "bin") {

  }
}

inbox.selectInbox = (id, select, type = "checkbox") => {
  if (type !== "checkbox") {
    document.querySelector(`#${id}-checkbox`).checked = select;
  }
  if (select) {
    if (selectedInbox.indexOf(id) === -1) {
      selectedInbox.push(id);
    }
  } else {
    if (selectedInbox.indexOf(id) !== -1) {
      selectedInbox.splice(0, 1, id);
    }
  }
}

/* ==========================================================
END
========================================================== */