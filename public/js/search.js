const searchHandler = async (event) => {
    event.preventDefault();
  
    const search = document.querySelector('#search').value.trim();

    // GRAB THE HOMEPAGE FILEPATH ONLY, REMOVING ANY ADDITIONAL ROUTES (I.E. /USERS ETC) FROM URL
    const home_url = document.location.href.split("/").slice(0,3).join('/')

    if (search) {
      const response = await fetch(`${home_url}/${search}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`${home_url}/${search}`);
        console.log("all good!")
      } else {
        alert(response.statusText);
      }
    }
  };

  
document
    .querySelector('#search-form')
    .addEventListener('click', searchHandler)