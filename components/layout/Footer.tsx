import React from 'react';
import { GithubIcon, LinkedinIcon } from '../Icons';

interface FooterProps {
  onNavigate: (page: 'simulator' | 'about' | 'contact' | 'privacy' | 'terms') => void;
  onSelectAlgorithm: (algo: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectAlgorithm }) => {
  const handleAlgoClick = (algoName: string) => {
    onNavigate('simulator');
    onSelectAlgorithm(algoName);
    window.scrollTo(0, 0); // Scroll to top
  };
  
  const handlePageClick = (page: 'simulator' | 'about' | 'contact' | 'privacy' | 'terms') => {
    onNavigate(page);
    window.scrollTo(0, 0);
  }

  return (
    <footer className="bg-background-secondary border-t border-border text-text-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-3">
             <span className="text-accent-primary">CS</span>Lab
          </h3>
          <p className="text-sm mb-4">Where Algorithms Come Alive. An interactive platform for visualizing and understanding core computer science concepts.</p>
           <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="hover:text-accent-primary transition-colors"><GithubIcon className="w-6 h-6" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-accent-primary transition-colors"><LinkedinIcon className="w-6 h-6" /></a>
           </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Explore Algorithms</h3>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => handleAlgoClick('Dijkstra\'s')} className="hover:text-accent-primary transition-colors">Graph Algorithms</button></li>
            <li><button onClick={() => handleAlgoClick('Quick Sort')} className="hover:text-accent-primary transition-colors">Sorting & Searching</button></li>
            <li><button onClick={() => handleAlgoClick('Round Robin')} className="hover:text-accent-primary transition-colors">Operating Systems</button></li>
            <li><button onClick={() => handleAlgoClick('Huffman Coding')} className="hover:text-accent-primary transition-colors">Compression</button></li>
            <li><button onClick={() => handleAlgoClick('RSA Algorithm')} className="hover:text-accent-primary transition-colors">Cryptography</button></li>
            <li><button onClick={() => handlePageClick('simulator')} className="hover:text-accent-primary transition-colors font-semibold">View All →</button></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Learning Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><button className="hover:text-accent-primary transition-colors">Getting Started</button></li>
            <li><button className="hover:text-accent-primary transition-colors">Complexity Guide</button></li>
            <li><button className="hover:text-accent-primary transition-colors">Practice Problems</button></li>
            <li><button className="hover:text-accent-primary transition-colors">Teaching Resources</button></li>
          </ul>
        </div>
         <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => handlePageClick('about')} className="hover:text-accent-primary transition-colors">About Us</button></li>
            <li><button onClick={() => handlePageClick('contact')} className="hover:text-accent-primary transition-colors">Contact Us</button></li>
            <li><button onClick={() => handlePageClick('privacy')} className="hover:text-accent-primary transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => handlePageClick('terms')} className="hover:text-accent-primary transition-colors">Terms of Service</button></li>
          </ul>
        </div>
      </div>
      <div className="bg-background-primary py-4 text-center text-xs border-t border-border">
        <p>&copy; {new Date().getFullYear()} CSLab. Built with ❤️ for education.</p>
      </div>
    </footer>
  );
};

export default Footer;