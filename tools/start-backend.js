const { exec } = require("child_process");
const os = require("os");
const path = require("path");
const fs = require("fs");
const open = require("open");

const dotenvPath = path.resolve(__dirname, "../main.env");
require("dotenv").config({ path: dotenvPath });

console.log("✅ main.env loaded:", fs.existsSync(dotenvPath));
console.log("🔍 JAVA_HOME:", process.env.JAVA_HOME);

if (!process.env.JAVA_HOME) {
    console.error("❌ JAVA_HOME is not set. Please define it in main.env or in your environment.");
    process.exit(1);
}

const isWindows = os.platform() === "win32";
const command = isWindows ? "mvnw.cmd spring-boot:run" : "./mvnw spring-boot:run";

console.log("🚀 Starting backend server...");

const subprocess = exec(command, { env: process.env });

// ✅ Wait until backend prints "Tomcat started" before opening frontend
subprocess.stdout?.on("data", (data) => {
    process.stdout.write(data);

    if (data.includes("Tomcat started on port")) {
        console.log("✅ Backend is ready — opening frontend...");
        open("http://localhost:5173");
    }
});

subprocess.stderr?.pipe(process.stderr);

subprocess.on("error", (err) => {
    console.error("❌ Failed to start backend server:", err);
    process.exit(1);
});

subprocess.on("exit", (code) => {
    if (code !== 0) {
        console.error(`❌ Backend server exited with code ${code}`);
        process.exit(code);
    } else {
        console.log("✅ Backend server exited cleanly.");
    }
});

subprocess.on("close", (code) => {
    if (code !== 0) {
        console.error(`❌ Backend server closed with code ${code}`);
        process.exit(code);
    } else {
        console.log("✅ Backend server closed successfully.");
    }
});
