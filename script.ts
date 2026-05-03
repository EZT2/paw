import fs from 'fs';

const files = ['src/App.tsx', 'src/components/CommentWidget.tsx'];

const replacements: Record<string, string> = {
  'natural-bg': 'modern-bg',
  'natural-text': 'modern-text',
  'natural-accent': 'modern-accent',
  'natural-dark': 'modern-text',
  'natural-yellow': 'modern-accent-light',
  'natural-orange': 'modern-border',
  'natural-cream': 'modern-accent-light',
  'natural-map': 'modern-bg',
  'font-serif': 'font-heading',
  'natural-card': 'modern-card',
  'natural-button': 'modern-button-accent',
  'natural-input': 'modern-input',
  'shadow-orange-100': 'shadow-sm',
  'shadow-orange-200': 'shadow-md'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), value);
  }
  fs.writeFileSync(file, content);
});
console.log('Replaced successfully');
