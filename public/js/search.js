// Logic to perform a search

const searchHandler = async (event) => {
    event.preventDefault();
  
    // Gets value from form
    const search = document.querySelector('#search').value.trim();
    
    if (search) {
      const response = await fetch(`${search}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`${search}`);
        console.log("all good!")
      } else {
        alert(response.statusText);
      }
    }
  };

document
  .querySelector('#search-form')
  .addEventListener('click', searchHandler)