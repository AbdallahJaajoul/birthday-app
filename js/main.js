// Pede o código/nome do usuário na primeira abertura
let codigo = localStorage.getItem('codigoUsuario');
if(!codigo) codigo = prompt("Digite seu código ou nome de usuário:");
localStorage.setItem('codigoUsuario', codigo);

const lista = document.getElementById('lista');
const mensagem = document.getElementById('mensagem');
const btnAdicionar = document.getElementById('btnAdicionar');
btnAdicionar.addEventListener('click', () => { window.location.href = 'adicionar.html'; });

// Lista de membros carregada de Google Sheets ou JSON local
let membros = JSON.parse(localStorage.getItem('membros')) || [];

// Renderiza aniversários filtrados para este usuário
function renderizar() {
  lista.innerHTML = '';
  const hoje = new Date().toISOString().slice(5,10); // MM-DD
  let aniversarianteHoje = false;

  membros.filter(m => m.codigo === codigo).forEach((membro,i) => {
    const li = document.createElement('li');
    li.innerHTML = `${membro.nome} - ${membro.data} <button onclick="remover(${i})">❌</button>`;
    lista.appendChild(li);
    if(membro.data.slice(5) === hoje) aniversarianteHoje = true;
  });

  if(aniversarianteHoje) mostrarMensagem();
  else mensagem.innerHTML='';
}

// Mensagem de parabéns apenas no dia do aniversário
function mostrarMensagem() {
  mensagem.innerHTML = `<div class="parabens">🎉 Parabéns! Feliz Aniversário. Que seu dia seja tão lindo como tu 🎂</div>`;
}

// Remover membro
function remover(index) {
  membros.splice(index,1);
  localStorage.setItem('membros', JSON.stringify(membros));
  renderizar();
}

// Adicionar membro via formulário (em adicionar.html)
renderizar();

// Notificações às 9h
function agendarNotificacao() {
  if(Notification.permission !== "granted") Notification.requestPermission();
  const agora = new Date();
  const hora9 = new Date(); hora9.setHours(9,0,0,0);
  let tempo = hora9 - agora;
  if(tempo<0) tempo += 24*60*60*1000;
  setTimeout(() => { renderizar(); setInterval(renderizar,24*60*60*1000); }, tempo);
}
agendarNotificacao();

// PWA Install
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt=e; installBtn.style.display='block'; });
installBtn.addEventListener('click', async () => { installBtn.style.display='none'; if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt=null; } });
