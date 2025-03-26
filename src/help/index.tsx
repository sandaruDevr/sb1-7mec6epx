import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import EllipseBlur from '../dashboard/EllipseBlur';
import { Menu, Plus, Minus, Mail } from 'lucide-react';
import faqData from './faq.json';

const HelpSupport: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const toggleFaq = (faqId: string) => {
    setExpandedFaqs(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
  };

  return (
    <main id="help-support-main" className="flex min-h-screen bg-slate-50 font-jakarta">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <section id="help-support-content" className="flex-1 pl-5 pr-5 py-8 relative overflow-hidden">
        <div id="help-support-mobile-header" className="md:hidden flex justify-between items-center mb-6">
          <div id="help-support-mobile-logo-container" className="flex items-center gap-2">
            <img 
              id="help-support-mobile-logo-image" 
              src="/vite.svg" 
              alt="Logo" 
              className="w-8 h-8" 
            />
            <span id="help-support-mobile-logo-text" className="logo-text text-xl">
              Summary.gg
            </span>
          </div>
          <div 
            id="help-support-mobile-menu-wrapper" 
            className="relative w-10 h-10"
          >
            <button 
              id="help-support-mobile-menu-button"
              onClick={handleMenuClick}
              className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu id="help-support-mobile-menu-icon" className="w-6 h-6 text-gray-600 pointer-events-none" />
            </button>
          </div>
        </div>
        <EllipseBlur />
        
        <div id="help-support-header" className="mb-8">
          <h1 id="help-support-title" className="text-2xl font-medium text-black mb-2">
            Need assistance?
          </h1>
          <div id="help-support-contact" className="flex items-center gap-2 text-base text-black">
            <span>For any support questions, just shoot us an email at</span>
            <a 
              href="mailto:hello@summary.gg"
              className="text-[#00A3FF] hover:text-[#0096FF] transition-colors flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              hello@summary.gg
            </a>
          </div>
        </div>

        <div id="help-support-faq" className="bg-white rounded-lg p-6">
          <h2 id="help-support-faq-title" className="text-lg font-medium text-black mb-6">
            Check out our FAQ's below for answers.
          </h2>
          
          <div id="help-support-faq-list" className="space-y-4">
            {faqData.faqs.map((faq) => (
              <div 
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left py-2 transition-colors hover:text-[#00A3FF]"
                >
                  <span className="text-base font-medium">{faq.question}</span>
                  {expandedFaqs.includes(faq.id) ? (
                    <Minus className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 flex-shrink-0" />
                  )}
                </button>
                {expandedFaqs.includes(faq.id) && (
                  <div className="mt-2 text-gray-600 text-base leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HelpSupport;