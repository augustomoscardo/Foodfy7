// Adicionar ingredient e preparação

function addIngredient() {


    const ingredients = document.querySelector("#ingredients");

    // ingredients.innerHTML += `
    // <div class="ingredient">
    //     <input type="text"
    //     name="ingredients[]"  
    //     value=""
    //     placeholder="Ingrediente"
    //     >
    // </div>
    // `
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
}
  
document
.querySelector(".add-ingredient")
.addEventListener("click", addIngredient);


function addPreparation() {
    const preparation = document.querySelector("#preparation");
    const fieldContainer = document.querySelectorAll(".preparation");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
    console.log(newField.value)
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    preparation.appendChild(newField);
}

document
.querySelector(".add-preparation")
.addEventListener("click", addPreparation);