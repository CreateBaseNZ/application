/* ==========================================================
VARIABLES
========================================================== */

let global = {
  createProjectCard: undefined,

  elem: {
    darkenOverlay: document.querySelector('.darken-overlay'),
    inboxTab: document.querySelector('.inbox-tab'),
    moreMenu: document.querySelector('.nav-more-menu'),
    moreMenuBtn: document.querySelector('.more-tab')
  },

  event: {
    darkenOverlayClick: undefined,
    enterKeyPress: undefined,
    moreMenuClick: undefined,
    navMoreHide: undefined
  },

  init: {
    init: undefined,
    navInit: undefined,
    unreadStatus: undefined
  },

  input: {
    checkChange: undefined
  },

  var: {
    confettiConfig: {
      angle: 0,
      spread: 90,
      startVelocity: 20,
      elementCount: 20,
      width: "10px",
      height: "10px",
      perspective: "200px",
      colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
      duration: 2000,
      stagger: 3,
      dragFriction: 0.12,
      random: Math.random
    }
  }
}

/* ==========================================================
FUNCTIONS
========================================================== */

/**
 * Initialises global functions.
 * 
 * | **Invokes**
 * | :func:`global.init.navInit`, :func:`global.init.unreadStatus`
 */
global.init.init = () => {
  global.init.navInit();
  global.init.unreadStatus();
}

/**
 * Initialises the navigation system. Toggles the ``active-tab`` and ``active-more-tab`` classes on relevant tabs. Attaches event listeners.
 * 
 * | **Invokes**
 * | :func:`global.event.moreMenuClick`, :func:`global.event.darkenOverlayClick`, :func:`global.event.navMoreHide`
 * 
 * | **Invoked by**
 * | :func:`global.init.init`
 */
global.init.navInit = () => {
  const route = window.location.pathname.split('/')[1]
  document.querySelectorAll('.' + route + '-tab').forEach((tab) => {
    tab.classList.add('active-tab');
  })
  if (document.querySelector('.more-' + route)) {
    document.querySelector('.more-' + route).classList.add('active-more-tab');
  }

  global.elem.moreMenuBtn.addEventListener('click', global.event.moreMenuClick);

  global.elem.darkenOverlay.addEventListener('click', global.event.darkenOverlayClick);

  document.querySelector('.nav-more-close').addEventListener('click', global.event.navMoreHide);
}

/**
 * Creates a project card.
 * 
 * | **Invoked by**
 * | TO DO
 * 
 * @param {Object} parentContainer  Project card container.
 * @param {Object} size             Card size, can be ``small`` or ``large``.
 * @param {Object} project          Project details.
 */
global.createProjectCard = (parentContainer, size, project) => {
  // Project tags
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
  tagsContainer.addEventListener('wheel', function(e) {
    this.scrollLeft += e.deltaY * 0.25;
  })
  card.appendChild(tagsContainer)
  // Top right icons
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
  // Name, about, current task
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
  // Large progress number
  var number = document.createElement('div')
  number.className = 'progress-number'
  number.innerHTML = project.progress * 100 + '%'
  card.appendChild(number)
  // Progress bar
  var bar = document.createElement('div')
  bar.className = 'progress-bar'
  bar.style.width = project.progress * 100 + '%'
  card.appendChild(bar)
  parentContainer.appendChild(card)
  // Confetti
  if (project.status === 'completed') card.addEventListener('mouseenter', () => confetti(card, global.var.confettiConfig))
}

/**
 * Listens for ``Enter`` keypress on ``input`` and executes ``func``.
 * 
 * | **Invoked by**
 * | TO DO
 * 
 * @param {Object} input  Input element.
 * @param {Object} func   Function that is executed on ``Enter`` keypress.
 */
global.event.enterKeyPress = (input, func) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      func()
    }
  })
}


/**
 * Toggles view for navigation menu on mobile.
 * 
 * | **Invoked by**
 * | :func:`global.init.navInit`
 * 
 * @param {Object} e  Event object.
 */
global.event.moreMenuClick = function(e) {
  e.preventDefault();
  global.elem.darkenOverlay.classList.toggle('hide-overlay');
  global.elem.moreMenu.classList.toggle('hide');
  this.querySelector('input').checked = !this.querySelector('input').checked;
}

/**
 * Hides navigation menu on mobile.
 * 
 * | **Invoked by**
 * | :func:`global.init.navInit`
 * 
 * @param {Object} e  Event object.
 */
global.event.darkenOverlayClick = () => {
  if (!global.elem.moreMenu.classList.contains('hide')) {
    global.event.navMoreHide();
  }
}

/**
 * Hides navigation menu on mobile.
 * 
 * | **Invoked by**
 * | :func:`global.init.navInit`
 * 
 * @param {Object} e  Event object.
 */
global.event.navMoreHide = () => {
  global.elem.moreMenu.classList.add('hide');
  global.elem.darkenOverlay.classList.add('hide-overlay');
  global.elem.moreMenuBtn.querySelector('input').checked = false;
}

/**
 * Sets the unread messages flag on Inbox tab.
 * 
 * | **Invokes**
 * | :func:`axios.post`
 * 
 * | **Invoked by**
 * | :func:`global.init.init`
 */
global.init.unreadStatus = async () => {
  // Fetch data
  let data;
  try {
    data = (await axios.post("/notifications-unread"))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // Validate data
  if (data.status === "failed") {
    return console.log(data.content);
  } else if (data.status === "error") {
    return console.log(data.content);
  }
  // Execute actions
  if (data.content) {
    global.elem.inboxTab.classList.add("unread");
  } else {
    global.elem.inboxTab.classList.remove("unread");
  }
}

/**
 * Compares a group of input values with cached values. If any values within a group do not match with the corresponding cached value, the ``hide`` class is added to ``btn``. Otherwise, if no matches, the ``hide`` class is removed from ``btn``.
 * 
 * | **Invoked by**
 * | TO DO
 */
global.input.checkChange = (dict, btn) => {
  for (var key in dict) {
    // If any unmatched, show save button and return
    if (dict[key].value !== dict[key].cache) {
      btn.classList.remove('hide');
      return;
    }
    // Otherwise, no changes - hide save button
    btn.classList.add('hide');
  }
}