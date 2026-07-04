import { Project, SyntaxKind, Node, VariableStatement, SourceFile } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.app.json",
});

const arabicTRegex = /t\(["']/;

function fixFile(sourceFile: SourceFile) {
  const filePath = sourceFile.getFilePath();
  console.log(`\nChecking ${sourceFile.getBaseName()}...`);
  
  // Find all top-level variable statements that contain t() calls
  const topLevelStatements = sourceFile.getStatements();
  
  // Find the first exported function/arrow function component
  let exportedFunctionBody: import("ts-morph").Block | null = null;
  let insertPosition = 0;
  
  for (const stmt of topLevelStatements) {
    if (Node.isFunctionDeclaration(stmt) && stmt.isExported()) {
      const body = stmt.getBody();
      if (body && Node.isBlock(body)) {
        exportedFunctionBody = body;
        // Insert after the first statement (usually `const { t } = useTranslation()`)
        insertPosition = 1;
        break;
      }
    }
    if (Node.isExportAssignment(stmt)) {
      break;
    }
  }

  if (!exportedFunctionBody) {
    // Try to find default export variable
    for (const stmt of topLevelStatements) {
      if (Node.isVariableStatement(stmt)) {
        const decls = stmt.getDeclarationList().getDeclarations();
        for (const decl of decls) {
          const init = decl.getInitializer();
          if (init && Node.isArrowFunction(init)) {
            const body = init.getBody();
            if (body && Node.isBlock(body)) {
              exportedFunctionBody = body;
              insertPosition = 1;
              break;
            }
          }
        }
      }
      if (exportedFunctionBody) break;
    }
  }

  if (!exportedFunctionBody) {
    console.log(`  Could not find exported component function, skipping.`);
    return false;
  }

  // Collect top-level variable statements using t()
  const toMove: VariableStatement[] = [];
  for (const stmt of topLevelStatements) {
    if (Node.isVariableStatement(stmt)) {
      const text = stmt.getText();
      if (arabicTRegex.test(text)) {
        toMove.push(stmt);
      }
    }
  }

  if (toMove.length === 0) {
    console.log(`  No module-level t() calls found.`);
    return false;
  }

  console.log(`  Found ${toMove.length} module-level statements using t() to move inside component`);

  // Collect text of statements to move
  const statementsText = toMove.map(s => s.getText()).join("\n");

  // Remove them from top level (in reverse order to not mess indices)
  for (let i = toMove.length - 1; i >= 0; i--) {
    toMove[i].remove();
  }

  // Insert into component body after the useTranslation line
  const bodyStatements = exportedFunctionBody.getStatements();
  const insertIdx = Math.min(insertPosition, bodyStatements.length);
  exportedFunctionBody.insertStatements(insertIdx, statementsText);

  sourceFile.saveSync();
  console.log(`  Fixed ${sourceFile.getBaseName()}`);
  return true;
}

const files = [
  "src/pages/LandingPage.tsx",
  "src/pages/Dashboard.tsx",
];

for (const filePath of files) {
  const sf = project.getSourceFile(filePath);
  if (!sf) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  fixFile(sf);
}

console.log("\nDone!");
