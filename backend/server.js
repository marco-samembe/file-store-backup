const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors()); // allow all frontend requests

// folders
const UPLOADS = path.join(__dirname, "uploads");
const BACKUPS = path.join(__dirname, "backups");
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS);
if (!fs.existsSync(BACKUPS)) fs.mkdirSync(BACKUPS);

// file upload setup
const storage = multer.diskStorage({
  destination: UPLOADS,
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// allow frontend access
app.use(express.json());
app.use(require("cors")());

// upload file
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully" });
});

// list files
app.get("/files", (req, res) => {
  res.json(fs.readdirSync(UPLOADS));
});

// download file
app.get("/download/:name", (req, res) => {
  res.download(path.join(UPLOADS, req.params.name));
});

// backup files
app.post("/backup", (req, res) => {
  const date = new Date().toISOString().split("T")[0];
  const backupDir = path.join(BACKUPS, date);
  fs.mkdirSync(backupDir, { recursive: true });

  fs.readdirSync(UPLOADS).forEach(file => {
    fs.copyFileSync(
      path.join(UPLOADS, file),
      path.join(backupDir, file)
    );
  });

  res.json({ message: "Backup completed" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
