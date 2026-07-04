import { Project, SyntaxKind, Node } from "ts-morph";
import * as fs from "fs";

const project = new Project({
  tsConfigFilePath: "tsconfig.app.json",
});

const arabicRegex = /[\u0600-\u06FF]/;
const translations: Record<string, string> = {};

let idCounter = 1;
function generateKey(text: string) {
  return `txt_${idCounter++}`;
}

const sourceFiles = project.getSourceFiles("src/{pages,components}/**/*.tsx");

for (const sourceFile of sourceFiles) {
  let hasChanges = false;
  
  // Find all JSX Text nodes
  const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
  // We process in reverse to not mess up offsets when replacing
  for (let i = jsxTexts.length - 1; i >= 0; i--) {
    const jsxText = jsxTexts[i];
    const text = jsxText.getText();
    if (arabicRegex.test(text) && text.trim().length > 0) {
      const cleanText = text.trim();
      const key = generateKey(cleanText);
      translations[key] = cleanText;
      
      const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const pre = match ? match[1] : "";
      const post = match ? match[3] : "";
      
      jsxText.replaceWithText(`${pre}{t("${key}")}${post}`);
      hasChanges = true;
    }
  }

  // Find all String Literals
  const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
  for (let i = stringLiterals.length - 1; i >= 0; i--) {
    const stringLiteral = stringLiterals[i];
    const text = stringLiteral.getLiteralValue();
    if (arabicRegex.test(text) && text.trim().length > 0) {
      const key = generateKey(text);
      translations[key] = text;
      
      const parent = stringLiteral.getParent();
      if (Node.isJsxAttribute(parent)) {
        stringLiteral.replaceWithText(`{t("${key}")}`);
      } else if (Node.isPropertyAssignment(parent) && parent.getNameNode() === stringLiteral) {
        stringLiteral.replaceWithText(`[t("${key}")]`);
      } else {
        stringLiteral.replaceWithText(`t("${key}")`);
      }
      hasChanges = true;
    }
  }

  if (hasChanges) {
    const importDecl = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === "react-i18next");
    if (!importDecl) {
      sourceFile.addImportDeclaration({
        namedImports: ["useTranslation"],
        moduleSpecifier: "react-i18next",
      });
    }

    const functions = sourceFile.getFunctions();
    for (const func of functions) {
        if (func.isExported() || func.isDefaultExport()) {
            const body = func.getBody();
            if (Node.isBlock(body)) {
                if (!body.getText().includes("useTranslation")) {
                    body.insertStatements(0, "const { t } = useTranslation();");
                }
            }
        }
    }
    
    sourceFile.saveSync();
    console.log(`Updated ${sourceFile.getBaseName()}`);
  }
}

const arJsonPath = "src/locales/ar_extracted.json";
fs.writeFileSync(arJsonPath, JSON.stringify(translations, null, 2), "utf8");
console.log(`Translations saved to ${arJsonPath}`);
