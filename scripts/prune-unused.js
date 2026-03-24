// scripts/prune-unused.js
const fs = require("fs");
const path = require("path");
const { glob } = require("fast-glob");
const { minimatch } = require("minimatch");

const ROOT = process.cwd();
const IGNORE = [
  "node_modules/**",
  ".next/**",
  ".git/**",
  "test-results/**",
  "playwright-report/**",
];

const KEEP_GLOBS = [
  "public/**",
  "**/*.d.ts",
  "next.config.*",
  "tailwind.config.*",
  "postcss.config.*",
  ".eslintrc.*",
  ".prettierrc.*",
  "sitemap.*",
  "next-sitemap.*",
  "**/*.css",
  "**/*.scss",
  ".env*",
  ".vercel/**",
  ".github/**",
  ".vscode/**",
  "scripts/**",
  "tests/**",
  "*.png",
  "*.jpg",
  "*.jpeg",
  "*.gif",
  "*.svg",
  "*.ico",
  "*.md",
  "*.txt",
  "*.sh",
  "*.json",
  "*.lock",
];

const isKeptByRule = (rel) => KEEP_GLOBS.some((g) => minimatch(rel, g));

async function main() {
  console.log("🔍 Scanning for potentially unused files...");

  const allFiles = await glob(["**/*"], {
    cwd: ROOT,
    dot: true,
    ignore: IGNORE,
  });

  // Simple heuristic: look for files that might be unused
  const candidates = allFiles.filter((rel) => {
    if (IGNORE.some((g) => minimatch(rel, g))) return false;
    if (isKeptByRule(rel)) return false;

    // Look for common unused file patterns
    const fileName = path.basename(rel);
    const isUnusedPattern =
      fileName.startsWith(".") ||
      fileName.includes("debug") ||
      fileName.includes("temp") ||
      fileName.includes("test") ||
      fileName.includes("spec") ||
      fileName.endsWith(".log") ||
      fileName.endsWith(".tmp") ||
      fileName.endsWith(".bak");

    return isUnusedPattern;
  });

  const deleteFlag = process.argv.includes("--delete");
  if (!deleteFlag) {
    console.log("DRY RUN — potentially unused files:");
    candidates.sort().forEach((c) => console.log("  ", c));
    console.log(
      `\n${candidates.length} file(s) would be removed. Run with --delete to actually delete.`,
    );
    console.log(
      "\n⚠️  This is a simple heuristic. Please review files before deleting!",
    );
  } else {
    console.log("🗑️  Deleting unused files...");
    for (const rel of candidates) {
      const abs = path.join(ROOT, rel);
      try {
        fs.unlinkSync(abs);
        console.log("deleted:", rel);
      } catch (e) {
        console.error("failed to delete:", rel, e);
      }
    }
    console.log(`✅ Deleted ${candidates.length} files`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
