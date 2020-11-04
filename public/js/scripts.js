const modalOverlay = document.querySelector('.modal-overlay');

const cards = document.querySelectorAll('.card')

const modalContent = document.querySelector('.modal-content')


for (let card of cards) {
    card.addEventListener("click", function() {

        const recipeImage = card.querySelector(".card_image img")

        modalOverlay.classList.add("active")
        modalOverlay.querySelector('img').src = recipeImage.src
        modalContent.querySelector('.card_title p').textContent = card.querySelector('.card_title p').textContent
        modalContent.querySelector('.card_chef p').textContent = card.querySelector('.card_chef p').textContent

    })
}

document.querySelector(".close-modal").addEventListener("click", function () {
    modalOverlay.classList.remove("active")
})

modalOverlay.querySelector("img").src = ""