// Deep Shah
// August 19th, 2022
// Utilized HTML, JavaScript, Bootstrap, and JSON to create a web application that tracks your consumptions 

// Query Selectors
const intakeForm = document.querySelector('#intake-form');
const intakeContainer = document.querySelector('#intake-container');
let listItems = [];

// Functions
function handleFormSubmit(event) {
    event.preventDefault();
    // DOMPurify.sanitize() prevents the users from entering in any malicious data (for example, HTML code)
    const name = DOMPurify.sanitize(intakeForm.querySelector('#name').value);
    const ingreds = DOMPurify.sanitize(intakeForm.querySelector('#ingreds').value);
    const cals = DOMPurify.sanitize(intakeForm.querySelector('#cals').value);
    const carbs = DOMPurify.sanitize(intakeForm.querySelector('#carbs').value);
    const protein = DOMPurify.sanitize(intakeForm.querySelector('#protein').value);
    const fat = DOMPurify.sanitize(intakeForm.querySelector('#fat').value);
    const notes = DOMPurify.sanitize(intakeForm.querySelector('#notes').value);
    const newIntake = {
        name,
        ingreds,
        cals,
        carbs,
        protein,
        fat,
        notes,
        id: Date.now(), // If this is an open app on the web, and someone submits this at the same millisecond, 2 things can have the same ID
    }
    listItems.push(newIntake);
    event.target.reset(); // Resets the event after all the items are pushed into the array 
    intakeContainer.dispatchEvent(new CustomEvent('refreshIntakes')) // Computer runs the functions for us, we don't have to run them ourselves
}

function displayRecipes(){
    // One entire string consisting of all the inputs
    const tempStr = listItems.map(item => `
      <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm border-primary">
          <div class="card-header py-3 text-white bg-primary border-primary">
            <h4 class="my-0">${item.name}</h4>
          </div>
          <div class="card-body">
            <ul class="text-start">
                ${!item.ingreds.length ? "" : `<li><strong>Ingredients: </strong>${item.ingreds}</li>`}
                ${!item.cals.length ? "" : `<li><strong>Calories: </strong>${item.cals}</li>`}
                ${!item.carbs.length ? "" : `<li><strong>Carbohydrates: </strong>${item.carbs}</li>`}
                ${!item.protein.length ? "" : `<li><strong>Protein: </strong>${item.protein}</li>`}
                ${!item.fat.length ? "" : `<li><strong>Fat: </strong>${item.fat}</li>`}
                ${!item.notes.length ? "" : `<li><strong>Notes: </strong>${item.notes}</li>`}
            </ul>
            <button class="btn btn-lg btn-outline-danger" aria-label="Delete ${item.name}" value="${item.id}">Delete</button>
          </div>
        </div>
      </div>
      `).join('');
    intakeContainer.innerHTML = tempStr; // Replaces everything with the HTML tag that was designed in tempStr
}

function mirrorStateToLocalStorage() {
    localStorage.setItem('intakeContainer.list', JSON.stringify(listItems)); // Allows for content to be stored in local storage 
}

function initialUILoad() {
    const tempLocalStorage = localStorage.getItem('intakeContainer.list'); // When someone first uses the application, there will be nothing in the local storage
    if (tempLocalStorage === null || tempLocalStorage === []) return; // Checks if its the first time using the application 
    const tempIntakes = JSON.parse(tempLocalStorage); // If it has been used before, the input is converted to an object that can be used
    listItems.push(...tempIntakes); 
    intakeContainer.dispatchEvent(new CustomEvent('refreshIntakes')) // Now when the page is refreshed, the items are still there

}

function deleteIntake(id) {
    listItems = listItems.filter(item => item.id !== id); // Look for the items in the array which do not match the id parameter (item to delete)
    intakeContainer.dispatchEvent(new CustomEvent('refreshIntakes')) 
}

// Event Listeners 
intakeForm.addEventListener('submit', handleFormSubmit);
intakeContainer.addEventListener('refreshIntakes', displayRecipes);
intakeContainer.addEventListener('refreshIntakes', mirrorStateToLocalStorage);
window.addEventListener('DOMContentLoaded', initialUILoad);
intakeContainer.addEventListener('click', (e) => {
    if (e.target.matches('.btn-outline-danger')) { // Checks if the button clicked is the actual delete button and not just anywhere on the screen
        deleteIntake(Number(e.target.value)); // Deletes the list item associated with the target value (id number in blue from the console)
    }
})