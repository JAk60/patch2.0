const { spawn } = require("child_process");
const path = require("path");
const process = require("process");

// Change to your project directory
process.chdir("D:\\IITB\\patch2.0");

const pythonPath = path.join("venv", "Scripts", "python.exe");

const child = spawn(pythonPath, ["route.py"], {
  stdio: "inherit",
  windowsHide: true,
});
