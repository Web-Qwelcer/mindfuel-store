/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs")
const path = require("path")

const root = process.cwd();

const INCLUDE_DIRS = ["app", "prisma", "services", "lib"];
const INCLUDE_FILES = ["package.json"];

const IGNORE_DIRS = ["node_modules", ".next", "public"];
const IGNORE_FILES = ["snapshot.txt", "dev.db"];

function shouldIgnore(filePath) {
  return (
    IGNORE_DIRS.some((dir) => filePath.includes(`${path.sep}${dir}`)) ||
    IGNORE_FILES.some((file) => filePath.endsWith(file))
  );
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);

    if (shouldIgnore(fullPath)) return;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".tsx") ||
      fullPath.endsWith(".js") ||
      fullPath.endsWith(".json") ||
      fullPath.endsWith(".prisma")
    ) {
      fileList.push(path.relative(root, fullPath));
    }
  });

  return fileList;
}

function readFileSafe(filePath) {
  const fullPath = path.join(root, filePath);

  if (!fs.existsSync(fullPath)) {
    return `\n\n===== ${filePath} =====\n\n// ❌ Missing file`;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  return `\n\n===== ${filePath} =====\n\n${content}`;
}

let output = `PROJECT SNAPSHOT\nGenerated: ${new Date().toISOString()}\n`;

let collectedFiles = [];

// Include fixed root files
INCLUDE_FILES.forEach((file) => {
  collectedFiles.push(file);
});

// Include directories recursively
INCLUDE_DIRS.forEach((dir) => {
  const fullDirPath = path.join(root, dir);
  if (fs.existsSync(fullDirPath)) {
    walkDir(fullDirPath, collectedFiles);
  }
});

// Remove duplicates & sort for deterministic output
collectedFiles = [...new Set(collectedFiles)].sort();

collectedFiles.forEach((file) => {
  output += readFileSafe(file);
});

fs.writeFileSync(path.join(root, "snapshot.txt"), output);

console.log("✅ snapshot.txt generated (recursive)");