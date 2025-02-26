// Active menu
document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".header__nav-link")
    let currentPath = window.location.pathname

    links.forEach(link => {
        if (link.getAttribute("href") === currentPath || link.href === window.location.href) {
            link.classList.add("active")
        }
    })
})
// End Active menu


// menuToggler
let menuToggler = document.getElementById("menuToggler")
let nav = document.getElementById("nav")

menuToggler.addEventListener("click", () => { // Alterna iconos
    nav.classList.toggle("header__nav--active") // toggle -> si está la clase la elimina, si no está la añade
    menuToggler.classList.toggle("header__toggler--active")
});
// End menuToggler