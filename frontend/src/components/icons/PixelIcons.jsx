// Pixel Art Icon Components
// RPG-style pixel-art icons for the application

// Priority Icons
export const HighPriorityIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Sword - High Priority */}
    <rect x="14" y="2" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="6" width="4" height="4" fill="currentColor"/>
    <rect x="12" y="10" width="8" height="4" fill="currentColor"/>
    <rect x="14" y="14" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="18" width="4" height="4" fill="currentColor"/>
    <rect x="12" y="22" width="8" height="4" fill="currentColor"/>
    <rect x="10" y="26" width="12" height="4" fill="currentColor"/>
    {/* Handle */}
    <rect x="14" y="26" width="4" height="4" fill="currentColor" opacity="0.7"/>
  </svg>
);

export const MediumPriorityIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Shield - Medium Priority */}
    <rect x="12" y="4" width="8" height="4" fill="currentColor"/>
    <rect x="8" y="8" width="16" height="4" fill="currentColor"/>
    <rect x="6" y="12" width="20" height="4" fill="currentColor"/>
    <rect x="8" y="16" width="16" height="4" fill="currentColor"/>
    <rect x="10" y="20" width="12" height="4" fill="currentColor"/>
    <rect x="12" y="24" width="8" height="4" fill="currentColor"/>
    <rect x="14" y="28" width="4" height="2" fill="currentColor"/>
    {/* Center emblem */}
    <rect x="14" y="12" width="4" height="8" fill="currentColor" opacity="0.5"/>
  </svg>
);

export const LowPriorityIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Potion - Low Priority */}
    <rect x="12" y="4" width="8" height="4" fill="currentColor"/>
    <rect x="10" y="8" width="12" height="4" fill="currentColor"/>
    <rect x="8" y="12" width="16" height="12" fill="currentColor"/>
    <rect x="10" y="24" width="12" height="4" fill="currentColor"/>
    {/* Liquid inside */}
    <rect x="10" y="16" width="12" height="8" fill="currentColor" opacity="0.5"/>
    {/* Cork/stopper */}
    <rect x="14" y="4" width="4" height="4" fill="currentColor" opacity="0.7"/>
  </svg>
);

// Achievement/Trophy Icons
export const TrophyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Trophy */}
    <rect x="4" y="8" width="4" height="8" fill="currentColor"/>
    <rect x="24" y="8" width="4" height="8" fill="currentColor"/>
    <rect x="8" y="6" width="16" height="4" fill="currentColor"/>
    <rect x="10" y="10" width="12" height="8" fill="currentColor"/>
    <rect x="14" y="18" width="4" height="6" fill="currentColor"/>
    <rect x="10" y="24" width="12" height="4" fill="currentColor"/>
    {/* Trophy cup detail */}
    <rect x="12" y="12" width="8" height="4" fill="currentColor" opacity="0.5"/>
  </svg>
);

export const StarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Star */}
    <rect x="14" y="2" width="4" height="4" fill="currentColor"/>
    <rect x="10" y="6" width="4" height="4" fill="currentColor"/>
    <rect x="18" y="6" width="4" height="4" fill="currentColor"/>
    <rect x="6" y="10" width="20" height="4" fill="currentColor"/>
    <rect x="10" y="14" width="12" height="4" fill="currentColor"/>
    <rect x="8" y="18" width="4" height="6" fill="currentColor"/>
    <rect x="20" y="18" width="4" height="6" fill="currentColor"/>
    <rect x="12" y="22" width="8" height="6" fill="currentColor"/>
  </svg>
);

export const CrownIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Crown */}
    <rect x="4" y="12" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="8" width="4" height="4" fill="currentColor"/>
    <rect x="24" y="12" width="4" height="4" fill="currentColor"/>
    <rect x="6" y="16" width="20" height="4" fill="currentColor"/>
    <rect x="8" y="20" width="16" height="6" fill="currentColor"/>
    {/* Crown jewels */}
    <rect x="12" y="22" width="2" height="2" fill="currentColor" opacity="0.5"/>
    <rect x="18" y="22" width="2" height="2" fill="currentColor" opacity="0.5"/>
  </svg>
);

// Navigation Icons
export const HomeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated House/Dashboard */}
    <rect x="14" y="4" width="4" height="4" fill="currentColor"/>
    <rect x="10" y="8" width="12" height="4" fill="currentColor"/>
    <rect x="8" y="12" width="16" height="4" fill="currentColor"/>
    <rect x="6" y="16" width="20" height="12" fill="currentColor"/>
    {/* Door */}
    <rect x="14" y="20" width="4" height="8" fill="currentColor" opacity="0.3"/>
    {/* Window */}
    <rect x="10" y="20" width="4" height="4" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const ScrollIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Scroll/History */}
    <rect x="6" y="6" width="4" height="20" fill="currentColor"/>
    <rect x="22" y="6" width="4" height="20" fill="currentColor"/>
    <rect x="10" y="4" width="12" height="4" fill="currentColor"/>
    <rect x="10" y="24" width="12" height="4" fill="currentColor"/>
    <rect x="10" y="8" width="12" height="16" fill="currentColor"/>
    {/* Text lines */}
    <rect x="12" y="12" width="8" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="12" y="16" width="8" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="12" y="20" width="8" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const UserPixelIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated User/Hero */}
    <rect x="12" y="6" width="8" height="8" fill="currentColor"/>
    <rect x="10" y="14" width="12" height="4" fill="currentColor"/>
    <rect x="8" y="18" width="16" height="4" fill="currentColor"/>
    <rect x="6" y="22" width="8" height="4" fill="currentColor"/>
    <rect x="18" y="22" width="8" height="4" fill="currentColor"/>
    {/* Face details */}
    <rect x="14" y="8" width="2" height="2" fill="currentColor" opacity="0.5"/>
    <rect x="18" y="8" width="2" height="2" fill="currentColor" opacity="0.5"/>
  </svg>
);

export const ZapPixelIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Lightning Bolt */}
    <rect x="16" y="2" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="6" width="4" height="4" fill="currentColor"/>
    <rect x="12" y="10" width="4" height="4" fill="currentColor"/>
    <rect x="10" y="14" width="8" height="4" fill="currentColor"/>
    <rect x="16" y="18" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="22" width="4" height="4" fill="currentColor"/>
    <rect x="12" y="26" width="4" height="4" fill="currentColor"/>
  </svg>
);

export const CheckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Checkmark */}
    <rect x="24" y="6" width="4" height="4" fill="currentColor"/>
    <rect x="20" y="10" width="4" height="4" fill="currentColor"/>
    <rect x="16" y="14" width="4" height="4" fill="currentColor"/>
    <rect x="12" y="18" width="4" height="4" fill="currentColor"/>
    <rect x="8" y="14" width="4" height="4" fill="currentColor"/>
    <rect x="4" y="10" width="4" height="4" fill="currentColor"/>
  </svg>
);

export const PlusIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Plus */}
    <rect x="14" y="4" width="4" height="24" fill="currentColor"/>
    <rect x="4" y="14" width="24" height="4" fill="currentColor"/>
  </svg>
);

export const EditPixelIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Pencil/Edit */}
    <rect x="22" y="4" width="4" height="4" fill="currentColor"/>
    <rect x="18" y="8" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="12" width="4" height="4" fill="currentColor"/>
    <rect x="10" y="16" width="4" height="4" fill="currentColor"/>
    <rect x="6" y="20" width="4" height="4" fill="currentColor"/>
    <rect x="4" y="24" width="4" height="4" fill="currentColor"/>
    {/* Pencil tip */}
    <rect x="24" y="4" width="2" height="2" fill="currentColor" opacity="0.7"/>
  </svg>
);

export const TrashPixelIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Trash Can */}
    <rect x="10" y="4" width="12" height="4" fill="currentColor"/>
    <rect x="8" y="8" width="16" height="4" fill="currentColor"/>
    <rect x="8" y="12" width="16" height="14" fill="currentColor"/>
    <rect x="10" y="26" width="12" height="2" fill="currentColor"/>
    {/* Trash can lines */}
    <rect x="12" y="14" width="2" height="8" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="14" width="2" height="8" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const FilterPixelIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Filter/Funnel */}
    <rect x="4" y="6" width="24" height="4" fill="currentColor"/>
    <rect x="8" y="10" width="16" height="4" fill="currentColor"/>
    <rect x="12" y="14" width="8" height="4" fill="currentColor"/>
    <rect x="14" y="18" width="4" height="8" fill="currentColor"/>
  </svg>
);

export const TagPixelIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Tag/Label */}
    <rect x="14" y="4" width="10" height="4" fill="currentColor"/>
    <rect x="24" y="8" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="8" width="10" height="12" fill="currentColor"/>
    <rect x="10" y="12" width="4" height="4" fill="currentColor"/>
    <rect x="6" y="16" width="4" height="4" fill="currentColor"/>
    <rect x="10" y="20" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="20" width="10" height="4" fill="currentColor"/>
    {/* Tag hole */}
    <rect x="20" y="12" width="2" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const SwordPixelIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pixelated Sword (Logo/Brand) */}
    <rect x="14" y="2" width="4" height="4" fill="currentColor"/>
    <rect x="14" y="6" width="4" height="12" fill="currentColor"/>
    <rect x="10" y="18" width="12" height="4" fill="currentColor"/>
    <rect x="14" y="22" width="4" height="4" fill="currentColor"/>
    <rect x="12" y="26" width="8" height="4" fill="currentColor"/>
    {/* Blade shine */}
    <rect x="16" y="8" width="2" height="8" fill="currentColor" opacity="0.3"/>
  </svg>
);

