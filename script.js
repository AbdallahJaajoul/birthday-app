// Lista de utilizadores com nome e código (em minúsculas)
const users = {
  "abdallah jaajoul": "1234",
  "maria": "5678",
  "joao": "abcd"
};

let members = [];
let currentUser = "";

// Função de login
function login() {
  const nameInput = document.getElementById("username").value.trim().toLowerCase();
  const codeInput = document.getElementById("code").value.trim();
  const error = document.getElementById("login-error");

  if (users[nameInput] === codeInput) {
    currentUser = nameInput;
    document.getElementById("login-box").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    checkBirthdays();
  } else {
    error.textContent = "Código inválido para este nome.";
  }
}

// Adicionar novo membro
function addMember() {
  const name = document.getElementById("member-name").value.trim();
  const date = document.getElementById("member-date").value;

  if (name && date) {
    members.push({ name, date });
    updateMemberList();
  }
}

// Atualizar lista de membros com botão de remover
function updateMemberList() {
  const list = document.getElementById("member-list");
  list.innerHTML = "";

  members.forEach((m, index) => {
    const li = document.createElement("li");
    li.textContent = `${m.name} - ${m.date}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌ Remover";
    removeBtn.onclick = () => {
      members.splice(index, 1);
      updateMemberList();
    };

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Verifica aniversários e envia mensagens
function checkBirthdays() {
  const today = new Date().toISOString().slice(5, 10); // formato MM-DD

  members.forEach(m => {
    const memberName = m.name.trim().toLowerCase();
    const birthDate = m.date.slice(5, 10);

    if (birthDate === today) {
      if (memberName === currentUser) {
        alert(`Parabéns! Feliz Aniversário. Que seu dia seja tão lindo como tu`);
      } else {
        alert(`Hoje o ${m.name} faz anos, Parabeniza`);
      }
    }
  });
}

// Navegar para página de fotos
function goToPhotoPage() {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("photo-page").style.display = "block";
}

// Voltar da página de fotos
function backToMain() {
  document.getElementById("photo-page").style.display = "none";
  document.getElementById("main-content").style.display = "block";
}

// Guardar foto localmente
function savePhoto(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "300px";
      document.getElementById("saved-photo").innerHTML = "";
      document.getElementById("saved-photo").appendChild(img);
      localStorage.setItem("savedPhoto", e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

// Carregar foto guardada ao iniciar
window.onload = function() {
  const saved = localStorage.getItem("savedPhoto");
  if (saved) {
    const img = document.createElement("img");
    img.src = saved;
    img.style.maxWidth = "300px";
    document.getElementById("saved-photo").appendChild(img);
  }
};
