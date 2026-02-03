import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

// Generate a 2D terrain using Perlin-like noise
const generateTerrain = (size: number): number[][] => {
    const terrain = Array(size).fill(0).map(() => Array(size).fill(0));
    const roughness = 0.6;
    const initialValue = Math.random();

    const diamondSquare = (x1: number, y1: number, x2: number, y2: number) => {
        if (x2 - x1 < 2 && y2 - y1 < 2) return;

        const mx = Math.floor((x1 + x2) / 2);
        const my = Math.floor((y1 + y2) / 2);

        const avg = (terrain[y1][x1] + terrain[y1][x2] + terrain[y2][x1] + terrain[y2][x2]) / 4;
        terrain[my][mx] = avg + (Math.random() - 0.5) * roughness * (x2 - x1);

        const diamond = (x: number, y: number, size: number) => {
            const points = [
                terrain[y]?.[x - size],
                terrain[y]?.[x + size],
                terrain[y - size]?.[x],
                terrain[y + size]?.[x],
            ].filter(v => v !== undefined);
            if (points.length > 0) {
                const avg = points.reduce((a, b) => a + b, 0) / points.length;
                terrain[y][x] = avg + (Math.random() - 0.5) * roughness * size;
            }
        };

        diamond(mx, y1, mx - x1);
        diamond(mx, y2, mx - x1);
        diamond(x1, my, mx - x1);
        diamond(x2, my, mx - x1);

        diamondSquare(x1, y1, mx, my);
        diamondSquare(mx, y1, x2, my);
        diamondSquare(x1, my, mx, y2);
        diamondSquare(mx, my, x2, y2);
    };
    
    terrain[0][0] = initialValue;
    terrain[0][size-1] = initialValue;
    terrain[size-1][0] = initialValue;
    terrain[size-1][size-1] = initialValue;
    diamondSquare(0, 0, size - 1, size - 1);

    // Normalize
    let min = Infinity, max = -Infinity;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (terrain[y][x] < min) min = terrain[y][x];
            if (terrain[y][x] > max) max = terrain[y][x];
        }
    }
    return terrain.map(row => row.map(val => (val - min) / (max - min)));
};

const HillClimbingSimulator: React.FC = () => {
    const GRID_SIZE = 25;
    const [terrain, setTerrain] = useState<number[][]>([]);
    const [currentPos, setCurrentPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [isAtPeak, setIsAtPeak] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [path, setPath] = useState<{x: number, y: number}[]>([]);

    const resetSimulation = useCallback(() => {
        const newTerrain = generateTerrain(GRID_SIZE);
        setTerrain(newTerrain);
        const startX = Math.floor(Math.random() * GRID_SIZE);
        const startY = Math.floor(Math.random() * GRID_SIZE);
        setCurrentPos({ x: startX, y: startY });
        setPath([{x: startX, y: startY}]);
        setIsAtPeak(false);
        setIsRunning(false);
    }, []);

    useEffect(() => {
        resetSimulation();
    }, [resetSimulation]);

    const step = () => {
        if (isAtPeak || !terrain.length) return;

        const { x, y } = currentPos;
        let bestNeighbor = { x, y, value: terrain[y][x] };

        const neighbors = [
            { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
            { dx: -1, dy: 0 },                     { dx: 1, dy: 0 },
            { dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 },
        ];

        for (const { dx, dy } of neighbors) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                if (terrain[newY][newX] > bestNeighbor.value) {
                    bestNeighbor = { x: newX, y: newY, value: terrain[newY][newX] };
                }
            }
        }

        if (bestNeighbor.x === x && bestNeighbor.y === y) {
            setIsAtPeak(true);
            setIsRunning(false);
        } else {
            setCurrentPos({ x: bestNeighbor.x, y: bestNeighbor.y });
            setPath(prev => [...prev, {x: bestNeighbor.x, y: bestNeighbor.y}]);
        }
    };

    useInterval(step, isRunning ? 200 : null);

    const getColor = (value: number) => {
        const r = Math.round(50 + value * 100);
        const g = Math.round(150 + value * 100);
        const b = Math.round(50 + value * 50);
        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <Card>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-text-secondary">
                        {isAtPeak ? "Local Maximum Reached!" : isRunning ? "Searching..." : "Ready to start."}
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={() => setIsRunning(!isRunning)} variant="primary" size="sm" disabled={isAtPeak}>
                            {isRunning ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                        </Button>
                        <Button onClick={resetSimulation} variant="secondary" size="sm">
                            <RefreshIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="relative" style={{ width: '100%', paddingBottom: '100%' }}>
                    <div className="absolute top-0 left-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, width: '100%', height: '100%' }}>
                        {terrain.map((row, y) =>
                            row.map((value, x) => (
                                <div
                                    key={`${y}-${x}`}
                                    className="w-full h-full transition-colors duration-300"
                                    style={{ backgroundColor: getColor(value) }}
                                />
                            ))
                        )}
                        {path.map((p, i) => (
                             <motion.div
                                key={`path-${i}`}
                                className="absolute rounded-full bg-black/30"
                                style={{
                                    width: `${100 / GRID_SIZE}%`,
                                    height: `${100 / GRID_SIZE}%`,
                                    top: `${p.y * (100 / GRID_SIZE)}%`,
                                    left: `${p.x * (100 / GRID_SIZE)}%`,
                                }}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                            />
                        ))}
                        <motion.div
                            className="absolute rounded-full border-2 border-white bg-red-500 shadow-lg"
                            style={{
                                width: `${100 / GRID_SIZE}%`,
                                height: `${100 / GRID_SIZE}%`,
                            }}
                            animate={{
                                top: `${currentPos.y * (100 / GRID_SIZE)}%`,
                                left: `${currentPos.x * (100 / GRID_SIZE)}%`,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>
                 <div className="mt-4 text-center text-xs text-text-tertiary">
                    Current Position: ({currentPos.x}, {currentPos.y}) | Elevation: {terrain[currentPos.y]?.[currentPos.x]?.toFixed(2)}
                </div>
            </div>
        </Card>
    );
};

export default HillClimbingSimulator;
