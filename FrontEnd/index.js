import { LogInOut } from "/assets/login.js"
LogInOut()


// Création de la gallerie

async function genererGallery() {

    let worksTableau = await fetch("http://localhost:5678/api/works")
        .then(worksTableau => worksTableau.json())

    for (let i = 0; i < worksTableau.length; i++) {

        let newWorks = document.querySelector(".gallery")
        let nouvelElementFigure = document.createElement("figure")
        newWorks.appendChild(nouvelElementFigure)
        nouvelElementFigure.setAttribute("data-category", worksTableau[i].categoryId)

        let nouvelElementImg = document.createElement("img")
        nouvelElementImg.src = worksTableau[i].imageUrl
        nouvelElementImg.alt = worksTableau[i].title
        nouvelElementFigure.appendChild(nouvelElementImg)

        let nouvelElementFigcaption = document.createElement("figcaption")
        nouvelElementFigcaption.innerHTML = worksTableau[i].title
        nouvelElementFigure.appendChild(nouvelElementFigcaption)
    }
}
genererGallery()


// Récupération du tableau de l'API pour les filtres

let categoriesTableau = await fetch("http://localhost:5678/api/categories")
    .then(categoriesTableau => categoriesTableau.json())

// Création des filtres

//Création du bouton filtre tous

let filtres = document.querySelector(".filtres")

let filtreTous = document.createElement("button")
filtreTous.innerHTML = "Tous"
filtres.appendChild(filtreTous)
filtreTous.id = "tous"

// Création des autres boutons de filtre 

for (let i = 0; i < categoriesTableau.length; i++) {

    let nouveauFiltre = document.createElement("button")
    nouveauFiltre.innerHTML = categoriesTableau[i].name
    filtres.appendChild(nouveauFiltre)
    nouveauFiltre.id = categoriesTableau[i].id
}

// Création du filtre tous

let boutonFilterTous = document.getElementById("tous")

boutonFilterTous.addEventListener("click", () => {
    document.querySelector(".gallery").innerHTML = ""
    genererGallery()
})

// Création des autres filtres 

for (let i = 0; i < categoriesTableau.length; i++) {

    let boutonFilter = document.getElementById(categoriesTableau[i].id)

    boutonFilter.addEventListener("click", () => {
        travauxFilter(boutonFilter)
    })
}

function travauxFilter(boutonFilter) {

    let figureFilter = document.querySelectorAll(".gallery figure")
    figureFilter.forEach(figure => {
        let figureCategory = figure.getAttribute("data-category")

        if (figureCategory === boutonFilter.id) {
            figure.style.display = "block"
        }
        else {
            figure.style.display = "none"
        }
    })
}


// Gestion du mode édition

if (localStorage.monToken) {

    //Gestion de la disparition des filtres

    let filtresEdition = document.querySelector(".filtres")
    filtresEdition.remove()

    //Création du bandeau en haut de page

    let bodyEdition = document.querySelector("body")
    let divEdition = document.createElement("div")
    let mainContainerEdition = document.querySelector(".main_container")

    bodyEdition.insertBefore(divEdition, mainContainerEdition)

    divEdition.classList.add("bandeau_edition")
    divEdition.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
                                <p>Mode Edition</p>`


    //Création du bouton d'édition des projets

    let editionProjets = document.querySelector(".projets_edition")
    let boutonEdition = document.createElement("div")

    editionProjets.appendChild(boutonEdition)
    boutonEdition.classList.add("bouton_edition")
    boutonEdition.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
                                    <p>Modifier</p>`


    // Création de la première modale

    let modal = document.querySelector("#modal")
    let boutonOpenModal = document.querySelector(".projets_edition")

    // Gestion de l'ouverture et fermeture de la modale

    boutonOpenModal.addEventListener("click", () => {
        modal.showModal()
    })

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close()
        }
    })

    // Fonction pour générer la première modale

    function modal1() {

        let modalContent = document.querySelector("#modal_content")
        let iconeCloseModal1 = document.createElement("i")
        modalContent.appendChild(iconeCloseModal1)
        iconeCloseModal1.classList.add("fa-solid", "fa-xmark", "close_modal")

        iconeCloseModal1.addEventListener("click", () => {
            modal.close()
        })

        let titreModal1 = document.createElement("h3")
        modalContent.appendChild(titreModal1)
        titreModal1.innerHTML = "Galerie photo"

        let divGalleryModal1 = document.createElement("div")
        modalContent.appendChild(divGalleryModal1)
        divGalleryModal1.id = "gallery_modal"

        let hrModal1 = document.createElement("hr")
        modalContent.appendChild(hrModal1)
        hrModal1.classList.add("hr_modal1")

        let buttonModal1 = document.createElement("button")
        modalContent.appendChild(buttonModal1)
        buttonModal1.type = "submit"
        buttonModal1.classList.add("ajout_photo")
        buttonModal1.innerText = "Ajouter une photo"

        // Ouverture de la nouvelle fenêtre modale

        buttonModal1.addEventListener("click", () => {
            modalContent.innerHTML = ""
            modal2()
        })

        genererGalleryModal()
    }
    modal1()


    // Ajout de la galerie photo dans la modale

    async function genererGalleryModal() {

        let worksTableau = await fetch("http://localhost:5678/api/works")
            .then(worksTableau => worksTableau.json())

        for (let i = 0; i < worksTableau.length; i++) {

            let galleryModal = document.querySelector("#gallery_modal")
            let nouvelleDiv = document.createElement("div")
            let nouvelElementImg = document.createElement("img")
            let nouvelleIconeTrash = document.createElement("i")

            nouvelElementImg.src = worksTableau[i].imageUrl
            nouvelElementImg.alt = worksTableau[i].title
            galleryModal.appendChild(nouvelleDiv)
            nouvelleDiv.appendChild(nouvelElementImg)
            nouvelleDiv.appendChild(nouvelleIconeTrash)
            nouvelleIconeTrash.classList.add("fa-solid", "fa-trash-can", "trash_modal")


            // Gestion de la suppression des travaux

            nouvelleIconeTrash.addEventListener("click", (event) => {
                event.preventDefault()

                let id = worksTableau[i].id
                deleteElement(id)
            })
        }
    }

    function deleteElement(id) {
        let token = localStorage.getItem("monToken")

        fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(data => mettreAJourPage(id))
    }

    function mettreAJourPage() {
        document.querySelector(".gallery").innerHTML = ""
        document.querySelector("#gallery_modal").innerHTML = ""
        genererGallery()
        genererGalleryModal()
    }


    // Création de la nouvelle fenêtre modale

    function modal2() {

        let modalContent = document.querySelector("#modal_content")

        let iconeBackModal2 = document.createElement("i")
        modalContent.appendChild(iconeBackModal2)
        iconeBackModal2.classList.add("fa-solid", "fa-arrow-left", "back_modal")

        // Gestion du retour sur la première modale

        iconeBackModal2.addEventListener("click", () => {
            modalContent.innerHTML = ""
            modal1()
        })

        // Création de l'icône de fermeture

        let iconeCloseModal2 = document.createElement("i")
        modalContent.appendChild(iconeCloseModal2)
        iconeCloseModal2.classList.add("fa-solid", "fa-xmark", "close_modal")

        iconeCloseModal2.addEventListener("click", () => {
            modal.close()
        })

        let titreModal2 = document.createElement("h3")
        modalContent.appendChild(titreModal2)
        titreModal2.innerHTML = "Ajout photo"

        // Création du formulaire

        let divModal2 = document.createElement("div")
        modalContent.appendChild(divModal2)

        let formModal2 = document.createElement("form")
        divModal2.appendChild(formModal2)
        formModal2.method = "POST"
        formModal2.enctype = "multipart/form-data"
        formModal2.id = "modal_form"

        // Création de la div d'ajout des photos

        let divPhotoModal2 = document.createElement("div")
        formModal2.appendChild(divPhotoModal2)
        divPhotoModal2.classList.add("div_ajout_photo")

        let iconeDivPhotoModal2 = document.createElement("i")
        divPhotoModal2.appendChild(iconeDivPhotoModal2)
        iconeDivPhotoModal2.classList.add("fa-regular", "fa-image", "icone_image")

        // Création du label et input pour les photos

        let photoFormModal2 = document.createElement("label")
        divPhotoModal2.appendChild(photoFormModal2)
        photoFormModal2.htmlFor = "photo"
        photoFormModal2.innerText = "+ Ajouter photo"
        photoFormModal2.classList.add("modal_label_photo")

        let inputPhotoFormModal2 = document.createElement("input")
        divPhotoModal2.appendChild(inputPhotoFormModal2)
        inputPhotoFormModal2.type = "file"
        inputPhotoFormModal2.name = "photo"
        inputPhotoFormModal2.id = "photo"
        inputPhotoFormModal2.required = true
        inputPhotoFormModal2.accept = "image/png, image/jpeg"
        inputPhotoFormModal2.classList.add("modal_input_photo")
        inputPhotoFormModal2.style.display = "none"

        let imgInputFormModal2 = document.createElement("img")
        divPhotoModal2.appendChild(imgInputFormModal2)
        imgInputFormModal2.id = "preview_img"
        imgInputFormModal2.style.display = "none"

        let pDivPhotoModal2 = document.createElement("p")
        divPhotoModal2.appendChild(pDivPhotoModal2)
        pDivPhotoModal2.innerText = "jpg, png : 4mo max"

        // Création du label et input titre

        let titreFormModal2 = document.createElement("label")
        formModal2.appendChild(titreFormModal2)
        titreFormModal2.htmlFor = "titre"
        titreFormModal2.innerText = "Titre"
        titreFormModal2.classList.add("modal_label")

        let inputTitreFormModal2 = document.createElement("input")
        formModal2.appendChild(inputTitreFormModal2)
        inputTitreFormModal2.type = "text"
        inputTitreFormModal2.name = "titre"
        inputTitreFormModal2.id = "titre"
        inputTitreFormModal2.required = true
        inputTitreFormModal2.classList.add("modal_input")

        // Création du label et input catégories

        let categorieFormModal2 = document.createElement("label")
        formModal2.appendChild(categorieFormModal2)
        categorieFormModal2.htmlFor = "select"
        categorieFormModal2.innerText = "Catégorie"
        categorieFormModal2.classList.add("modal_label")

        let inputCategorieFormModal2 = document.createElement("select")
        formModal2.appendChild(inputCategorieFormModal2)
        inputCategorieFormModal2.name = "select"
        inputCategorieFormModal2.id = "select"
        inputCategorieFormModal2.required = true
        inputCategorieFormModal2.classList.add("modal_input")

        let optionCategorieFormDefault = document.createElement("option")
        inputCategorieFormModal2.appendChild(optionCategorieFormDefault)
        optionCategorieFormDefault.value = "0"
        optionCategorieFormDefault.innerText = ""
        optionCategorieFormDefault.setAttribute("selected", "")

        for (let i = 0; i < categoriesTableau.length; i++) {
            let optionCategorieForm = document.createElement("option")
            inputCategorieFormModal2.appendChild(optionCategorieForm)
            optionCategorieForm.value = categoriesTableau[i].id
            optionCategorieForm.innerText = categoriesTableau[i].name
        }

        // Création du hr et du bouton d'envoi

        let hrModal2 = document.createElement("hr")
        formModal2.appendChild(hrModal2)

        let submitModal2 = document.createElement("input")
        formModal2.appendChild(submitModal2)
        submitModal2.type = "submit"
        submitModal2.value = "Valider"
        submitModal2.id = "valider_form"
        submitModal2.disabled = true


        // Gestion de l'ajout photo

        let preview = document.getElementById("preview_img")
        let pErreur = document.querySelector(".p_erreur")

        inputPhotoFormModal2.addEventListener("change", (event) => {
            event.preventDefault()

            //Validation de la taille de la photo

            let file = event.target.files[0]
            let size = event.target.files[0].size

            if (size > 4000000) {

                // Message d'erreur si la photo est trop volumineuse

                if (!pErreur) {
                    pErreur = document.createElement("p")
                    pErreur.classList.add("p_erreur")

                    formModal2.insertBefore(pErreur, titreFormModal2)
                }

                pErreur.innerHTML = "Fichier trop volumineux !"
            }
            else {

                // Preview photo

                if (event.target.files.length > 0) {

                    preview.src = URL.createObjectURL(event.target.files[0])

                    imgInputFormModal2.style.display = "block"
                    iconeDivPhotoModal2.style.display = "none"
                    photoFormModal2.style.display = "none"
                    pDivPhotoModal2.style.display = "none"
                    pErreur.style.display = "none"
                }
            }
        })

        //Activation du bouton d'envoi si le formulaire est correctement rempli   

        formModal2.addEventListener("change", (event) => {
            event.preventDefault()

            if (preview.src !== ""
                && inputTitreFormModal2.value !== ""
                && inputCategorieFormModal2.value !== "0") {

                submitModal2.disabled = false

                validerForm()
            }
            else {
                submitModal2.disabled = true
            }
        })


        // Envoi du formulaire

        function validerForm() {

            let formModal2 = document.getElementById("modal_form")

            formModal2.addEventListener("submit", (event) => {
                event.preventDefault()

                let token = localStorage.getItem("monToken")

                let image = document.getElementById("photo").files[0]
                let title = document.getElementById("titre").value
                let category = parseInt(document.getElementById("select").value)

                let formData = new FormData()
                formData.append("image", image)
                formData.append("title", title)
                formData.append("category", category)

                fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                })
                    .then(data => mettreAJourPage2())
            })
        }
    }

    function mettreAJourPage2() {
        document.getElementById("modal_content").innerHTML = ""
        document.querySelector(".gallery").innerHTML = ""
        modal1()
        genererGallery()
    }
}