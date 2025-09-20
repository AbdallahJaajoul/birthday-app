document.addEventListener("DOMContentLoaded", () => {
  // Usuários válidos
  const usuarios = [
    { nome: "Abdallah Jaajoul", codigo: "user14" },
    { nome: "Siba jaajoul", codigo: "user24" },
    { nome: "Raghad Jaajoul", codigo: "user3" }
  ];

  // Seletores
  const loginBox = document.getElementById("loginBox");
  const appBox = document.getElementById("appBox");
  const loginForm = document.getElementById("loginForm");
  const btnLogout = document.getElementById("btnLogout");
  const mensagem = document.getElementById("mensagem");
  const userInfo = document.getElementById("userInfo");

  // Login com Enter ou botão
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const codigo = document.getElementById("codigo").value.trim();

    const valido = usuarios.find(u => u.nome.toLowerCase() === nome.toLowerCase() && u.codigo === codigo);

    if(valido) {
      localStorage.setItem("user", JSON.stringify(valido));
      mostrarApp(valido);
      mensagem.innerHTML = "<p class='sucesso'>Login com sucesso!</p>";
    } else {
      mensagem.innerHTML = "<p class='erro'>Nome ou código inválido!</p>";
    }
  });

  // Mostrar app após login
  function mostrarApp(user) {
    loginBox.style.display = "none";
    appBox.style.display = "block";
    userInfo.textContent = `Olá, ${user.nome}! O teu código é ${user.codigo}`;
  }

  // Logout
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    loginBox.style.display = "block";
    appBox.style.display = "none";
    document.getElementById("nome").value = "";
    document.getElementById("codigo").value = "";
    mensagem.innerHTML = "";
  });

  // Mantém sessão se já estiver logado
  const user = localStorage.getItem("user");
  if(user) {
    mostrarApp(JSON.parse(user));
  }
});
