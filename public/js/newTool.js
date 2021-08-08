// Logic to create a new tool

const newToolHandler = async (event) => {
    event.preventDefault();

    // Gets values from form
    const name = document.querySelector('#name').value.trim();
    const description = document.querySelector('#description').value.trim();
    const category_id = document.querySelector('#category').value.trim();

    if (name && description && category_id ) {

        const res = await fetch('/api/tools', {
            method: 'POST',
            body: JSON.stringify({ name, description, category_id }),
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

$(document).ready(function(){
    $('select').formSelect();
});