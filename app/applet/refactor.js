const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace imports and TulipLogo
content = content.replace(
  /import \{ motion, AnimatePresence \} from 'motion\/react';[\s\S]*?\n\);/m,
  `import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Calendar, User, Phone,
  MessageCircle, Paperclip, Bell, ChevronRight, Send
} from 'lucide-react';
import { ServiceType } from './constants';
import { useAuth } from './lib/auth';
import { TulipLogo } from './components/TulipLogo';
import Home from './pages/Home';
import Trips from './pages/Trips';
import Profile from './pages/Profile';`
);

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
