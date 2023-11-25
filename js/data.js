/* exported data */
let data = {
  view: 'home',
  entry: null
};
// const previousDataJSON = localStorage.getItem('archonic');

// if (previousDataJSON) {
//   data = JSON.parse(previousDataJSON);
// }

window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('archonic', dataJSON);
});
