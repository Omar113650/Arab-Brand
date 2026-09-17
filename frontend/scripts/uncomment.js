const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "pages", "Dashboard.tsx");
const content = fs.readFileSync(filePath, "utf8");
const lines = content.split(/\r?\n/);

const result = lines.map(line => {
  if (line.startsWith("// ")) return line.slice(3);
  if (line === "//") return "";
  return line;
});

fs.writeFileSync(filePath, result.join("\n"), "utf8");
console.log("Done! Total lines:", lines.length);
