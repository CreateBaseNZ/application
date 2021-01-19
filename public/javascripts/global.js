let global = {
  createProjectCard: undefined,
  enterKeyPress: undefined
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

global.enterKeyPress = (input, func) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      func()
    }
  })
}