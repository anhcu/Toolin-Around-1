// const theID = document.querySelector('input[name="tool-id"]').value;
// const newFormHandler = async (event) => {
//   event.preventDefault();

//   const name = document.querySelector('#project-name').value.trim();
//   const needed_funding = document.querySelector('#project-funding').value.trim();
//   const description = document.querySelector('#project-desc').value.trim();

//   if (name && needed_funding && description) {
//     const response = await fetch(`/api/projects`, {
//       method: 'POST',
//       body: JSON.stringify({ name, needed_funding, description }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       document.location.replace('/profile');
//     } else {
//       alert('Failed to create project');
//     }
//   }
// };

// const delButtonHandler = async () => {
//   await fetch(`/api/tools/${theID}`, {
//     method: 'DELETE'
//   });
//   document.location.replace('/toolbox');
// };

// const updateButton = async ()=> {
//   alert("updating")
//   const theBody = document.querySelector('#content').value;
//   await fetch (`/api/tool/${theID}`, {
//     method: 'PUT',
//     body: JSON.stringify(
//       theBody,
//     ),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
//   // document.location.replace('/toolbox');
// };

// // document
// //   .querySelector('.new-tool-form')
// //   .addEventListener('submit', newFormHandler);

// document
//   .querySelector('#delete-tool')
//   .addEventListener('click', delButtonHandler);

// document
//   .querySelector('#update-tool')
//   .addEventListener('click', updateButton)
