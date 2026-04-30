import fs from 'fs';
import path from 'path';

const files = [
  'src/screens/Flashcards.tsx',
  'src/screens/Home.tsx',
  'src/screens/MockTests.tsx',
  'src/screens/About.tsx',
  'src/screens/Settings.tsx',
  'src/index.css'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/text-slate-300/g, 'text-slate-400');
    content = content.replace(/text-slate-600/g, 'text-slate-700');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
