
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, CodeIcon, NewspaperIcon } from './Icons';
import type { Algorithm } from '../types';

type Page = 'simulator' | 'about' | 'contact' | 'privacy' | 'terms';

interface Command {
    type: 'algorithm' | 'page';
    id: string;
    title: string;
    category?: string;
    icon: React.ReactElement<{ className?: string }>;
    action: () => void;
}

interface CommandPaletteProps {
    algorithms: Algorithm[];
    onClose: () => void;
    onSelectAlgorithm: (algoName: string) => void;
    onSelectPage: (page: Page) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ algorithms, onClose, onSelectAlgorithm, onSelectPage }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const commands: Command[] = useMemo(() => {
        const algoCommands: Command[] = algorithms.map(algo => ({
            type: 'algorithm',
            id: algo.name,
            title: algo.name,
            category: algo.category,
            icon: <CodeIcon className="w-4 h-4 text-text-tertiary" />,
            action: () => onSelectAlgorithm(algo.name),
        }));
        
        const pageCommands: Command[] = [
            { type: 'page', id: 'about', title: 'About Us', icon: <NewspaperIcon className="w-4 h-4 text-text-tertiary" />, action: () => onSelectPage('about') },
            { type: 'page', id: 'contact', title: 'Contact', icon: <NewspaperIcon className="w-4 h-4 text-text-tertiary" />, action: () => onSelectPage('contact') },
        ];
        
        return [...algoCommands, ...pageCommands];
    }, [algorithms, onSelectAlgorithm, onSelectPage]);

    const filteredCommands = useMemo(() => {
        if (!query) return commands;
        const lowerCaseQuery = query.toLowerCase();
        return commands.filter(cmd => 
            cmd.title.toLowerCase().includes(lowerCaseQuery) ||
            (cmd.category && cmd.category.toLowerCase().includes(lowerCaseQuery))
        );
    }, [query, commands]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'Enter') {
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredCommands, selectedIndex, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20" aria-modal="true" role="dialog">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60" 
                onClick={onClose}
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-lg bg-background-secondary border border-border rounded-lg shadow-2xl overflow-hidden"
            >
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-text-tertiary" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search algorithms or pages..."
                        className="w-full bg-transparent border-b border-border h-14 pl-12 pr-4 text-text-primary placeholder-text-tertiary focus:outline-none"
                    />
                </div>
                <ul className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, index) => (
                            <li
                                key={cmd.id}
                                onClick={cmd.action}
                                onMouseMove={() => setSelectedIndex(index)}
                                className={`flex items-center justify-between p-3 rounded-md cursor-pointer text-sm ${selectedIndex === index ? 'bg-accent-primary text-white' : 'text-text-secondary'}`}
                            >
                                <div className="flex items-center gap-3">
                                    {React.cloneElement(cmd.icon, { className: `w-4 h-4 ${selectedIndex === index ? 'text-white' : 'text-text-tertiary'}`})}
                                    <span>{cmd.title}</span>
                                </div>
                                {cmd.category && (
                                    <span className={`text-xs ${selectedIndex === index ? 'text-blue-200' : 'text-text-tertiary'}`}>
                                        {cmd.category}
                                    </span>
                                )}
                            </li>
                        ))
                    ) : (
                        <p className="p-4 text-center text-sm text-text-tertiary">No results found.</p>
                    )}
                </ul>
                <div className="border-t border-border bg-background-elevated px-4 py-2 text-xs text-text-tertiary flex justify-between">
                    <span>↑↓ to navigate</span>
                    <span>↵ to select</span>
                    <span>ESC to close</span>
                </div>
            </motion.div>
        </div>
    );
};

export default CommandPalette;
