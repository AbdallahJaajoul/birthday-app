// js/main.js (COLE ESTE FICHEIRO)
(async function() {
  // Utilitário: busca membros.json (força fetch sem cache)
  async function carregarMembrosOficiais() {
    const url = 'membros.json?v=' + Date.now(); // cache-busting
    const res = await fetch(url, {cache: 'no-store'}).catch(()=>null);
    if(!res || !res.ok) throw new Error('Não foi possível carregar membros.json');
    return res.json();
  }

  // Autenticação: pede código + data e valida contra membros oficiais
  async function autenticar() {
    const membrosOficiais = await carregarMembrosOficiais();
    // repetição até autenticar ou cancelar
    while(true) {
      const codigoInput = prompt("Digite o seu código de usuário (ex: user1) — cancelar sai:");
      if(codigoInput === null) return null; // cancelou
      const dataInput = prompt("Digite a sua data de nascimento EXACTA (AAAA-MM-DD):");
      if(dataInput === null) return null;

      // procura entradas com o código
      const entradas = membrosOficiais.filter(m => String(m.codigo).trim() === String(codigoInput).trim());
      if(entradas.length === 0) {
        alert("Código inválido. Se acha que o código existe, contacte o administrador.");
        continue;
      }

      // procura se alguma entrada com esse código tem a mesma data
      const match = entradas.find(e => String(e.data).trim() === String(dataInput).trim());
      if(match) {
        // autenticação OK: guarda código e carrega membros oficiais na app
        localStorage.setItem('codigoUsuario', codigoInput.trim());
        // guarda também membros oficiais no localStorage (para offline)
        localStorage.setItem('membrosOficiais', JSON.stringify(membrosOficiais));
        return { codigo: codigoInput.trim(), membrosOficiais };
      } else {
        alert("Data de nascimento incorreta para esse código. Tente novamente ou contacte o administrador.");
      }
    }
  }

  // inicia lógica
  let codigo = localStorage.getItem('codigoUsuario');
  let membrosOficiais = null;
  try {
    // tenta carregar membros oficiais do servidor (actual)
    membrosOficiais = await carregarMembrosOficiais();
    localStorage.setItem('membrosOficiais', JSON.stringify(membrosOficiais));
  } catch (err) {
    // não conseguiu fetch — tenta usar cache local
    const cache = localStorage.getItem('membrosOficiais');
    if(cache) membrosOficiais = JSON.parse(cache);
    else membrosOficiais = [];
  }

  // Se não tem código, autentica
  if(!codigo) {
    const auth = await autenticar();
    if(!auth) {
      alert('Autenticação cancelada. A aplicação precisa de um código válido para funcionar.');
      // não autenticado — limpa a UI e sai
      document.body.innerHTML = '<p style="padding:20px;">Autenticação não concluída. Recarregue para tentar novamente.</p>';
      return;
    } else {
      codigo = auth.codigo;
      membrosOficiais = auth.membrosOficiais;
    }
  }

  // Selecciona elementos da UI
  const lista = document.getElementById('lista');
  const mensagem = document.getElementById('mensagem');
  const btnAdicionar = document.getElementById('btnAdicionar');
  if(btnAdicionar) btnAdicionar.addEventListener('click', ()=>{ window.location.href = 'adicionar.html'; });

  // Carrega membros locais (backup / edição local)
  let membrosLocais = JSON.parse(localStorage.getItem('membros')) || [];

  // Merge: prioridade aos oficiais (membrosOficiais). Se precisares mostrar ambos,
  // podes concatenar; no nosso caso, vamos usar os oficiais para autenticação e exibição.
  let membros = membrosOficiais.concat(membrosLocais.filter(l => !membrosOficiais.some(o => o.codigo===l.codigo && o.nome===l.nome && o.data===l.data)));

  // renderiza apenas os membros do grupo (codigo)
  function renderizar() {
    lista.innerHTML = '';
    const hoje = new Date().toISOString().slice(5,10); // MM-DD
    let aniversarianteHoje = false;
    // só membros cujo campo "codigo" corresponde ao código autenticado
    membros.filter(m => String(m.codigo).trim() === String(codigo).trim()).forEach((m, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `${m.nome} - ${m.data} <button data-idx="${idx}">❌</button>`;
      // remover local apenas (não altera dados oficiais)
      li.querySelector('button').addEventListener('click', (e) => {
        const i = Number(e.currentTarget.dataset.idx);
        // remover apenas de membrosLocais (se existir)
        const chave = m.codigo + '|' + m.nome + '|' + m.data;
        const idxLocal = membrosLocais.findIndex(x => (x.codigo + '|' + x.nome + '|' + x.data) === chave);
        if(idxLocal >= 0) {
          membrosLocais.splice(idxLocal, 1);
          localStorage.setItem('membros', JSON.stringify(membrosLocais));
          // actualiza array visual
          membros = membrosOficiais.concat(membrosLocais.filter(l => !membrosOficiais.some(o => o.codigo===l.codigo && o.nome===l.nome && o.data===l.data)));
          renderizar();
        } else {
          alert('Este item é oficial e não pode ser removido aqui. Para remover, altere membros.json no repositório (apenas administrador).');
        }
      });
      lista.appendChild(li);

      if(m.data && m.data.slice(5) === hoje) aniversarianteHoje = true;
    });

    if(aniversarianteHoje) mostrarMensagem();
    else mensagem.innerHTML = '';
  }

  function mostrarMensagem(){
    mensagem.innerHTML = `<div class="parabens">🎉 Parabéns! Feliz Aniversário. Que seu dia seja tão lindo como tu 🎂</div>`;
    // A mensagem fica visível enquanto for esse dia — ao recarregar após a meia-noite desaparece
  }

  // Notificações às 9h: para os membros do mesmo código
  async function agendarNotificacao() {
    if (!('Notification' in window)) return;
    if (Notification.permission !== "granted") await Notification.requestPermission();
    // calcula ms até 9h
    const agora = new Date();
    const proxima9 = new Date();
    proxima9.setHours(9,0,0,0);
    if (agora > proxima9) proxima9.setDate(proxima9.getDate() + 1);
    const ms = proxima9 - agora;
    setTimeout(() => {
      notificarAniversariosHoje();
      setInterval(notificarAniversariosHoje, 24*60*60*1000);
    }, ms);
  }

  function notificarAniversariosHoje() {
    if (Notification.permission !== "granted") return;
    const hoje = new Date().toISOString().slice(5,10); // MM-DD
    // membros do grupo
    const grupo = membros.filter(m => String(m.codigo).trim() === String(codigo).trim());
    grupo.forEach(m => {
      if(m.data && m.data.slice(5) === hoje) {
        // notifica o grupo: "Hoje [nome] faz anos — dê os parabéns!"
        new Notification("🎉 Hoje é aniversário!", {
          body: `Hoje ${m.nome} faz anos — dê os parabéns!`,
          icon: 'icons/android-chrome-192x192.png'
        });
      }
    });
  }

  // PWA install button (mantém o teu existente)
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; if(installBtn) installBtn.style.display = 'block'; });
  if(installBtn) installBtn.addEventListener('click', async () => { installBtn.style.display = 'none'; if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt = null; } });

  // regista SW se disponível
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(()=>console.log('SW registado'));
  }

  // inicializa UI
  renderizar();
  agendarNotificacao();

  // Exposição de funções para console / debug
  window._membros = membros;
  window._membrosOficiais = membrosOficiais;
})();
