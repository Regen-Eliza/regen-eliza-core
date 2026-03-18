const fs = require('fs');

let content = fs.readFileSync('components/SentientDashboard.tsx', 'utf8');

// The Title block
const oldTitleRegex = /\/\* ─── ASCII TITLE ─── \*\/[\s\S]*?(?=\/\* ─── Color Palette ─── \*\/)/;
const newTitle = `/* ─── ASCII TITLE ─── */
const ASCII_TITLE = \`
   ██████  ███████ ██████  ███████ ███    ██     ███████ ██      ██ ███████ ███████ 
   ██   ██ ██      ██      ██      ████   ██     ██      ██      ██    ███  ██   ██ 
   ██████  █████   ██  ███ █████   ██ ██  ██     █████   ██      ██   ███   ███████ 
   ██   ██ ██      ██   ██ ██      ██  ██ ██     ██      ██      ██  ███    ██   ██ 
   ██   ██ ███████  ██████ ███████ ██   ████     ███████ ███████ ██ ███████ ██   ██ 
\`;

`;
content = content.replace(oldTitleRegex, newTitle);

// Colors replacement
content = content.replace(/#34e234/g, '#064006');
content = content.replace(/52,226,52/g, '6,64,6');
content = content.replace(/bg-\[#050505\]/g, 'bg-[#021002]');

fs.writeFileSync('components/SentientDashboard.tsx', content);

try {
   let avatar = fs.readFileSync('components/Avatar.tsx', 'utf8');
   avatar = avatar.replace(/#34e234/g, '#064006');
   fs.writeFileSync('components/Avatar.tsx', avatar);
} catch (e) { }
