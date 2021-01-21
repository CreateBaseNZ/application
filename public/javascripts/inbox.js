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
  sort: undefined,
  open: undefined,
  openedInbox: undefined,
  openedArchive: undefined,
  openedBin: undefined,
  selectStatus: undefined,
  changeStatus: undefined
}

/* ==========================================================
FUNCTIONS
========================================================== */

inbox.initialise = async () => {
  const data = await inbox.fetch();
  // Validate incoming data
  if (data.status === "error") {
    return console.log(data.content);
  } else if (data.status === "failed") {
    return console.log(data.content);
  }
  // Populate inbox
  inbox.populate(data.content);
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
    const momentDate = moment(object.date);
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
    document.querySelector(`#date-group-${object.status}-${segment}`).insertAdjacentHTML("beforeend", summary);
    document.querySelector(`.${object.status}-detail-container`).insertAdjacentHTML("beforeend", detail);
    // Evaluate
    if (object.opened) document.querySelector(`#summary-${object._id}`).classList.add("non-active-notif");
    if (open) inbox.open(object._id, object.status);
  }
  // Success Handler
  return;
}

inbox.summary = (object = {}) => {
  // Create date
  let date;
  if ((moment().dayOfYear() - moment(object.date).dayOfYear()) < 7) {
    date = inbox.time(object.date);
  } else {
    date = inbox.date(object.date);
  }
  // Create notification summary
  const notification = `
  <div id="summary-${object._id}" class="single-notif-container">
    <div class="checkbox-container">
      <label class="checkbox path">
        <input type="checkbox" class="selec-checkbox" name="select">
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
  let date;
  if ((moment().dayOfYear() - moment(object.date).dayOfYear()) < 7) {
    date = inbox.time(object.date);
  } else {
    date = inbox.date(object.date);
  }
  // Create body message
  let body = "";
  for (let i = 0; i < object.message.length; i++) {
    const element = object.message[i];
    body += `<p class="detail-content-p">${element}</p>`;
  }
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
                <button class="inbox-btn icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/></svg>
                </button>
              </div>
              <div class="archive-btn-container detail-btn-container">
                <p class="archive-btn-title">Archive</p>
                <button class="archive-btn icon-btn">              
                  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M20,2H4C3,2,2,2.9,2,4v3.01C2,7.73,2.43,8.35,3,8.7V20c0,1.1,1.1,2,2,2h14c0.9,0,2-0.9,2-2V8.7c0.57-0.35,1-0.97,1-1.69V4 C22,2.9,21,2,20,2z M19,20H5V9h14V20z M20,7H4V4h16V7z"/><rect height="2" width="6" x="9" y="12"/></g></g></svg>
                </button>
              </div>
              <div class="bin-btn-container detail-btn-container">
                <p class="bin-btn-title icon-btn">Delete</p>
                <button class="bin-btn icon-btn">
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

inbox.sort = (notificationA, notificationB) => {
  const dateA = notificationA.date;
  const dateB = notificationB.date;
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
    document.querySelector(".inbox-detail-container").classList.remove("hide");
    document.querySelector(".archive-detail-container").classList.add("hide");
    document.querySelector(".bin-detail-container").classList.add("hide");
  } else if (status === "archive") {
    document.querySelector(".inbox-btn").classList.remove("active-inbox");
    document.querySelector(".archive-btn").classList.add("active-archive");
    document.querySelector(".bin-btn").classList.remove("active-bin");
    document.querySelector(".notif-wrap-inbox").classList.add("hide");
    document.querySelector(".notif-wrap-archive").classList.remove("hide");
    document.querySelector(".notif-wrap-bin").classList.add("hide");
    document.querySelector(".inbox-detail-container").classList.add("hide");
    document.querySelector(".archive-detail-container").classList.remove("hide");
    document.querySelector(".bin-detail-container").classList.add("hide");
  } else if (status === "bin") {
    document.querySelector(".inbox-btn").classList.remove("active-inbox");
    document.querySelector(".archive-btn").classList.remove("active-archive");
    document.querySelector(".bin-btn").classList.add("active-bin");
    document.querySelector(".notif-wrap-inbox").classList.add("hide");
    document.querySelector(".notif-wrap-archive").classList.add("hide");
    document.querySelector(".notif-wrap-bin").classList.remove("hide");
    document.querySelector(".inbox-detail-container").classList.add("hide");
    document.querySelector(".archive-detail-container").classList.add("hide");
    document.querySelector(".bin-detail-container").classList.remove("hide");
  }
}

inbox.changeStatus = (object = {}) => {

}

/* ==========================================================
END
========================================================== */