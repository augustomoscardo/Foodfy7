// ESCONDER E MOSTRAR CONTEÚDO
const showHideBtns = document.querySelectorAll('h4')

const recipes = document.querySelector('.recipes')


const instructions = document.querySelector('.instructions')


function addShowHideBtns() {
    if (!showHideBtns.length) return

    for (let showHide of showHideBtns) {
        showHide.addEventListener("click", function(){

            

            const currentInstructions = showHide.getAttribute('data-alvo');
            const target = document.querySelector(`.${currentInstructions}`)
            const targetInstructions = target.querySelector('.instructions')
            const targetButton = target.querySelector('.topic h4')

            targetInstructions.classList.toggle('hidden')
            
            if (targetInstructions.classList.contains('hidden')) {
                // instructions.classList.remove('hidden')
                targetButton.textContent = 'MOSTRAR'
            }   else {
                // instructions.classList.add('hidden')
                targetButton.textContent = 'ESCONDER'
            }
        })
    }
}

addShowHideBtns()

// Opção ensinada pelo Victor

// for (let btn of showHideBtns) {
//     btn.addEventListener("click", function(e) { 
 
//         const instructions = document.querySelector(`.${e.target.alvo} .instructions`)

//         if (instructions.classList.contains('hidden')) {
//             instructions.classList.remove('hidden')
//             e.target.textContent = 'ESCONDER'
//             return
//         }
//         instructions.classList.add('hidden')
//         e.target.textContent = 'MOSTRAR'
//    })
// }