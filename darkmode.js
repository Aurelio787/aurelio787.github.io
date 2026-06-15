let darkmode = localStorage.getItem('darkmode')
const themeswitch = document.getElementById('theme-switch')

const enabledarkmode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'avtive')
}
const disabledarkmode
themeswitch.addEventListener("click", () => {
    darkmode !== "active"? enabledarkmode() : disabledarkmode() 
})