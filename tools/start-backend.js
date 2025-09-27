const { exec, execSync } = require("child_process");
const os = require("os");
const path = require("path");
const fs = require("fs");
const open = require("open");

const isMac = os.platform() === "darwin";
const isWindows = os.platform() === "win32";
const dotenvPath = path.resolve(__dirname, "../main.env");

// 🧠 Load .env file on Windows only
if (isWindows && fs.existsSync(dotenvPath)) {
    require("dotenv").config({ path: dotenvPath });
    console.log("✅ Loaded main.env:", dotenvPath);
}

// 🧠 Auto-detect JAVA_HOME on macOS if not set, but allow override
if (isMac) {
    if (!process.env.JAVA_HOME) {
        try {
            const javaHome = execSync("/usr/libexec/java_home -v 21").toString().trim();
            if (javaHome) {
                process.env.JAVA_HOME = javaHome;
                console.log("🔍 Auto-detected JAVA_HOME (Java 21):", javaHome);
            }
        } catch (err) {
            console.error("❌ Could not auto-detect JAVA_HOME on macOS:", err);
            process.exit(1);
        }
    } else {
        console.log("🔍 Using pre-set JAVA_HOME:", process.env.JAVA_HOME);
    }
}

// ❌ Fallback check
if (!process.env.JAVA_HOME) {
    console.error("❌ JAVA_HOME is not set. Please define it in your system or .env file.");
    process.exit(1);
}

console.log("✅ JAVA_HOME:", process.env.JAVA_HOME);
const command = isWindows ? "mvnw.cmd spring-boot:run" : "./mvnw spring-boot:run";
console.log("🚀 Starting backend with:", command);

const subprocess = exec(command, {
    cwd: path.resolve(__dirname, ".."),
    env: process.env,
});

// Wait for backend to start before opening browser
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
