const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace main content switch
const startMarker = `            {/* HOME VIEW (Open to all) */}`;
// Note: We want to preserve `</AnimatePresence>`
const endMarker = `          </AnimatePresence>`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) +
    `            {activeTab === 'home' && <Home handleProtectedAction={handleProtectedAction} />}
            {activeTab === 'bookings' && <Trips setActiveTab={setActiveTab} setShowAuthModal={setShowAuthModal} />}
            {activeTab === 'profile' && <Profile isDark={isDark} setIsDark={setIsDark} setShowSupportChat={setShowSupportChat} setShowAuthModal={setShowAuthModal} />}
` + content.slice(endIndex);
  
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully refactored App.tsx');
} else {
  console.log('Could not find markers');
}
