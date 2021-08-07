const borrowBtn = document.querySelector('#borrow');


const mailTest = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/borrow', {
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