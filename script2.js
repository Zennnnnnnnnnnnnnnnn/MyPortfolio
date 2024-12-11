const boxes = document.querySelectorAll('.box');
const droppables = document.querySelectorAll('.droppable');
const gameContainer = document.querySelector('.game-container');
const resetButton = document.getElementById('resetButton');
const remarksElement = document.getElementById('remarks');
const scoreElement = document.getElementById('scores');
let score = 0; // Initialize score

// Function to set up drag events for each box
function setupBoxEvents(box) {
  box.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text', e.target.id);
    setTimeout(() => e.target.style.display = 'none', 0);
  });

  box.addEventListener('dragend', (e) => {
    e.target.style.display = 'block';
  });
}

// Initialize drag events for all initial boxes
boxes.forEach(box => setupBoxEvents(box));

// Set up events for droppable areas
droppables.forEach(droppable => {
  droppable.addEventListener('dragover', (e) => {
    e.preventDefault();
    droppable.classList.add('drag-over');
  });

  droppable.addEventListener('dragleave', () => {
    droppable.classList.remove('drag-over');
  });

  droppable.addEventListener('drop', (e) => {
    e.preventDefault();
    droppable.classList.remove('drag-over');
    const draggedId = e.dataTransfer.getData('text');
    const draggedBox = document.getElementById(draggedId);

    if (isCorrectPlacement(draggedBox, droppable)) {
      droppable.appendChild(draggedBox);
      draggedBox.classList.add('correct');
      draggedBox.classList.remove('wrong');
      updateScore(true); // Correct placement, increase score
    } else {
      draggedBox.classList.add('wrong');
      draggedBox.classList.remove('correct');
      updateScore(false); // Incorrect placement, no score change
    }

    updateBackground();
    updateRemarks();
  });
});

// Check if the box was dropped correctly
function isCorrectPlacement(draggedBox, droppable) {
  return draggedBox.id === droppable.getAttribute('data-draggable-id');
}

// Update the background color based on the number of correct/wrong placements
function updateBackground() {
  const correctBoxes = document.querySelectorAll('.box.correct').length;
  const wrongBoxes = document.querySelectorAll('.box.wrong').length;

  gameContainer.classList.remove('correct', 'wrong', 'all-correct');

  if (correctBoxes === boxes.length) {
    gameContainer.classList.add('all-correct');
  } else if (correctBoxes > 0 && wrongBoxes === 0) {
    gameContainer.classList.add('correct');
  } else if (wrongBoxes > 0) {
    gameContainer.classList.add('wrong');
  }
}

// Update score and display it
function updateScore(isCorrect) {
  if (isCorrect) {
    score += 10; // Increase score for each correct placement
    scoreElement.textContent = score;
  }
}

// Update remarks based on the game status
function updateRemarks() {
  const correctBoxes = document.querySelectorAll('.box.correct').length;
  const wrongBoxes = document.querySelectorAll('.box.wrong').length;

  if (correctBoxes === boxes.length) {
    remarksElement.textContent = "Congrats, you got it all!";
  } else if (wrongBoxes > 0) {
    remarksElement.textContent = "You're incorrect, try again.";
  } else if (correctBoxes > 0) {
    remarksElement.textContent = "You're correct!";
  } else {
    remarksElement.textContent = ""; // Clear remarks if no boxes are placed
  }
}

// Reset game to initial state
resetButton.addEventListener('click', resetGame);

function resetGame() {
  // Move all boxes back to the draggableBox container
  const draggableContainer = document.getElementById('draggableBox');
  draggableContainer.innerHTML = ''; // Clear all boxes in draggableContainer

  // Reset each droppable area by removing child elements, but keeping placeholder text
  const droppableData = [
    { id: 'box4', text: 'Touch' },
    { id: 'box3', text: 'Sight' },
    { id: 'box1', text: 'Smelling' },
    { id: 'box2', text: 'Taste' },
    { id: 'box5', text: 'Hearing' },
    { id: 'box9', text: 'Balance' },
    { id: 'box6', text: 'Walking' },
    { id: 'box7', text: 'Thinking' },
    { id: 'box10', text: 'Writing' },
    { id: 'box8', text: 'Breathing' }
  ];

  droppableData.forEach((data, index) => {
    const droppable = droppables[index];
    droppable.innerHTML = data.text; // Set placeholder text
    droppable.classList.remove('correct', 'wrong', 'drag-over');
  });

  // Recreate and append boxes in draggableContainer
  const boxData = [
    { id: 'box1', text: 'Nose' },
    { id: 'box2', text: 'Mouth' },
    { id: 'box3', text: 'Eye' },
    { id: 'box4', text: 'Hand' },
    { id: 'box5', text: 'Ear' },
    { id: 'box6', text: 'Leg' },
    { id: 'box7', text: 'Brain' },
    { id: 'box8', text: 'Lungs' },
    { id: 'box9', text: 'Inner Ear' },
    { id: 'box10', text: 'Pen' }
  ];

  boxData.forEach(data => {
    const box = document.createElement('div');
    box.id = data.id;
    box.classList.add('box');
    box.setAttribute('draggable', 'true');
    box.textContent = data.text;
    draggableContainer.appendChild(box);
    setupBoxEvents(box); // Set up drag events for each new box
  });

  // Reset game state variables and UI elements
  score = 0; // Reset score
  scoreElement.textContent = score;
  remarksElement.textContent = ""; // Clear remarks
  gameContainer.classList.remove('correct', 'wrong', 'all-correct');
}