
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './features/common/LandingPage';
import CommandPalette from './components/CommandPalette';

// Page Components
import AboutPage from './features/common/AboutPage';
import ContactPage from './features/common/ContactPage';
import CategorySelectionPage from './features/common/CategorySelectionPage';
import AlgorithmSelectionPage from './features/common/AlgorithmSelectionPage';
import PrivacyPolicyPage from './features/common/PrivacyPolicyPage';
import TermsOfServicePage from './features/common/TermsOfServicePage';

// Sorting
import BubbleSortPage from './features/sorting/BubbleSortPage';
import InsertionSortPage from './features/sorting/InsertionSortPage';
import MergeSortPage from './features/sorting/MergeSortPage';
import QuickSortPage from './features/sorting/QuickSortPage';
import SelectionSortPage from './features/sorting/SelectionSortPage';
// OS
import FCFSSchedulingPage from './features/operating-systems/FCFSSchedulingPage';
import SJFSchedulingPage from './features/operating-systems/SJFSchedulingPage';
import RoundRobinPage from './features/operating-systems/RoundRobinPage';
import PrioritySchedulingPage from './features/operating-systems/PrioritySchedulingPage';
import BankersAlgorithmPage from './features/operating-systems/BankersAlgorithmPage';
// Cryptography
import CaesarCipherPage from './features/cryptography/CaesarCipherPage';
import RSAPage from './features/cryptography/RSAPage';
// Number Systems
import BaseConversionPage from './features/number-systems/BaseConversionPage';
import TwosComplementPage from './features/number-systems/TwosComplementPage';
import IEEE754Page from './features/number-systems/IEEE754Page';
import SignedMagnitudePage from './features/number-systems/SignedMagnitudePage';
// Memory Management
import FIFOPageReplacementPage from './features/memory-management/FIFOPageReplacementPage';
import LRUPageReplacementPage from './features/memory-management/LRUPageReplacementPage';
import OptimalPageReplacementPage from './features/memory-management/OptimalPageReplacementPage';
// Compression
import HuffmanCodingPage from './features/compression/HuffmanCodingPage';
import RunLengthEncodingPage from './features/compression/RunLengthEncodingPage';
import LZWPage from './features/compression/LZWPage';
// Graph
import DijkstrasPage from './features/graph-algorithms/DijkstrasPage';
import BFSDFSPage from './features/graph-algorithms/BFSDFSPage';
import KruskalsPage from './features/graph-algorithms/KruskalsPage';
import PrimsPage from './features/graph-algorithms/PrimsPage';
import BellmanFordPage from './features/graph-algorithms/BellmanFordPage';
// Error Control
import ParityBitsPage from './features/error-control/ParityBitsPage';
import ChecksumPage from './features/error-control/ChecksumPage';
import CRCPage from './features/error-control/CRCPage';
import HammingCodePage from './features/error-control/HammingCodePage';
// Disk Scheduling
import FCFSDiskPage from './features/disk-scheduling/FCFSDiskPage';
import SSTFPage from './features/disk-scheduling/SSTFPage';
import SCANPage from './features/disk-scheduling/SCANPage';
import CSCANPage from './features/disk-scheduling/CSCANPage';
// Database
import NormalizationPage from './features/database/NormalizationPage';
import SerializabilityPage from './features/database/SerializabilityPage';
import TransactionSchedulesPage from './features/database/TransactionSchedulesPage';
// Automata
import DFAAcceptancePage from './features/automata/DFAAcceptancePage';
import RegexToDFAPage from './features/automata/RegexToDFAPage';
import CFGPage from './features/automata/CFGPage';
// Logic Circuits
import LogicGatePage from './features/logic-circuits/LogicGatePage';
import BooleanAlgebraPage from './features/logic-circuits/BooleanAlgebraPage';
import KMapPage from './features/logic-circuits/KMapPage';
// Computer Networks
import StopAndWaitARQPage from './features/computer-networks/StopAndWaitARQPage';
import GoBackNARQPage from './features/computer-networks/GoBackNARQPage';
import SelectiveRepeatARQPage from './features/computer-networks/SelectiveRepeatARQPage';
import CSMACDPage from './features/computer-networks/CSMACDPage';
import DistanceVectorRoutingPage from './features/computer-networks/DistanceVectorRoutingPage';
import LeakyBucketPage from './features/computer-networks/LeakyBucketPage';
// Artificial Intelligence
import AStarSearchPage from './features/artificial-intelligence/AStarSearchPage';
import AOStarSearchPage from './features/artificial-intelligence/AOStarSearchPage';
import StateSpaceSearchPage from './features/artificial-intelligence/StateSpaceSearchPage';
import HillClimbingPage from './features/artificial-intelligence/HillClimbingPage';
import GeneticAlgorithmPage from './features/artificial-intelligence/GeneticAlgorithmPage';
import MinimaxPage from './features/artificial-intelligence/MinimaxPage';
import SimplePerceptronPage from './features/artificial-intelligence/SimplePerceptronPage';
// Data Warehouse & Data Mining
import AprioriPage from './features/data-mining/AprioriPage';
import FPGrowthPage from './features/data-mining/FPGrowthPage';
import KMeansPage from './features/data-mining/KMeansPage';
import HierarchicalClusteringPage from './features/data-mining/HierarchicalClusteringPage';
import DBSCANPage from './features/data-mining/DBSCANPage';
import ID3Page from './features/data-mining/ID3Page';
import NaiveBayesPage from './features/data-mining/NaiveBayesPage';
// Statistical Analysis
import LinearRegressionPage from './features/statistical-analysis/LinearRegressionPage';
import ZTestTTestPage from './features/statistical-analysis/ZTestTTestPage';
import ANOVAPage from './features/statistical-analysis/ANOVAPage';
import ChiSquarePage from './features/statistical-analysis/ChiSquarePage';
// Icons
import { CodeIcon, BarChartIcon, DatabaseIcon, CpuIcon, LockIcon, ShieldCheckIcon, CircuitBoardIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, SearchIcon, ServerIcon, BrainCircuitIcon, MiningIcon, ChartBarSquareIcon } from './components/Icons';
import type { Algorithm } from './types';
import Button from './components/ui/Button';
import Input from './components/ui/Input';

const algorithms: Algorithm[] = [
  { name: 'Base Conversion', category: 'Number Systems' },
  { name: 'Two\'s Complement', category: 'Number Systems' },
  { name: 'IEEE-754', category: 'Number Systems' },
  { name: 'Signed Magnitude', category: 'Number Systems' },
  { name: 'Parity Bits', category: 'Error Control' },
  { name: 'Checksum', category: 'Error Control' },
  { name: 'CRC', category: 'Error Control' },
  { name: 'Hamming Codes', category: 'Error Control' },
  { name: 'Huffman Coding', category: 'Compression' },
  { name: 'Run-Length Encoding', category: 'Compression' },
  { name: 'LZW Compression', category: 'Compression' },
  { name: 'FCFS Scheduling', category: 'Operating Systems' },
  { name: 'SJF Scheduling', category: 'Operating Systems' },
  { name: 'Round Robin', category: 'Operating Systems' },
  { name: 'Priority Scheduling', category: 'Operating Systems' },
  { name: 'Banker\'s Algorithm', category: 'Operating Systems' },
  { name: 'FIFO Page Replacement', category: 'Memory Management' },
  { name: 'LRU Page Replacement', category: 'Memory Management' },
  { name: 'Optimal Page Replacement', category: 'Memory Management' },
  { name: 'FCFS Disk', category: 'Disk Scheduling' },
  { name: 'SSTF', category: 'Disk Scheduling' },
  { name: 'SCAN', category: 'Disk Scheduling' },
  { name: 'C-SCAN', category: 'Disk Scheduling' },
  { name: 'BFS/DFS', category: 'Graph Algorithms' },
  { name: 'Dijkstra\'s', category: 'Graph Algorithms' },
  { name: 'Kruskal\'s MST', category: 'Graph Algorithms' },
  { name: 'Prim\'s MST', category: 'Graph Algorithms' },
  { name: 'Bellman-Ford', category: 'Graph Algorithms' },
  { name: 'Bubble Sort', category: 'Sorting' },
  { name: 'Insertion Sort', category: 'Sorting' },
  { name: 'Selection Sort', category: 'Sorting' },
  { name: 'Merge Sort', category: 'Sorting' },
  { name: 'Quick Sort', category: 'Sorting' },
  { name: 'Normalization', category: 'Database' },
  { name: 'Serializability', category: 'Database' },
  { name: 'Transaction Schedules', category: 'Database' },
  { name: 'DFA Acceptance', category: 'Automata' },
  { name: 'Regex to DFA', category: 'Automata' },
  { name: 'Context-Free Grammars', category: 'Automata' },
  { name: 'Logic Gate Simulator', category: 'Logic Circuits' },
  { name: 'Boolean Algebra', category: 'Logic Circuits' },
  { name: 'K-Map Solver', category: 'Logic Circuits' },
  { name: 'Caesar Cipher', category: 'Cryptography' },
  { name: 'RSA Algorithm', category: 'Cryptography' },
  { name: 'Stop-and-Wait ARQ', category: 'Computer Networks' },
  { name: 'Go-Back-N ARQ', category: 'Computer Networks' },
  { name: 'Selective Repeat ARQ', category: 'Computer Networks' },
  { name: 'CSMA/CD', category: 'Computer Networks' },
  { name: 'Distance Vector Routing', category: 'Computer Networks' },
  { name: 'Leaky Bucket', category: 'Computer Networks' },
  { name: 'A* Search', category: 'Artificial Intelligence' },
  { name: 'AO* Search', category: 'Artificial Intelligence' },
  { name: 'BFS/DFS (State Space)', category: 'Artificial Intelligence' },
  { name: 'Hill Climbing', category: 'Artificial Intelligence' },
  { name: 'Genetic Algorithm', category: 'Artificial Intelligence' },
  { name: 'Minimax', category: 'Artificial Intelligence' },
  { name: 'Simple Perceptron', category: 'Artificial Intelligence' },
  { name: 'Apriori Algorithm', category: 'Data Warehouse & Data Mining' },
  { name: 'FP-Growth', category: 'Data Warehouse & Data Mining' },
  { name: 'K-Means Clustering', category: 'Data Warehouse & Data Mining' },
  { name: 'Hierarchical Clustering', category: 'Data Warehouse & Data Mining' },
  { name: 'DBSCAN', category: 'Data Warehouse & Data Mining' },
  { name: 'ID3 Decision Tree', category: 'Data Warehouse & Data Mining' },
  { name: 'Naïve Bayes', category: 'Data Warehouse & Data Mining' },
  { name: 'Simple Linear Regression', category: 'Statistical Analysis' },
  { name: 'Z-Test & T-Test', category: 'Statistical Analysis' },
  { name: 'One-Way ANOVA', category: 'Statistical Analysis' },
  { name: 'Chi-Square Test', category: 'Statistical Analysis' },
];

const categoryIcons: { [key: string]: React.ReactElement<{ className?: string }> } = {
  'Number Systems': <CpuIcon className="w-6 h-6 text-blue-400" />,
  'Error Control': <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />,
  'Compression': <DatabaseIcon className="w-6 h-6 text-amber-400" />,
  'Operating Systems': <CpuIcon className="w-6 h-6 text-rose-400" />,
  'Memory Management': <DatabaseIcon className="w-6 h-6 text-indigo-400" />,
  'Disk Scheduling': <CpuIcon className="w-6 h-6 text-cyan-400" />,
  'Graph Algorithms': <CodeIcon className="w-6 h-6 text-fuchsia-400" />,
  'Sorting': <BarChartIcon className="w-6 h-6 text-orange-400" />,
  'Database': <DatabaseIcon className="w-6 h-6 text-lime-400" />,
  'Automata': <CodeIcon className="w-6 h-6 text-sky-400" />,
  'Cryptography': <LockIcon className="w-6 h-6 text-red-400" />,
  'Logic Circuits': <CircuitBoardIcon className="w-6 h-6 text-teal-400" />,
  'Computer Networks': <ServerIcon className="w-6 h-6 text-violet-400" />,
  'Artificial Intelligence': <BrainCircuitIcon className="w-6 h-6 text-pink-400" />,
  'Data Warehouse & Data Mining': <MiningIcon className="w-6 h-6 text-yellow-400" />,
  'Statistical Analysis': <ChartBarSquareIcon className="w-6 h-6 text-green-400" />,
};

type Page = 'simulator' | 'about' | 'contact' | 'privacy' | 'terms';

const App: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('simulator');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const groupedAlgorithms = useMemo(() => algorithms.reduce((acc, algo) => {
    (acc[algo.category] = acc[algo.category] || []).push(algo);
    return acc;
  }, {} as Record<string, Algorithm[]>), []);

  const sortedCategories = useMemo(() => Object.keys(groupedAlgorithms).sort(), [groupedAlgorithms]);

  const filteredGroupedAlgorithms = useMemo(() => {
    if (!searchQuery.trim()) {
        return groupedAlgorithms;
    }
    const lowerCaseQuery = searchQuery.trim().toLowerCase();
    const result: Record<string, Algorithm[]> = {};

    const allMatchingAlgos = algorithms.filter(algo => 
        algo.name.toLowerCase().includes(lowerCaseQuery) ||
        algo.category.toLowerCase().includes(lowerCaseQuery)
    );

    for (const algo of allMatchingAlgos) {
        if (!result[algo.category]) {
            result[algo.category] = [];
        }
        result[algo.category].push(algo);
    }
    
    return result;
  }, [searchQuery, algorithms, groupedAlgorithms]);

  const filteredSortedCategories = useMemo(() => Object.keys(filteredGroupedAlgorithms).sort(), [filteredGroupedAlgorithms]);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <>{text}</>;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.trim().toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);
    if (startIndex === -1) {
        return <>{text}</>;
    }
    const endIndex = startIndex + lowerQuery.length;
    return (
        <>
            {text.substring(0, startIndex)}
            <span className="bg-yellow-500/30 rounded">
                {text.substring(startIndex, endIndex)}
            </span>
            {text.substring(endIndex)}
        </>
    );
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setSelectedCategory(null);
    setSelectedAlgorithm(null);
    setIsMobileSidebarOpen(false);
  };
  
  const handleGoHome = () => {
    setCurrentPage('simulator');
    setSelectedCategory(null);
    setSelectedAlgorithm(null);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectAlgorithm = (algoName: string | null) => {
    if (algoName) {
        const algo = algorithms.find(a => a.name === algoName);
        if (algo) {
            setSelectedCategory(algo.category);
        }
    }
    setSelectedAlgorithm(algoName);
    setSearchQuery('');
    if (window.innerWidth < 1024) { // lg breakpoint
        setIsMobileSidebarOpen(false);
    }
  }
  
  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedAlgorithm(null);
    setSearchQuery('');
    if (window.innerWidth < 1024) { // lg breakpoint
        setIsMobileSidebarOpen(false);
    }
  }

  const handleGoBack = () => {
    if (selectedAlgorithm) {
        setSelectedAlgorithm(null);
    } else if (selectedCategory) {
        setSelectedCategory(null);
    }
  };

  const handleStart = () => {
    setShowLandingPage(false);
  };

  const handleSearchIconClick = () => {
    setIsDesktopSidebarCollapsed(false);
    setTimeout(() => searchInputRef.current?.focus(), 300); // Wait for animation
  };

  const renderMainContent = () => {
    if (selectedAlgorithm) {
        const AlgorithmPageComponent = () => {
            switch (selectedAlgorithm) {
              // Sorting
              case 'Bubble Sort': return <BubbleSortPage />;
              case 'Insertion Sort': return <InsertionSortPage />;
              case 'Selection Sort': return <SelectionSortPage />;
              case 'Merge Sort': return <MergeSortPage />;
              case 'Quick Sort': return <QuickSortPage />;
              
              // Operating Systems
              case 'FCFS Scheduling': return <FCFSSchedulingPage />;
              case 'SJF Scheduling': return <SJFSchedulingPage />;
              case 'Round Robin': return <RoundRobinPage />;
              case 'Priority Scheduling': return <PrioritySchedulingPage />;
              case 'Banker\'s Algorithm': return <BankersAlgorithmPage />;
              
              // Cryptography
              case 'Caesar Cipher': return <CaesarCipherPage />;
              case 'RSA Algorithm': return <RSAPage />;
        
              // Number Systems
              case 'Base Conversion': return <BaseConversionPage />;
              case 'Two\'s Complement': return <TwosComplementPage />;
              case 'IEEE-754': return <IEEE754Page />;
              case 'Signed Magnitude': return <SignedMagnitudePage />;
        
              // Memory Management
              case 'FIFO Page Replacement': return <FIFOPageReplacementPage />;
              case 'LRU Page Replacement': return <LRUPageReplacementPage />;
              case 'Optimal Page Replacement': return <OptimalPageReplacementPage />;
              
              // Compression
              case 'Huffman Coding': return <HuffmanCodingPage />;
              case 'Run-Length Encoding': return <RunLengthEncodingPage />;
              case 'LZW Compression': return <LZWPage />;
              
              // Graph Algorithms
              case 'Dijkstra\'s': return <DijkstrasPage />;
              case 'BFS/DFS': return <BFSDFSPage />;
              case 'Kruskal\'s MST': return <KruskalsPage />;
              case 'Prim\'s MST': return <PrimsPage />;
              case 'Bellman-Ford': return <BellmanFordPage />;
        
              // Error Control
              case 'Parity Bits': return <ParityBitsPage />;
              case 'Checksum': return <ChecksumPage />;
              case 'CRC': return <CRCPage />;
              case 'Hamming Codes': return <HammingCodePage />;
        
              // Disk Scheduling
              case 'FCFS Disk': return <FCFSDiskPage />;
              case 'SSTF': return <SSTFPage />;
              case 'SCAN': return <SCANPage />;
              case 'C-SCAN': return <CSCANPage />;
              
              // Database
              case 'Normalization': return <NormalizationPage />;
              case 'Serializability': return <SerializabilityPage />;
              case 'Transaction Schedules': return <TransactionSchedulesPage />;
        
              // Automata
              case 'DFA Acceptance': return <DFAAcceptancePage />;
              case 'Regex to DFA': return <RegexToDFAPage />;
              case 'Context-Free Grammars': return <CFGPage />;
        
              // Logic Circuits
              case 'Logic Gate Simulator': return <LogicGatePage />;
              case 'Boolean Algebra': return <BooleanAlgebraPage />;
              case 'K-Map Solver': return <KMapPage />;

              // Computer Networks
              case 'Stop-and-Wait ARQ': return <StopAndWaitARQPage />;
              case 'Go-Back-N ARQ': return <GoBackNARQPage />;
              case 'Selective Repeat ARQ': return <SelectiveRepeatARQPage />;
              case 'CSMA/CD': return <CSMACDPage />;
              case 'Distance Vector Routing': return <DistanceVectorRoutingPage />;
              case 'Leaky Bucket': return <LeakyBucketPage />;

              // Artificial Intelligence
              case 'A* Search': return <AStarSearchPage />;
              case 'AO* Search': return <AOStarSearchPage />;
              case 'BFS/DFS (State Space)': return <StateSpaceSearchPage />;
              case 'Hill Climbing': return <HillClimbingPage />;
              case 'Genetic Algorithm': return <GeneticAlgorithmPage />;
              case 'Minimax': return <MinimaxPage />;
              case 'Simple Perceptron': return <SimplePerceptronPage />;
        
              // Data Warehouse & Data Mining
              case 'Apriori Algorithm': return <AprioriPage />;
              case 'FP-Growth': return <FPGrowthPage />;
              case 'K-Means Clustering': return <KMeansPage />;
              case 'Hierarchical Clustering': return <HierarchicalClusteringPage />;
              case 'DBSCAN': return <DBSCANPage />;
              case 'ID3 Decision Tree': return <ID3Page />;
              case 'Naïve Bayes': return <NaiveBayesPage />;
        
              // Statistical Analysis
              case 'Simple Linear Regression': return <LinearRegressionPage />;
              case 'Z-Test & T-Test': return <ZTestTTestPage />;
              case 'One-Way ANOVA': return <ANOVAPage />;
              case 'Chi-Square Test': return <ChiSquarePage />;

              default:
                return (
                  <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
                    <h2 className="text-2xl font-bold">Implementation Coming Soon</h2>
                    <p>The interactive simulator for "{selectedAlgorithm}" is under construction.</p>
                  </div>
                );
            }
        };

        return (
            <div>
                 <Button onClick={handleGoBack} variant="ghost" className="mb-6 inline-flex items-center text-text-secondary hover:text-text-primary">
                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                    Back to {selectedCategory} Algorithms
                </Button>
                <AlgorithmPageComponent />
            </div>
        );
    }
    
    if (selectedCategory) {
        return (
            <AlgorithmSelectionPage
                category={selectedCategory}
                algorithms={groupedAlgorithms[selectedCategory]}
                categoryIcons={categoryIcons}
                onSelectAlgorithm={handleSelectAlgorithm}
                onGoBack={handleGoBack}
            />
        );
    }

    return (
        <CategorySelectionPage 
            categories={sortedCategories}
            groupedAlgorithms={groupedAlgorithms}
            categoryIcons={categoryIcons}
            onSelectCategory={handleSelectCategory}
        />
    );
  };


  const renderCurrentPage = () => {
    const footer = <Footer onNavigate={handleNavigation} onSelectAlgorithm={handleSelectAlgorithm} />;
    switch (currentPage) {
        case 'simulator':
            return (
                <div className="flex flex-1 overflow-hidden">
                    {/* Mobile sidebar overlay */}
                    {isMobileSidebarOpen && (
                        <div
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                            aria-hidden="true"
                        ></div>
                    )}
                    {/* Sidebar */}
                    <motion.aside 
                        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background-secondary border-r border-border z-40 transform transition-transform duration-300 ease-in-out lg:static lg:h-auto lg:translate-x-0 lg:flex-shrink-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        animate={{ width: isDesktopSidebarCollapsed ? '5rem' : '16rem' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="h-full flex flex-col overflow-hidden">
                        {!isDesktopSidebarCollapsed && (
                          <div className="p-2 border-b border-border">
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                                <SearchIcon className="w-4 h-4 text-text-tertiary"/>
                              </span>
                              <Input
                                ref={searchInputRef}
                                type="search"
                                placeholder="Search algorithms..."
                                className="pl-9 text-sm"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                        <nav className="flex-1 p-2 space-y-1 overflow-y-auto no-scrollbar">
                          {isDesktopSidebarCollapsed ? (
                              // Collapsed View
                              <>
                                <button
                                  onClick={handleSearchIconClick}
                                  className="w-full flex justify-center p-3 rounded-md text-text-secondary hover:bg-background-elevated hover:text-text-primary transition-colors"
                                  title="Search"
                                  aria-label="Search algorithms"
                                >
                                  <SearchIcon className="w-6 h-6" />
                                </button>
                                {sortedCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleSelectCategory(category)}
                                        className="w-full flex justify-center p-3 rounded-md text-text-secondary hover:bg-background-elevated hover:text-text-primary transition-colors"
                                        title={category}
                                        aria-label={category}
                                    >
                                        {React.cloneElement(categoryIcons[category], { className: "w-6 h-6"})}
                                    </button>
                                ))}
                              </>
                          ) : (
                              // Expanded View
                              filteredSortedCategories.length > 0 ? (
                                filteredSortedCategories.map((category) => (
                                  <div key={category} className="space-y-1">
                                    <h2 
                                      className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2 flex items-center px-2 pt-2 cursor-pointer"
                                      onClick={() => handleSelectCategory(category)}
                                    >
                                      {React.cloneElement(categoryIcons[category], { className: "w-4 h-4 mr-2"})} {category}
                                    </h2>
                                    <ul className="space-y-1">
                                      {filteredGroupedAlgorithms[category].sort((a,b) => a.name.localeCompare(b.name)).map((algo) => (
                                        <li key={algo.name}>
                                          <button
                                            onClick={() => handleSelectAlgorithm(algo.name)}
                                            className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors duration-200 flex items-center ${
                                              selectedAlgorithm === algo.name
                                                ? 'bg-accent-primary text-white font-semibold'
                                                : 'text-text-secondary hover:bg-background-elevated hover:text-text-primary'
                                            }`}
                                          >
                                            {highlightMatch(algo.name, searchQuery)}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center text-sm text-text-tertiary">
                                  No algorithms found.
                                </div>
                              )
                          )}
                        </nav>
                        <div className="p-2 border-t border-border hidden lg:block flex-shrink-0">
                            <Button 
                                variant="ghost" 
                                className="w-full flex justify-center"
                                onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
                                aria-label={isDesktopSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            >
                                {isDesktopSidebarCollapsed ? <ChevronRightIcon className="w-5 h-5"/> : <ChevronLeftIcon className="w-5 h-5"/>}
                            </Button>
                        </div>
                      </div>
                    </motion.aside>

                    <main className="flex-1 overflow-y-auto no-scrollbar">
                      <div className="p-6 lg:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedAlgorithm || selectedCategory || 'categories'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                                {renderMainContent()}
                            </motion.div>
                        </AnimatePresence>
                      </div>
                      {footer}
                    </main>
                </div>
            );
        case 'about':
            return <div className="flex-1 overflow-y-auto no-scrollbar"><AboutPage
                stats={{
                    algorithms: algorithms.length,
                    categories: sortedCategories.length
                }}
                categories={sortedCategories}
                groupedAlgorithms={groupedAlgorithms}
                categoryIcons={categoryIcons}
            />{footer}</div>;
        case 'contact':
            return <div className="flex-1 overflow-y-auto no-scrollbar"><ContactPage categories={sortedCategories} />{footer}</div>;
        case 'privacy':
            return <div className="flex-1 overflow-y-auto no-scrollbar"><PrivacyPolicyPage />{footer}</div>;
        case 'terms':
            return <div className="flex-1 overflow-y-auto no-scrollbar"><TermsOfServicePage />{footer}</div>;
        default:
            return null;
    }
  };
  
  if (showLandingPage) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-background-primary text-text-primary">
      <Navbar 
        onNavigate={handleNavigation}
        onGoHome={handleGoHome}
        currentPage={currentPage} 
        showSidebarToggle={currentPage === 'simulator'}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isSidebarOpen={isMobileSidebarOpen}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette
            algorithms={algorithms}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelectAlgorithm={(algoName) => {
              handleNavigation('simulator');
              handleSelectAlgorithm(algoName);
              setIsCommandPaletteOpen(false);
            }}
            onSelectPage={(page) => {
              handleNavigation(page);
              setIsCommandPaletteOpen(false);
            }}
          />
        )}
      </AnimatePresence>
      {renderCurrentPage()}
    </div>
  );
};

export default App;
