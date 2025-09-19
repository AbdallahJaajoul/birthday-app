fetch('membros.json')
  .then(res => res.json())
  .then(data => {
    membros = data;
    renderizar();
  });
