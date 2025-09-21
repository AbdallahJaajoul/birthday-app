const members = [
  { name: "Bruno Ferreira", date: "2000-09-21" },
  { name: "Arlindo Pereira", date: "2000-01-02" },
  { name: "Ricardo Sousa", date: "2000-01-03" },
  { name: "Jéssica Samba", date: "2000-01-04" },
  { name: "Adizica Pontes", date: "2000-01-05" },
  { name: "Leonaldo Costa", date: "2000-01-06" },
  { name: "Benedita Silva", date: "2000-01-07" },
  { name: "Remualdo Santos", date: "2000-01-08" },
  { name: "Naury Piedade", date: "2000-01-09" },
  { name: "Abdallah Jaajoul", date: "2000-03-30" },
  { name: "Herlander Costa", date: "2000-01-10" },
  { name: "Adélia Carvalho", date: "2000-01-11" },
  { name: "Tiago Sousa", date: "2000-01-12" },
  { name: "Daniel Silva", date: "2000-01-13" },
  { name: "Jamilton D’Almeida", date: "2000-01-14" },
  { name: "Joel Costa", date: "2000-01-15" },
  { name: "Jessica Lima", date: "2000-01-16" },
  { name: "Francisco Paredes", date: "2000-01-17" },
  { name: "Fábio Domingos", date: "2000-01-18" },
  { name: "Alexandre Sousa", date: "2000-01-19" },
  { name: "Chelsy Santos", date: "2000-01-20" },
  { name: "Isabel Carvalho", date: "2000-01-21" },
  { name: "Rui Monteiro", date: "2000-01-22" }
];

const users = {
  "bruno ferreira": "1",
  "arlindo pereira": "2",
  "ricardo sousa": "3",
  "jéssica samba": "4",
  "adizica pontes": "5",
  "leonaldo costa": "6",
  "benedita silva": "7",
  "remualdo santos": "8",
  "naury piedade": "9",
  "abdallah jaajoul": "10",
  "herlander costa": "11",
  "adélia carvalho": "12",
  "tiago sousa": "13",
  "daniel silva": "14",
  "jamilton d’almeida": "15",
  "joel costa": "16",
  "jessica lima": "17",
  "francisco paredes": "18",
  "fábio domingos": "19",
  "alexandre sousa": "20",
  "chelsy santos": "21",
  "isabel carvalho": "22",
  "rui monteiro": "23"
};

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
    console.log("Nome digitado:", `"${nameInput}"`);
    console.log("Código digitado:", `"${codeInput}"`);
  }
}

// ADICIONAR MEMBRO
function addMember() {
  const name = document.getElementById("member-name").value.trim();
  const date = document.getElementById("member-date").value;

  if (name && date) {
    members.push({ name, date });
    localStorage.setItem("members", JSON.stringify(members)); // salva
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
  const aniversariantes = members.filter(m => m.date.slice(5, 10) === today);
  
  if (aniversariantes.length === 0) return;
  
  aniversariantes.forEach(m => {
    const memberName = m.name.trim().toLowerCase();
    
      if (memberName === currentUser) {
        alert(`🎉 Parabéns ${m.name}! Feliz Aniversário. Que o teu dia seja incrível!`);
      } else {
        alert(`📢 Hoje é aniversário de ${m.name}! Não te esqueças de parabenizar.`);
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
  win.document.write(`<img src="${src}" style="width:70%">`);
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
