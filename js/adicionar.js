const form = document.getElementById('formAdicionar');
const listaMembros = document.getElementById('listaMembros');
let membros = JSON.parse(localStorage.getItem('membros')) || [];

function renderizar() {
  listaMembros.innerHTML = '';
  membros.forEach((m,i) => {
    const li =
