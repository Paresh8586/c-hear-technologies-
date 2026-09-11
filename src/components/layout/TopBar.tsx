import React from 'react';
import { Phone, Mail, Facebook, Linkedin, Twitter } from 'lucide-react';

const TopBar: React.FC = () => (
  <div className="bg-brand-black text-white text-xs overflow-x-hidden w-full">
    <div className="max-w-[1480px] mx-auto px-4 md:px-9 h-10 flex items-center justify-between min-w-0">
      <div className="flex items-center gap-5">
        <a href="tel:+442038078262" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <Phone size={12} />
          <span>0203 807 8262</span>
        </a>
        <a href="mailto:info@c-hear.co.uk" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <Mail size={12} />
          <span>info@c-hear.co.uk</span>
        </a>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <a href="https://www.facebook.com/people/C-Hear-Technologies/61554351617790/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook size={13} /></a>
        <a href="https://www.linkedin.com/company/c-hear-technologies" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors"><Linkedin size={13} /></a>
        <a href="https://twitter.com/CHearTech" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="hover:text-primary transition-colors"><Twitter size={13} /></a>
      </div>
    </div>
  </div>
);

export default TopBar;
