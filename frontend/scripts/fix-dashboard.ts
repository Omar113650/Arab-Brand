import { Project, SyntaxKind, Node } from "ts-morph";
import * as fs from "fs";

const project = new Project({ tsConfigFilePath: "tsconfig.app.json" });

// ─── Fix Dashboard.tsx ────────────────────────────────────────────────────────
const dash = project.getSourceFile("src/pages/Dashboard.tsx")!;

// 1. Add useTranslation import if missing
const hasI18n = dash.getImportDeclarations()
  .some(d => d.getModuleSpecifierValue() === "react-i18next");
if (!hasI18n) {
  dash.addImportDeclaration({ namedImports: ["useTranslation"], moduleSpecifier: "react-i18next" });
  console.log("Added useTranslation import to Dashboard.tsx");
}

// 2. Remove the module-level STYLES, COLORS, PHASES with broken encoding
// and replace with clean versions using t()
const topStatements = dash.getStatements();

let removedStyles = false, removedColors = false, removedPhases = false;

for (let i = topStatements.length - 1; i >= 0; i--) {
  const stmt = topStatements[i];
  if (!Node.isVariableStatement(stmt)) continue;
  const text = stmt.getText();
  if (text.includes("const STYLES")) { stmt.remove(); removedStyles = true; }
  else if (text.includes("const COLORS")) { stmt.remove(); removedColors = true; }
  else if (text.includes("const PHASES")) { stmt.remove(); removedPhases = true; }
}
console.log(`Removed: STYLES=${removedStyles}, COLORS=${removedColors}, PHASES=${removedPhases}`);

// 3. Find the Dashboard function and inject at the top
const dashFn = dash.getFunction("Dashboard");
if (!dashFn) { console.error("Could not find Dashboard function!"); process.exit(1); }

const body = dashFn.getBody();
if (!body || !Node.isBlock(body)) { console.error("No body!"); process.exit(1); }

// Find if `const { t }` already exists
const bodyText = body.getText();
const hasT = bodyText.includes("useTranslation()");

// Insert at position 0 (very top of function)
const insertCode = `
  const { t, i18n } = useTranslation();

  const STYLES = [
    { id: "modern", label: t("txt_277"), en: "Modern" },
    { id: "luxury", label: t("txt_276"), en: "Luxury" },
    { id: "youth",  label: t("txt_275"), en: "Youthful" },
    { id: "minimal",label: t("txt_274"), en: "Minimal" },
    { id: "arabic", label: t("txt_273"), en: "Heritage" },
    { id: "tech",   label: t("txt_272"), en: "Tech" },
  ];

  const COLORS = [
    { id: "gold",   label: t("txt_271"), hex: "#C9973A" },
    { id: "navy",   label: t("txt_270"), hex: "#1B3A6B" },
    { id: "green",  label: t("txt_269"), hex: "#16A34A" },
    { id: "red",    label: t("txt_268"), hex: "#DC2626" },
    { id: "purple", label: t("txt_267"), hex: "#7C3AED" },
    { id: "teal",   label: t("txt_266"), hex: "#0D9488" },
    { id: "black",  label: t("txt_265"), hex: "#1A1A1A" },
    { id: "coral",  label: t("txt_264"), hex: "#EA580C" },
  ];

  const PHASES = [
    { key: "brand",       label: t("txt_263"), pct: 25 },
    { key: "logo",        label: t("txt_262"), pct: 45 },
    { key: "social",      label: t("txt_261"), pct: 65 },
    { key: "landing",     label: t("txt_260"), pct: 80 },
    { key: "competitors", label: t("txt_259"), pct: 95 },
  ];
`;

body.insertStatements(0, insertCode);
console.log("Injected t()-based STYLES, COLORS, PHASES into Dashboard()");

// 4. Fix any remaining `.ar` references to use `.label`
// (the old code used `.ar` for display, new code uses `.label`)
dash.saveSync();

// Now do a text-based find/replace for `.ar` -> `.label` in STYLES/COLORS usage
let content = fs.readFileSync("src/pages/Dashboard.tsx", "utf8");

// Replace s.ar -> s.label and c.ar -> c.label patterns (only in JSX rendering context)
content = content.replace(/\bs\.ar\b/g, "s.label");
content = content.replace(/\bc\.ar\b/g, "c.label");
content = content.replace(/\bcolor\.ar\b/g, "color.label");

fs.writeFileSync("src/pages/Dashboard.tsx", content, "utf8");
console.log("Fixed .ar -> .label references");

console.log("\nDashboard.tsx fixed!");
