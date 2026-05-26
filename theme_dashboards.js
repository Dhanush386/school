const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      replaceTheme(fullPath);
    }
  });
}

function replaceTheme(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  const replacements = [
    [/rgba\(30,41,59,0\.8\)/g, "rgba(255,255,255,1)"], // glass cards to white
    [/text-white/g, "text-slate-900"],
    [/text-slate-400/g, "text-slate-500"],
    [/border-white\/5/g, "border-slate-200"],
    [/border-white\/10/g, "border-slate-200"],
    [/bg-white\/5/g, "bg-slate-50"],
    [/bg-white\/10/g, "bg-slate-100"],
    [/hover:bg-white\/3/g, "hover:bg-slate-50"],
    [/hover:bg-white\/5/g, "hover:bg-slate-100"],
    [/hover:bg-white\/10/g, "hover:bg-slate-200"],
    [/bg-slate-800/g, "bg-white"],
    [/bg-slate-900/g, "bg-slate-50"],
    [/text-slate-300/g, "text-slate-700"],
    [/divide-white\/5/g, "divide-slate-200"],
    [/divide-white\/10/g, "divide-slate-200"],
    [/from-slate-800/g, "from-white"],
    [/to-slate-900/g, "to-slate-50"],
  ];
  
  for (const [target, replacement] of replacements) {
    content = content.replace(target, replacement);
  }
  
  if (content !== original) {
    fs.writeFileSync(filepath, content);
    console.log('Updated ' + filepath);
  }
}

// Process dashboard and academic pages
processDir(path.join(__dirname, 'client/src/pages/dashboard'));
processDir(path.join(__dirname, 'client/src/pages/academic'));

console.log('Dashboards and Academic pages updated.');
