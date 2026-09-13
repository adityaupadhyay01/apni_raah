/**
 * data.js — HTML_LEVELS
 * Each level has: id, title, instruction, hint, starterCode, answer, xp
 */

export const HTML_LEVELS = [
  {
    id: 1,
    title: "The DOCTYPE Declaration",
    instruction: `Every HTML document must start with a DOCTYPE declaration.
It tells the browser which version of HTML to use.

📌 Task:
Write a valid HTML5 DOCTYPE declaration.

Expected output in your code:
  <!DOCTYPE html>`,
    hint: "Type exactly: <!DOCTYPE html>",
    starterCode: `<!-- Write your DOCTYPE declaration below -->
`,
    answer: "<!DOCTYPE html>",
    xp: 100,
  },
  {
    id: 2,
    title: "HTML & Body Structure",
    instruction: `A proper HTML document has an <html> root element
that wraps a <head> and a <body>.

📌 Task:
Write an HTML document that includes:
  • <html> tag
  • <body> tag
  • A <p> tag inside body with any text`,
    hint: "Make sure <html>, <body>, and <p> are all present.",
    starterCode: `<!DOCTYPE html>
<!-- Add your html, body, and p tags here -->
`,
    answer: "<p>",
    xp: 250,
  },
  {
    id: 3,
    title: "The <title> Tag",
    instruction: `The <title> tag sets the tab name in the browser.
It lives inside the <head> section.

📌 Task:
Build a complete HTML page that includes:
  • <head> section
  • <title> tag inside <head> with any text
  • <body> with an <h1> heading`,
    hint: "Put <title>...</title> inside your <head> tags.",
    starterCode: `<!DOCTYPE html>
<html>
  <!-- Add head with title, and body with h1 -->
</html>
`,
    answer: "<title>",
    xp: 400,
  },
];