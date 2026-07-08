// Dark-Mode-Umschalter für die ganze Seite
document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("theme-switch");
    if (!themeSwitch) return;

    // Gespeicherte Auswahl wiederherstellen
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("darkmode");
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener("change", () => {
        const isDark = themeSwitch.checked;
        document.body.classList.toggle("darkmode", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
});
