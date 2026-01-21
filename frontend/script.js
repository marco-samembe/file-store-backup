const API = "http://localhost:5000"; // backend URL
const list = document.getElementById("fileList");

// Upload file
document.getElementById("uploadForm").onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  await fetch(`${API}/upload`, { method: "POST", body: formData });
  alert("File uploaded!");
  loadFiles();
};

// Load files from backend
async function loadFiles() {
  const res = await fetch(`${API}/files`);
  const files = await res.json();
  list.innerHTML = "";
  files.forEach(f => {
    list.innerHTML += `<li><a href="${API}/download/${f}" target="_blank">${f}</a></li>`;
  });
}

// Backup files
async function backup() {
  await fetch(`${API}/backup`, { method: "POST" });
  alert("Backup done");
}

// Load files on page load
loadFiles();
