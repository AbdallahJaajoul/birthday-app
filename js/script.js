// Configuração dos utilizadores válidos
const utilizadores = [
  { nome: "Alice", codigo: "1234" },
  { nome: "Bruno", codigo: "5678" }
];

const form = document.getElementById("loginForm");
const erro = document.getElementById("erro");
const loginBox = document.getElementById("loginBox");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const codigo = document.getElementById("codigo").value.trim();

  const valido = utilizadores.find(u => u.nome === nome && u.codigo === codigo);

  if (valido) {
    loginBox.style.display = "none"; // esconde login
    mensagem.textContent = `🎉 Bem-vindo, ${valido.nome}!`;
  } else {
    erro.textContent = "❌ Nome ou código inválido";
    // Seletores
  const loginBox = document.getElementById("loginBox");
  const mensagem = document.getElementById("mensagem");

  // Quando login for válido
  loginBox.style.display = "none"; // esconde a caixa de login
  mensagem.textContent = "🎉 Bem-vindo!";

  }
});
