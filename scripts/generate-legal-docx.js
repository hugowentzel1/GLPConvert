const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");

async function generateLegalDocx() {
  // Read the markdown file
  const markdownPath = path.join(__dirname, "../docs/Sunspire-legal.md");
  const markdownContent = fs.readFileSync(markdownPath, "utf8");

  // Parse markdown and convert to DOCX structure
  const sections = markdownContent.split("\n---\n");

  const children = [];

  sections.forEach((section) => {
    const lines = section.trim().split("\n");
    let currentHeading = null;
    let currentParagraph = [];

    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        // Main title
        if (currentParagraph.length > 0) {
          children.push(
            new Paragraph({
              children: currentParagraph.map(
                (text) => new TextRun({ text, break: 1 }),
              ),
            }),
          );
          currentParagraph = [];
        }
        children.push(
          new Paragraph({
            text: line.substring(2),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
        );
      } else if (line.startsWith("## ")) {
        // Section heading
        if (currentParagraph.length > 0) {
          children.push(
            new Paragraph({
              children: currentParagraph.map(
                (text) => new TextRun({ text, break: 1 }),
              ),
            }),
          );
          currentParagraph = [];
        }
        children.push(
          new Paragraph({
            text: line.substring(3),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
        );
      } else if (line.startsWith("### ")) {
        // Subsection heading
        if (currentParagraph.length > 0) {
          children.push(
            new Paragraph({
              children: currentParagraph.map(
                (text) => new TextRun({ text, break: 1 }),
              ),
            }),
          );
          currentParagraph = [];
        }
        children.push(
          new Paragraph({
            text: line.substring(4),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),
        );
      } else if (line.startsWith("- [ ]") || line.startsWith("- [x]")) {
        // Checklist item
        if (currentParagraph.length > 0) {
          children.push(
            new Paragraph({
              children: currentParagraph.map(
                (text) => new TextRun({ text, break: 1 }),
              ),
            }),
          );
          currentParagraph = [];
        }
        children.push(
          new Paragraph({
            text: line.substring(5),
            spacing: { before: 100, after: 50 },
            bullet: { level: 0 },
          }),
        );
      } else if (line.startsWith("- ")) {
        // List item
        if (currentParagraph.length > 0) {
          children.push(
            new Paragraph({
              children: currentParagraph.map(
                (text) => new TextRun({ text, break: 1 }),
              ),
            }),
          );
          currentParagraph = [];
        }
        children.push(
          new Paragraph({
            text: line.substring(2),
            spacing: { before: 100, after: 50 },
            bullet: { level: 0 },
          }),
        );
      } else if (line.trim() === "") {
        // Empty line
        if (currentParagraph.length > 0) {
          children.push(
            new Paragraph({
              children: currentParagraph.map(
                (text) => new TextRun({ text, break: 1 }),
              ),
            }),
          );
          currentParagraph = [];
        }
        children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      } else {
        // Regular text
        currentParagraph.push(line);
      }
    });

    // Add any remaining paragraph content
    if (currentParagraph.length > 0) {
      children.push(
        new Paragraph({
          children: currentParagraph.map(
            (text) => new TextRun({ text, break: 1 }),
          ),
        }),
      );
    }
  });

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  // Generate the DOCX file
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "../docs/Sunspire-legal.docx");
  fs.writeFileSync(outputPath, buffer);

  console.log("✅ Legal documentation DOCX generated successfully!");
  console.log(`📄 Output: ${outputPath}`);
}

// Run the script
generateLegalDocx().catch(console.error);
