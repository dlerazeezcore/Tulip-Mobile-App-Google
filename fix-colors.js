const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Fix bottom nav hover
appContent = appContent.replace(/hover:text-white/g, 'hover:text-foreground');

// Fix text-white on input
appContent = appContent.replace(/text-white font-mono/g, 'text-foreground font-mono');

// Fix chat agent background
appContent = appContent.replace(/bg-muted border border-border text-white/, 'bg-card border border-border text-foreground');

// Fix chat input
appContent = appContent.replace(/className="flex-1 bg-muted border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:border-primary transition-colors"/, 'className="flex-1 bg-card border border-border rounded-full px-5 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors hover:text-foreground placeholder:text-muted-foreground"');

// Fix chat send button icon (actually text-white bg-primary disabled:bg-muted disabled:text-muted-foreground is fine)

// Save App.tsx
fs.writeFileSync('src/App.tsx', appContent);

// Fix Profile.tsx
let profileContent = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
profileContent = profileContent.replace(/hover:text-white/g, 'hover:text-foreground');
fs.writeFileSync('src/pages/Profile.tsx', profileContent);

console.log("Colors fixed");
