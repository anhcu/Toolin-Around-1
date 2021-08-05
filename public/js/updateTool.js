const updateToolHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();
    const description = document.querySelector('#description').value.trim();
    const tool_id = parseInt(document.location.href.split("/").pop());

    if (name && description) {

    const res = await fetch(`/api/tools/${tool_id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
        console.log(res);
        document.location.replace(`/tools/${tool_id}`)
    } else {
        alert(res.statusText);
    }
    }
};

document
.querySelector('#update-tool').addEventListener('submit', updateToolHandler);