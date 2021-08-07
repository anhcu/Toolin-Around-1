const borrowBtn = document.querySelector('#borrow');


const mailTest = async (event) => {
    event.preventDefault();

    const tool_id = parseInt(document.location.href.split("/").pop());

    const response = await fetch(`/api/borrow/${tool_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({}),
        mode: 'no-cors',
    });
    
    const data = await response.json();
    console.log(data);
}

borrowBtn.addEventListener('click', mailTest);