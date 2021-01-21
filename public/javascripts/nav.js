let nav = {
  initialise: undefined
}

nav.initialise = () => {
  const route = window.location.pathname.split('/')[1]
  document.querySelector('.' + route + '-tab').classList.add('active-tab')
}