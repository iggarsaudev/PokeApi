let salida = ""

// Construimos el menú
const header = document.getElementById("header")

salida = `
    <div class="header__logo">
        <img src="../img/logo.png" alt="Logo PokeApi" class="logo">
    </div>

    <nav id="nav" class="header__nav">
    <ul class="header__nav-list">
        <li class="header__nav-item">
        <a href="../index.html" id="menuHome" class="header__nav-link active"
            >Home</a
        >
        </li>

        <li class="header__nav-item">
        <a
            href="pages/ahorcado.html"
            id="menuAhorcado"
            class="header__nav-link"
            >Ahorcado</a
        >
        </li>

        <li class="header__nav-item">
        <a href="pages/outlet.html" id="menuOutlet" class="header__nav-link"
            >Outlet</a
        >
        </li>

        <li class="header__nav-item">
        <a
            href="pages/contact.html"
            id="menuContact"
            class="header__nav-link"
            >Contact</a
        >
        </li>

        <li class="header__nav-item">
        <a
            href="pages/reviews.html"
            id="menuReviews"
            class="header__nav-link"
            >Reviews</a
        >
        </li>
    </ul>
    </nav>

    <button id="menuToggler" class="header__toggler">
    <span
        class="header__toggler-icon header__toggler-icon--menu material-symbols-outlined"
        >menu</span
    >
    <span
        class="header__toggler-icon header__toggler-icon--close material-symbols-outlined"
        >close</span
    >
    </button>
`

header.innerHTML = salida

// Construimos el footer
const footer = document.getElementById("footer")

salida = `
    <p class="footer__info">
        &copy; 2025 iggarsauDev
    </p>
`

footer.innerHTML = salida