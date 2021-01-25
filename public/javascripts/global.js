/* ==========================================================
VARIABLES
========================================================== */

let global = {
  confettiConfig: undefined,
  createProjectCard: undefined,
  enterKeyPress: undefined,
  initialise: undefined,
  navInit: undefined,
  unreadStatus: undefined,

  darkenOverlay: document.querySelector('.darken-overlay')
}

/* ==========================================================
FUNCTIONS
========================================================== */

global.initialise = () => {
  global.navInit();
  global.unreadStatus();
}

global.navInit = () => {
  const route = window.location.pathname.split('/')[1]
  document.querySelectorAll('.' + route + '-tab').forEach((tab) => {
    tab.classList.add('active-tab')
  })
  if (document.querySelector('.more-' + route)) {
    document.querySelector('.more-' + route).classList.add('active-more-tab')
  }

  const moreMenu = document.querySelector('.nav-more-menu')
  const moreMenuBtn = document.querySelector('.more-tab')

  moreMenuBtn.addEventListener('click', function(e) {
    e.preventDefault()
    global.darkenOverlay.classList.toggle('hide')
    moreMenu.classList.toggle('hide')
    this.querySelector('input').checked = !this.querySelector('input').checked
  })

  global.darkenOverlay.addEventListener('click', function() {
    if (!moreMenu.classList.contains('hide')) {
      moreMenu.classList.add('hide')
      document.querySelector('.darken-overlay').classList.add('hide')
      moreMenuBtn.querySelector('input').checked = false
    }
  })

  document.querySelector('.nav-more-close').addEventListener('click', () => {
    moreMenu.classList.add('hide')
    document.querySelector('.darken-overlay').classList.add('hide')
    moreMenuBtn.querySelector('input').checked = false
  })
}

global.createProjectCard = (parentContainer, size, project) => {

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

  if (project.status === 'completed') card.addEventListener('mouseenter', () => confetti(card, global.confettiConfig))
}

global.enterKeyPress = (input, func) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      func()
    }
  })
}

global.confettiConfig = {
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
};

global.unreadStatus = async () => {
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
    document.querySelector(".inbox-tab").classList.add("unread");
  } else {
    document.querySelector(".inbox-tab").classList.remove("unread");
  }
}

// Code inputs functionality
const form = document.querySelector('.input-form')
const inputs = form.querySelectorAll('.code-input')
const KEYBOARDS = {
  backspace: 8,
  arrowLeft: 37,
  arrowRight: 39,
}

function handleInput(e) {
  const input = e.target
  const nextInput = input.nextElementSibling
  if (nextInput && input.value) {
    nextInput.focus()
    if (nextInput.value) {
      nextInput.select()
    }
  }
}

function handlePaste(e) {
  e.preventDefault()
  const paste = e.clipboardData.getData('text')
  const pasteLength = paste.length
  console.log(pasteLength)
  inputs.forEach((input, i) => {
    input.value = paste[i] || ''
  })
  if (pasteLength > inputs.length){
    inputs[(inputs.length)-1].focus()
  } else {
    inputs[pasteLength-1].focus()
  }
}

function handleBackspace(e) { 
  const input = e.target
  const previousInput = e.target.previousElementSibling
  if (previousInput !== null){
    if (input.value) {
        input.value = ''
        return
      }
    input.previousElementSibling.focus()
  }  
}

function handleArrowLeft(e) {
  const previousInput = e.target.previousElementSibling
  if (!previousInput) return
  previousInput.focus()
}

function handleArrowRight(e) {
  const nextInput = e.target.nextElementSibling
  if (!nextInput) return
  nextInput.focus()
}

form.addEventListener('input', handleInput)
inputs[0].addEventListener('paste', handlePaste)

inputs.forEach(input => {
  input.addEventListener('focus', e => {
    setTimeout(() => {
      e.target.select()
    }, 0)
  })
  
  input.addEventListener('keydown', e => {
    switch(e.keyCode) {
      case KEYBOARDS.backspace:
        handleBackspace(e)
        break
      case KEYBOARDS.arrowLeft:
        handleArrowLeft(e)
        break
      case KEYBOARDS.arrowRight:
        handleArrowRight(e)
        break
      default:  
    }
  })
})

// disable control z - breaks inputs
document.onkeydown = function(e) {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
    }
  }

// Code input validation