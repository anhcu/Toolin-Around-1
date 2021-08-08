// Logic to borrow a tool

// Borrow button displayed on tools/id
const borrowBtn = document.querySelector('#borrow');

const mailTest = async (event) => {
    event.preventDefault();

    // Grabs id from current page
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