let darkmode = localStorage.getItem('darkmode')
const themeswitch = document.getElementById('theme-switch')

const enabledarkmode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'avtive')
}
const disabledarkmode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
}


if (darkmode === "active") enabledarkmode()
themeswitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active"? enabledarkmode() : disabledarkmode() 
})