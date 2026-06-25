let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active') // Speichert "active"
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', 'disabled') // KORRIGIERT: "disabled" statt null
}

// Prüfen, was beim Start geladen werden soll
if (darkmode === "active") {
  enableDarkmode()
}

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode')
  // Wenn es nicht aktiv ist, einschalten. Sonst ausschalten.
  if (darkmode !== "active") {
    enableDarkmode()
  } else {
    disableDarkmode()
  }
})