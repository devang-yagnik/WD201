// eslint-disable-next-line no-unused-vars
let toggle = () => {
  const header = document.getElementsByTagName('header')[0]
  const footer = document.getElementsByTagName('footer')[0]
  // const table = document.getElementsByClassName('table')[0]
  const body = document.getElementsByTagName('body')[0]
  const inputSwitch = document.getElementById('inputSwitch')
  if(inputSwitch.checked){
    body.dataset.bsTheme = "dark"
    // table.classList.replace('table-light', 'table-dark')
    header.classList.replace('bg-teal-200', 'bg-sky-900')
    footer.classList.replace('bg-teal-200', 'bg-sky-900')
    body.classList.replace('text-stone-600', 'text-stone-100')
    // footer.classList.replace('text-stone-600', 'text-stone-100')
  }
  else{
    body.dataset.bsTheme = "light"
    // table.classList.replace('table-dark', 'table-light')
    header.classList.replace('bg-sky-900', 'bg-teal-200')
    footer.classList.replace('bg-sky-900', 'bg-teal-200')
    body.classList.replace('text-stone-100', 'text-stone-600')
    // footer.classList.replace('text-stone-100', 'text-stone-600')
  }
}
// eslint-disable-next-line no-unused-vars
function deleteTodo(id) {
  fetch(`/todos/${id}`, { method: "DELETE" })
    .then(response => response.json())
    .then(data => {
      if (data === true) {
        // eslint-disable-next-line no-self-assign
        location.reload(true);
      } else {
        console.log("Todo not found");
      }
    })
    .catch(error => console.error(error));
}
// eslint-disable-next-line no-unused-vars
function complete(id, status) {
  fetch(`/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: status })
  })
    .then(response => response.json())
    .then(data => {
      if (data) {
        location.reload(true);
      } else {
        console.log("Todo not found");
      }
    })
    .catch(error => console.error(error));
}
