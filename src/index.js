let addToy = false;

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');

  // Fetch and display all toys
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        createToyCard(toy);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));

  // Create toy card
  function createToyCard(toy) {
    const div = document.createElement('div');
    div.classList.add('card');

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;

    const img = document.createElement('img');
    img.src = toy.image;
    img.classList.add('toy-avatar');
    img.alt = toy.name;

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement('button');
    button.classList.add('like-btn');
    button.id = toy.id;
    button.textContent = 'Like ❤️';
    button.addEventListener('click', () => {
      increaseLikes(toy, p);
    });

    div.append(h2, img, p, button);
    toyCollection.appendChild(div);
  }

  // Add a new toy
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const toyName = toyForm.querySelector('input[name="name"]').value;
    const toyImage = toyForm.querySelector('input[name="image"]').value;

    if (!toyName || !toyImage) {
      alert('Please enter both a name and an image URL for the toy.');
      return;
    }

    const toyData = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    console.log('Adding new toy:', toyData);

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(toyData)
    })
    .then(response => response.json())
    .then(newToy => {
      console.log('New toy added:', newToy);
      createToyCard(newToy);
      toyForm.reset();
      toyFormContainer.style.display = "none";
      addToy = false;
    })
    .catch(error => console.error('Error adding new toy:', error));
  });

  // Increase likes for a toy
  function increaseLikes(toy, p) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      p.textContent = `${updatedToy.likes} Likes`;
      toy.likes = updatedToy.likes;
    })
    .catch(error => console.error('Error updating likes:', error));
  }
});
