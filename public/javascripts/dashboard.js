/* ==========================================================
VARIABLES
========================================================== */

// const e = require("express");

let dashboard = {
  initialise: undefined,
  fetch: undefined,
  loadBadges: undefined,
  loadProjects: undefined,

  badges: ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'], // temp
  jekts: [{
    _id: '1',
    name: 'Machine Vision',
    rating: 4.8,
    about: 'Machine vision is the technology and methods used to provide imaging-based automatic inspection and analysis for such applications as automatic inspection, process control, and robot guidance, usually in industry',
    tags: ['Medium', 'AI', 'Signal Processing'],
    tasks: ['Introduction', 'Configuration', 'Lens Calibration'],
    colour: 'green'
  },
  {
    _id: '2',
    name: 'Bomb Defusal',
    rating: 4.9,
    about: 'Navigate through unfamiliar environments and identify the right wires to defuse',
    tags: ['Vehicles', 'Robotics', 'Wiring'],
    tasks: ['Lorem', 'Ipsum'],
    colour: 'orange'
  },
  {
    _id: '3',
    name: 'Sensors',
    rating: 4.7,
    about: 'Learn about a multitude of sensors, their capabilities, and use-cases',
    tags: ['Robotics'],
    tasks: ['Lorem', 'Ipsum'],
    colour: 'red'
  }
  ], // temp
  recentContainer: document.querySelector('.recent-container'),
  recomContainer: document.querySelector('.recom-container'),
  trophyCase: document.querySelector('.trophy-case')
}

/* ==========================================================
FUNCTIONS
========================================================== */

function Project(userProject) {
  this.id = userProject._id;
  this.status = userProject.status;
  this.progress = userProject.progress;
  this.jekt = dashboard.jekts.find(x => x._id === userProject.ref)
  this.name = this.jekt.name
  this.rating = this.jekt.rating
  this.about = this.jekt.about
  this.tags = this.jekt.tags
  this.current = this.jekt.tasks[userProject.current]
  this.colour = this.jekt.colour
}

// temp
const ongoingEx = {
  _id: 123456789,
  status: 'ongoing',
  progress: 0.5,
  ref: '1',
  current: 2,
}

// temp
const recomEx = {
  _id: 12345678,
  status: 'recom',
  progress: null,
  ref: '2',
  current: 0,
}

// temp
const completeEx = {
  _id: 1234567,
  status: 'completed',
  progress: 1,
  ref: '3',
  current: 1,
}


/* ==========================================================
FUNCTIONS
========================================================== */

dashboard.initialise = async () => {
  // Fetch data
  // const data = await dashboard.fetch();
  // Validate incoming data
  // if (data.status === "error") {
  //   console.log(data.content);
  // } else if (data.status === "failed") {
  //   console.log(data.content);
  // }
  // Load badges
  dashboard.loadBadges()
  // Load projects
  dashboard.loadProjects()
  // Populate fields
  // document.querySelector("#h1-name").innerHTML = data.content.user.displayName ? data.content.user.displayName : "";
  // When initialisation is complete "unhide" the body element
  document.querySelector("body").classList.remove("hide");
}

dashboard.loadBadges = () => {
  // TO DO: load badges
  for (var i = 0; i < 8; i++) {
    const rand = Math.floor(Math.random() * dashboard.badges.length);
    const badge = dashboard.badges[rand];
    dashboard.badges.splice(rand, 1);
    var el = document.createElement('div');
    el.className = 'badge db-badge ' + badge;
    var img = document.createElement('img');
    img.src = '/public/images/badges/' + badge + '.png';
    el.appendChild(img);
    var caption = document.createElement('span')
    caption.innerHTML = badge
    el.appendChild(caption)
    dashboard.trophyCase.appendChild(el);
    img.addEventListener('click', () => {
      sessionStorage.setItem('dashboard', badge)
      window.open('/settings', '_self')
    })
  }
}

dashboard.loadProjects = () => {
  // global.createProjectCard(dashboard.recentContainer, 'small', new Project(ongoingEx))
  global.createProjectCard(dashboard.recentContainer, 'small', new Project(completeEx))
  global.createProjectCard(dashboard.recomContainer, 'large', new Project(completeEx))
}

/* ==========================================================
BACKEND REQUESTS
========================================================== */

dashboard.fetch = () => {
  return new Promise(async (resolve, reject) => {
    // Fetch data
    let data;
    try {
      data = (await axios.post("/dashboard"))["data"];
    } catch (error) {
      data = { status: "error", content: error };
    }
    // Resolve incoming data
    return resolve(data);
  });
}