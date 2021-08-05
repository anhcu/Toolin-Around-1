// Deletes a post
const deleteToolHandler = async (event) => {
    event.preventDefault();
    
    const id = parseInt(document.location.href.split("/").pop());

    console.log(id);

    const res = await fetch(`/api/tools/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
        document.location.replace('/toolbox');


    } else {
        alert(res.statusText);
    }
};

    document.querySelector('.delete-tool').addEventListener('submit', deleteToolHandler);