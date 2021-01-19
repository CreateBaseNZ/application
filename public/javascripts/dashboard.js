/* ==========================================================
VARIABLES
========================================================== */

let dashboard = {
  initialise: undefined,
  fetch: undefined
}

/* ==========================================================
FUNCTIONS
========================================================== */

const badges = ['trophy', 'medal', 'console', 'loyal', 'grad', 'love', 'review', 'tour', 'verified'];
const trophyCase = document.querySelector('.trophy-case');

for (var i = 0; i < 8; i++) {
  const rand = Math.floor(Math.random() * badges.length);
  const badge = badges[rand];
  badges.splice(rand, 1);
  var el = document.createElement('div');
  el.className = 'badge db-badge ' + badge;
  el.setAttribute('caption', badge);
  var img = document.createElement('img');
  img.src = '/public/images/badges/' + badge + '.png';
  el.appendChild(img);
  trophyCase.appendChild(el);
}

for (var i = 0; i < 4; i++) {
  const badge = 'empty';
  var el = document.createElement('a');
  el.href = '/settings';
  el.className = 'badge db-badge ' + badge;
  el.setAttribute('caption', badge);
  var img = document.createElement('img');
  img.src = '/public/images/badges/' + badge + '.png';
  el.appendChild(img);
  trophyCase.appendChild(el);
}

const recentContainer = document.querySelector('.recent-container');
const recomContainer = document.querySelector('.recom-container');


jekts = [{
  _id: 01,
  name: 'Machine Vision',
  rating: 4.8,
  about: 'Machine vision is the technology and methods used to provide imaging-based automatic inspection and analysis for such applications as automatic inspection, process control, and robot guidance, usually in industry',
  tags: ['Medium', 'AI', 'Signal Processing'],
  tasks: ['Introduction', 'Configuration', 'Lens Calibration'],
  colour: 'green'
},
{
  _id: 02,
  name: 'Bomb Defusal',
  rating: 4.9,
  about: 'Navigate through unfamiliar environments and identify the right wires to defuse',
  tags: ['Vehicles', 'Robotics', 'Wiring'],
  tasks: ['Lorem', 'Ipsum'],
  colour: 'orange'
},
{
  _id: 03,
  name: 'Sensors',
  rating: 4.7,
  about: 'Learn about a multitude of sensors, their capabilities, and use-cases',
  tags: ['Robotics'],
  tasks: ['Lorem', 'Ipsum'],
  colour: 'red'
}
]

function Project(userProject) {
  this.id = userProject._id;
  this.status = userProject.status;
  this.progress = userProject.progress;
  this.jekt = jekts.find(x => x._id === userProject.ref)
  this.name = this.jekt.name
  this.rating = this.jekt.rating
  this.about = this.jekt.about
  this.tags = this.jekt.tags
  this.current = this.jekt.tasks[userProject.current]
  this.colour = this.jekt.colour
}

const ongoingEx = {
  _id: 123456789,
  status: 'ongoing',
  progress: 0.5,
  ref: 01,
  current: 2,
}

const recomEx = {
  _id: 12345678,
  status: 'recom',
  progress: null,
  ref: 02,
  current: 0,
}

const completeEx = {
  _id: 1234567,
  status: 'completed',
  progress: 1,
  ref: 03,
  current: 1,
}

createProjectCard(recentContainer, 'small', new Project(ongoingEx))
createProjectCard(recentContainer, 'small', new Project(completeEx))
createProjectCard(recomContainer, 'large', new Project(recomEx))

function createProjectCard(parentContainer, size, project) {

  var card = document.createElement('div');
  card.className = 'project-card ' + project.status + ' ' + size + ' ' + project.colour
  var tagsContainer = document.createElement('div')
  tagsContainer.className = 'tags-container'
  var progressTag = document.createElement('div')
  progressTag.className = 'project-tag status-tag'
  var progressIcon = document.createElement('div')
  progressIcon.className = 'status-tag-icon'
  progressTag.appendChild(progressIcon)
  var progressSpan = document.createElement('span')
  progressSpan.innerHTML = project.progress * 100 + '%'
  progressTag.appendChild(progressSpan)
  tagsContainer.appendChild(progressTag)

  project.tags.forEach((tag) => {
    const tagEl = document.createElement('div')
    tagEl.className = 'project-tag'
    tagEl.innerHTML = tag
    tagsContainer.appendChild(tagEl)
  })

  card.appendChild(tagsContainer)

  var status = document.createElement('div')
  status.className = 'status-container'
  var lightbulb = document.createElement('i')
  lightbulb.className = 'material-icons-outlined recom-icon'
  lightbulb.innerHTML = 'lightbulb'
  status.appendChild(lightbulb)
  var trophyContainer = document.createElement('div')
  trophyContainer.className = 'trophy-container'
  var trophyBack = document.createElement('img')
  trophyBack.className = 'trophy-back'
  trophyBack.src = '/public/images/trophy.svg'
  trophyContainer.appendChild(trophyBack)
  var trophyFront = document.createElement('img')
  trophyFront.className = 'trophy-front'
  trophyFront.src = '/public/images/trophy.svg'
  trophyFront.style.height = project.progress * 100 + '%'
  trophyContainer.appendChild(trophyFront)
  status.appendChild(trophyContainer)
  card.appendChild(status)

  var info = document.createElement('div')
  info.className = 'project-info'
  var rating = document.createElement('div')
  rating.className = 'project-rating'
  var ratingSpan = document.createElement('span')
  ratingSpan.innerHTML = project.rating.toString()
  rating.appendChild(ratingSpan)
  var ratingIcon = document.createElement('i')
  ratingIcon.className = 'material-icons-round'
  ratingIcon.innerHTML = 'star'
  rating.appendChild(ratingIcon)
  info.appendChild(rating)
  var projectName = document.createElement('div')
  projectName.className = 'project-name'
  projectName.innerHTML = project.name
  info.appendChild(projectName)
  var about = document.createElement('div')
  about.className = 'project-about'
  about.innerHTML = project.about
  info.appendChild(about)
  var task = document.createElement('div')
  task.className = 'current-task'
  var taskSpan = document.createElement('span')
  taskSpan.innerHTML = project.current
  task.appendChild(taskSpan)
  var taskIcon = document.createElement('i')
  taskIcon.className = 'material-icons-round'
  taskIcon.innerHTML = 'arrow_forward'
  task.appendChild(taskIcon)
  info.appendChild(task)
  card.appendChild(info)

  var number = document.createElement('div')
  number.className = 'progress-number'
  number.innerHTML = project.progress * 100 + '%'
  card.appendChild(number)

  var bar = document.createElement('div')
  bar.className = 'progress-bar'
  bar.style.width = project.progress * 100 + '%'
  card.appendChild(bar)

  parentContainer.appendChild(card)
}

dashboard.initialise = async () => {
  // Fetch data
  const data = await dashboard.fetch();
  // Validate incoming data
  if (data.status === "error") {
    return console.log(data.content);
  } else if (data.status === "failed") {
    return console.log(data.content);
  }
  // Populate fields
  document.querySelector("#h1-name").innerHTML = data.content.user.displayName ? data.content.user.displayName : "";
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

// /* ========================================================================================
// VARIABLES
// ======================================================================================== */

// let dashboard = {
//   // VARIABLES
//   wrapper: undefined,
//   dpEl: undefined,
//   nameEl: undefined,
//   locationEl: undefined,
//   bioEl: undefined,
//   nameTemp: undefined,
//   bioTemp: undefined,
//   dpTemp: undefined,
//   locationTemp: undefined,
//   allDP: undefined,
//   // FUNCTIONS
//   initialise: undefined,
//   declareVariables: undefined,
//   addListener: undefined,
//   fetchDetails: undefined,
//   populateDetails: undefined,
//   previewImage: undefined,
//   saveDetails: undefined,
//   uploadPicture: undefined,
//   save: undefined,
//   renderProjects: undefined,
//   goToProject: undefined,
//   processOrders: undefined,
//   renderOrders: undefined,
//   goToOrder: undefined
// }

// /* ========================================================================================
// FUNCTIONS
// ======================================================================================== */

// // @func  dashboard.initialise
// // @desc  
// dashboard.initialise = async () => {
//   dashboard.declareVariables();
//   let customerInfo;
//   try {
//     customerInfo = await dashboard.fetchDetails();
//   } catch (empty) {
//     return;
//   }
//   dashboard.populateDetails(customerInfo);
//   dashboard.addListener();
//   let threeRecentProjects = profile.allProjects.filter(item => item.bookmark).slice(0, 3)
//   const projElements = document.getElementsByClassName('db-proj-item')
//   for (var i = 0; i < 3; i++) {
//     dashboard.renderProjects(threeRecentProjects[i], projElements[i], true)
//   }
//   if (threeRecentProjects.length) {
//     document.getElementById('db-proj-none').style.display = 'none'
//   } else {
//     document.getElementById('db-proj-none').style.display = 'block'
//   }
//   let tod = new Date()
//   document.getElementById('profile-today').innerHTML = 'Today is ' + tod.toLocaleString('default', { month: 'short' }) + ' ' + tod.getDate() + ' ' + tod.getFullYear()
// }

// // @func  dashboard.declareVariables
// // @desc  
// dashboard.declareVariables = () => {
//   dashboard.wrapper = document.querySelector('.db-profile-wrapper');
//   dashboard.dpEl = document.getElementById('profile-preview');
//   dashboard.nameEl = document.getElementById('profile-name');
//   dashboard.locationEl = document.getElementById('profile-location');
//   dashboard.bioEl = document.getElementById('profile-bio');
//   dashboard.allDP = [
//     document.getElementById('nav-dp'),
//     document.getElementById('nav-user-in'),
//     document.getElementById('nav-profile-img')
//   ];
// }

// // @func  dashboard.addListener
// // @desc  
// dashboard.addListener = () => {
//   // -- If edit --
//   document.getElementById('profile-edit-btn-mobile').addEventListener('click', () => {
//     dashboard.wrapper.classList.toggle('db-profile-wrapper-edit')
//   })
//   document.getElementById('profile-edit-btn-dsktp').addEventListener('click', () => {
//     dashboard.wrapper.classList.toggle('db-profile-wrapper-edit')
//   })

//   //  -- If save --
//   document.getElementById('profile-save-btn').addEventListener('click', async () => {
//     // Toggle off edit mode
//     dashboard.wrapper.classList.toggle('db-profile-wrapper-edit')

//     // Update profile pictures in nav bar
//     for (var i = 0; i < dashboard.allDP.length; i++) {
//       console.log(dashboard.allDP[i])
//       dashboard.allDP[i].src = dashboard.dpEl.src
//     }
//     // Save new variables
//     // dashboard.saveDetails();
//   })

//   // -- If cancel --
//   document.getElementById('profile-cancel-btn').addEventListener('click', () => {
//     // Revert all changes back to variables
//     dashboard.nameEl.innerHTML = dashboard.nameTemp
//     dashboard.bioEl.innerHTML = dashboard.bioTemp
//     dashboard.dpEl.src = dashboard.dpTemp
//     dashboard.wrapper.classList.toggle('db-profile-wrapper-edit')
//   })

//   document.getElementById('db-order-view').addEventListener('click', () => {
//     profile.setPage('orders')
//   })

//   document.getElementById('db-proj-view').addEventListener('click', () => {
//     profile.setPage('projects')
//   })

//   document.getElementById('db-email').addEventListener('click', () => {
//     settings.editEmail()
//     profile.setPage('settings')
//   })

//   document.getElementById('db-password').addEventListener('click', () => {
//     settings.editPassword()
//     profile.setPage('settings')
//   })

//   document.getElementById('db-subscription').addEventListener('click', () => {
//     profile.setPage('settings')
//   })

//   document.getElementById('db-address').addEventListener('click', () => {
//     settings.editAddress()
//     profile.setPage('settings')
//   })

//   document.getElementById('db-delete').addEventListener('click', () => {
//     profile.setPage('settings')
//   })
// }

// // @func  dashboard.fetchDetails
// // @desc  
// dashboard.fetchDetails = () => {
//   return new Promise(async (resolve, reject) => {
//     // -- Get customer info --
//     let data;
//     try {
//       data = (await axios.get("/profile/dashboard/fetch-details"))["data"];
//     } catch (error) {
//       data = { status: "error", content: error };
//     }
//     if (data.status === "error") {
//       // TO DO .....
//       // ERROR HANDLER
//       // TO DO .....
//       console.log(data.content); // TEMPORARY
//       return reject();
//     } else if (data.status === "failed") {
//       // TO DO .....
//       // FAILED HANDLER
//       // TO DO .....
//       console.log(data.content); // TEMPORARY
//       return reject();
//     }
//     // SUCCESS HANDLER
//     return resolve(data.content);
//   });
// }

// // @func  dashboard.populateDetails
// // @desc  
// dashboard.populateDetails = (customerInfo) => {
//   console.log(customerInfo)
//   dashboard.nameEl.innerHTML = customerInfo["displayName"];
//   dashboard.locationEl.innerHTML = customerInfo["address"]["city"] + ', ' + customerInfo["address"]["country"];
//   dashboard.bioEl.innerHTML = customerInfo["bio"];

//   // -- Update temp variables --
//   dashboard.nameTemp = dashboard.nameEl.innerHTML
//   dashboard.bioTemp = dashboard.bioEl.innerHTML
//   dashboard.dpTemp = dashboard.dpEl.src
//   // creation date
//   const date = moment(customerInfo.date.created).format("MMM YYYY");
//   document.querySelector("#profile-account-creation-date").innerHTML = date;
// }

// // @func  dashboard.previewImage
// dashboard.previewImage = (event) => {
//   console.log(event.target.files[0])
//   document.getElementById('profile-preview').src = URL.createObjectURL(event.target.files[0])
// }

// // @func  dashboard.saveDetails
// // @desc  
// dashboard.saveDetails = async () => {
//   // COLLECT DETAILS
//   const customerInfo = {
//     displayName: dashboard.nameEl.innerHTML,
//     bio: dashboard.bioEl.innerHTML
//   }

//   // SEND REQUEST
//   let data;
//   try {
//     data = (await axios.post("/profile/customer/update", customerInfo))
//   } catch (error) {
//     data = { status: "error", content: error };
//   }
//   if (data.status === "error") {
//     // TO DO .....
//     // ERROR HANDLER
//     // TO DO .....
//     console.log(data.content); // TEMPORARY
//     return;
//   } else if (data.status === "failed") {
//     // TO DO .....
//     // FAILED HANDLER
//     // TO DO .....
//     console.log(data.content); // TEMPORARY
//     return;
//   }

//   // -- Update temp variables --
//   dashboard.nameTemp = dashboard.nameEl.innerHTML
//   dashboard.bioTemp = dashboard.bioEl.innerHTML
//   dashboard.dpTemp = dashboard.dpEl.src;
// }

// // @func  dashboard.uploadPicture
// // @desc  
// dashboard.uploadPicture = async () => {
//   const file = new FormData(document.querySelector("#profile-pic"));
//   let data;
//   try {
//     data = (await axios.post("/profile/customer/update/picture", file))["data"];
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// }

// // @func  dashboard.save
// // @desc  
// dashboard.save = async () => {
//   // UPLOADED IMAGE
//   let input;
//   const file = document.getElementById("profile-upload");
//   if (file.files.length !== 0) {
//     input = await global.compressImage("profile-pic", "picture", 400);
//   } else {
//     input = new FormData();
//   }
//   // OTHER INPUTS
//   input.append("displayName", dashboard.nameEl.innerHTML);
//   input.append("bio", dashboard.bioEl.innerHTML);
//   // SUBMIT REQUEST
//   let data;
//   try {
//     data = (await axios.post("/profile/dashboard/save", input))["data"];
//   } catch (error) {
//     data = { status: "error", content: error };
//   }
//   // FAILED AND ERROR HANDLER
//   if (data.status === "failed") {
//     console.log(data.content);
//     return;
//   } else if (data.status === "error") {
//     console.log(data.content);
//     return;
//   }
//   // SUCCESS HANDLER
//   console.log(data.content);
//   // -- Update temp variables --
//   dashboard.nameTemp = dashboard.nameEl.innerHTML
//   dashboard.bioTemp = dashboard.bioEl.innerHTML
//   dashboard.dpTemp = dashboard.dpEl.src
//   return;
// }

// dashboard.renderProjects = (project, el, initialise) => {
//   if (project) {
//     el.style.visibility = 'visible'
//     el.setAttribute('onclick', `dashboard.goToProject('${project.id}');`)
//     el.id = project.id + '-db-proj'
//     el.querySelector('.db-proj-name').innerHTML = project.name
//     let makesEl = el.querySelector('.db-proj-makes')
//     if (initialise) {
//       el.querySelector('.db-proj-img').src = '/profile/projects/retrieve-thumbnail/' + project.id + '?' + new Date().getTime()
//       project.makes.forEach(function (make, j) {
//         if (makesEl.innerHTML !== '') {
//           makesEl.innerHTML += ', '
//         }
//         makesEl.innerHTML += make.file.name
//       })
//     } else {
//       el.querySelector('.db-proj-img').src = document.getElementById(project.id + '-proj-pop-wrapper').querySelector('.proj-pop-img').src
//       makesEl.innerHTML = project.allMakesString
//     }
//   } else {
//     el.style.visibility = 'hidden'
//   }
// }

// dashboard.goToProject = (id) => {
//   projects.showProjPop(id)
//   profile.setPage('projects')
// }

// dashboard.processOrders = (fetchedOrders) => {
//   let threeRecentOrders = fetchedOrders.slice(0, 3)
//   let orderElements = document.getElementsByClassName('db-order-item')
//   for (var i = 0; i < 3; i++) {
//     dashboard.renderOrders(threeRecentOrders[i], orderElements[i])
//   }
//   if (threeRecentOrders.length) {
//     document.getElementById('db-order-none').style.display = 'none'
//   } else {
//     document.getElementById('db-order-none').style.display = 'block'
//   }
// }

// dashboard.renderOrders = (order, el) => {
//   if (order) {
//     el.style.visibility = 'visible'
//     el.setAttribute('onclick', `dashboard.goToOrder('${order._id}');`)
//     el.id = order._id + '-db-order'
//     el.querySelector('.db-order-number').innerHTML = `Order #${order.number}`

//     let status
//     switch (order.status) {
//       case "checkedout": status = "Validating Payment"; break;
//       case "validated": status = "Building Order"; break;
//       case "built": status = "Packaging Order"; break;
//       case "reviewed": status = "Order Reviewed"; break;
//       case "completed": status = "Order Completed"; break;
//       case "cancelled": status = "Refunding Order"; break;
//       case "refunded": status = "Order Refunded"; break;
//       default: break;
//     }
//     if (order.shipping.method === "pickup") {
//       switch (order.status) {
//         case "shipped": status = "Ready for Pickup"; break;
//         case "arrived": status = "Package Picked Up"; break;
//         default: break;
//       }
//     } else {
//       switch (order.status) {
//         case "shipped": status = "Package Shipped"; break;
//         case "arrived": status = "Package Arrived"; break;
//         default: break;
//       }
//     }

//     el.querySelector('.db-order-delivery').querySelector('span').innerHTML = status

//     el.querySelector('.db-order-date').querySelector('span').innerHTML = orders.formatDate(order.date[order.status])
//     if (order.shipping.address.option === 'new') {
//       el.querySelector('.db-order-address').querySelector('span').innerHTML = `${order.shipping.address.new.city}, ${order.shipping.address.new.country}`
//     } else {
//       el.querySelector('.db-order-address').querySelector('span').innerHTML = `${order.shipping.address.saved.city}, ${order.shipping.address.saved.country}`
//     }
//     el.querySelector('.db-order-amount').innerHTML = `$${global.priceFormatter(order.payment.amount.total.total)}`

//     if (order.status === 'completed' || order.status === 'refunded') {
//       el.classList.add('db-order-past')
//     }
//   } else {
//     el.style.visibility = 'hidden'
//   }
// }

// dashboard.goToOrder = (id) => {
//   orders.selectOrder(id)
//   profile.setPage('orders')
// }

// /* ========================================================================================
// END
// ======================================================================================== */