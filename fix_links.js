const fs = require('fs');
const path = require('path');

const root = 'c:/Users/misae/OneDrive/Documents/Portfolio';
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && full.endsWith('.html')) files.push(full);
  }
}

walk(root);

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;

  text = text.replace(/([A-Za-z-]+)=(['"])(\/[^'"\s>]+)(\2)/g, (match, attr, quote, value, _endQuote) => {
    if (!value.startsWith('/')) return match;

    const original = value;
    const pathPart = value.split('?')[0].split('#')[0];
    let target = path.join(root, pathPart.replace(/^\//, ''));

    if (pathPart.endsWith('/') || fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        const index = path.join(target, 'index.html');
        if (fs.existsSync(index)) target = index;
      }
    } else if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      const index = path.join(target, 'index.html');
      if (fs.existsSync(index)) target = index;
    }

    if (!fs.existsSync(target) && !pathPart.endsWith('/')) return match;

    let rel = path.relative(path.dirname(file), target).split('\\').join('/');
    if (rel === '.') rel = '';
    if (original.endsWith('/') && rel && !rel.endsWith('/')) rel += '/';

    let suffix = '';
    if (value.includes('?')) suffix += '?' + value.split('?')[1].split('#')[0];
    if (value.includes('#')) suffix += '#' + value.split('#').slice(1).join('#');

    let newValue = rel ? rel : '';
    if (newValue === '' && original === '/') newValue = '.';
    const result = `${attr}=${quote}${newValue}${suffix}${quote}`;
    if (result !== match) changed = true;
    return result;
  });

  if (changed) {
    fs.writeFileSync(file, text, 'utf8');
    console.log('Updated', path.relative(root, file));
  }
}
