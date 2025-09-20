const users = {
  "abdallah jaajoul": "1234",
  "maria": "5678",
  "joao": "abcd"
};

let members = [];
let currentUser = "";

// LOGIN
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

// ADICIONAR MEMBRO
function addMember() {
  const name = document.getElementById("member-name").value.trim();
  const date = document.getElementById("member-date").value;

  if (name && date) {
    members.push({ name, date });
    updateMemberList();
  }
}

// LISTA DE MEMBROS COM REMOVER
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

// VERIFICAR ANIVERSÁRIOS
function checkBirthdays() {
  const today = new Date().toISOString().slice(5, 10); // MM-DD

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

// NAVEGAR PARA PÁGINA DE FOTOS
function goToPhotoPage() {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("photo-page").style.display = "block";
}

// VOLTAR DA PÁGINA DE FOTOS
function backToMain() {
  document.getElementById("photo-page").style.display = "none";
  document.getElementById("main-content").style.display = "block";
}

// GUARDAR VÁRIAS FOTOS
function savePhoto(event) {
  const files = event.target.files;
  const container = document.getElementById("saved-photo");

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "150px";
      img.style.margin = "10px";
      img.style.cursor = "pointer";
      img.onclick = () => openPreview(e.target.result);
      container.appendChild(img);

      let saved = JSON.parse(localStorage.getItem("savedPhotos") || "[]");
      saved.push(e.target.result);
      localStorage.setItem("savedPhotos", JSON.stringify(saved));
    };
    reader.readAsDataURL(file);
  });
}

// ABRIR FOTO EM TAMANHO MAIOR
function openPreview(src) {
  const win = window.open("", "_blank");
  win.document.write(`<img src="${src}" style="width:100%">`);
}

// CARREGAR FOTOS AO INICIAR
window.onload = function() {
  const saved = JSON.parse(localStorage.getItem("savedPhotos") || "[]");
  const container = document.getElementById("saved-photo");
  saved.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "150px";
    img.style.margin = "10px";
    img.style.cursor = "pointer";
    img.onclick = () => openPreview(src);
    container.appendChild(img);
  });
};
