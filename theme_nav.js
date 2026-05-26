const fs = require('fs');
const path = require('path');

function replaceInFile(filepath, replacements) {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  for (const [target, replacement] of replacements) {
    // using string replace for exact or global regex
    content = content.replace(target, replacement);
  }
  if (content !== original) {
    fs.writeFileSync(filepath, content);
    console.log('Updated ' + filepath);
  }
}

// Navbar.jsx
const navbarPath = path.join(__dirname, 'client/src/components/layout/Navbar.jsx');
replaceInFile(navbarPath, [
  [/background: 'rgba\(15, 23, 42, 0\.8\)'/g, "background: 'rgba(255, 255, 255, 0.8)'"],
  [/borderBottom: '1px solid rgba\(255,255,255,0\.05\)'/g, "borderBottom: '1px solid rgba(0,0,0,0.05)'"],
  [/text-white/g, "text-slate-900"],
  [/bg-white\/5/g, "bg-slate-100"],
  [/hover:bg-white\/10/g, "hover:bg-slate-200"],
  [/border-white\/10/g, "border-slate-200"],
  [/border-white\/5/g, "border-slate-100"],
  [/text-slate-300/g, "text-slate-700"],
  [/text-slate-400/g, "text-slate-500"],
  [/bg-slate-800/g, "bg-white"],
  [/background: 'rgba\(15, 23, 42, 0\.95\)'/g, "background: 'rgba(255, 255, 255, 0.95)'"],
  [/borderColor: 'rgba\(255,255,255,0\.1\)'/g, "borderColor: 'rgba(0,0,0,0.1)'"],
  [/bg-slate-900/g, "bg-slate-50"],
]);

console.log('Navbar updated.');
