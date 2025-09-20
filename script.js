const users = {
  "Abdallah": "14",
  "Siba Jaajoul": "user23",
  "Raghad Jaajoul": "user3"
};

let members = [];

function login() {
  const name = document.getElementById("username").value.trim();
  const code = document.getElementById("code").value.trim();
  const error = document.getElementById("login-error");

  const normalizedName = name.toLowerCase();
if (users[normalizedName] === code) {

    document.getElementById("login-box").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    checkBirthdays();
  } else {
    error.textContent = "Código inválido para este nome.";
  }
}

function addMember() {
  const name = document.getElementById("member-name").value.trim();
  const date = document.getElementById("member-date").value;

  if (name && date) {
    members.push({ name, date });
    updateMemberList();
    scheduleMessages(name, date);
  }
}

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

function scheduleMessages(name, date) {
  const today = new Date().toISOString().slice(5, 10);
  const birthDate = date.slice(5, 10);
  if (today === birthDate) {
    alert(`Parabéns! Feliz Aniversário. Que seu dia seja tão lindo como tu`);
  } else {
    alert(`Hoje o ${name} faz anos, Parabeniza`);
  }
}

function checkBirthdays() {
  const today = new Date().toISOString().slice(5, 10);
  members.forEach(m => {
    if (m.date.slice(5, 10) === today) {
      alert(`Hoje o ${m.name} faz anos, Parabeniza`);
    }
  });
}

function goToPhotoPage() {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("photo-page").style.display = "block";
}

function backToMain() {
  document.getElementById("photo-page").style.display = "none";
  document.getElementById("main-content").style.display = "block";
}

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

window.onload = function() {
  const saved = localStorage.getItem("savedPhoto");
  if (saved) {
    const img = document.createElement("img");
    img.src = saved;
    img.style.maxWidth = "300px";
    document.getElementById("saved-photo").appendChild(img);
  }
};
