// Creates a new post
const newToolHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();
    const description = document.querySelector('#description').value.trim();
    const category = document.querySelector('#category').value.trim();

    if (name && description && category) {

    const res = await fetch('/api/tools', {
        method: 'POST',
        body: JSON.stringify({ name, description, category }),
        headers: { 'Content-Type': 'application/json' },
    });
  
    if (res.ok) {
        console.log(res);
        document.location.replace('/toolbox');
    } else {
        console.log('Error 2')
        alert(res.statusText);
      }
    }
};

document
.querySelector('.new-tool').addEventListener('submit', newToolHandler);