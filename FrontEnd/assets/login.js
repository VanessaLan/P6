// Récupération du login/mdp

let form = document.querySelector("form")

form.addEventListener("submit", (event) => {
    event.preventDefault()

    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let user = {
        email: email,
        password: password
    }

    // Récupération du token d'authentification

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })

        .then(response => response.json())

        .then(data => {

            if (data.token) {
                localStorage.setItem("monToken", data.token)
                window.location.href = "../index.html"
            }
            else {

                // Gestion du message d'erreur du login

                let loginErreur = document.querySelector("#login")
                let mdp = document.querySelector("#mdp")
                let pErreur = document.querySelector(".p_erreur")

                if (!pErreur) {
                    pErreur = document.createElement("p")
                    pErreur.classList.add("p_erreur")
                    loginErreur.insertBefore(pErreur, mdp)
                }

                pErreur.innerHTML = "Erreur dans l’identifiant ou le mot de passe !"
            }
        })
})


// Gestion du LogIn et LogOut

export function LogInOut() {

    let loginNav = document.getElementById("login_nav")

    if (localStorage.monToken) {
        loginNav.innerText = "logout"
    }

    loginNav.addEventListener("click", (event) => {

        if (localStorage.monToken) {
            localStorage.removeItem("monToken")

            loginNav.innerText = "login"

            event.preventDefault()
            window.location.href = ""
        }
    })
}
LogInOut()