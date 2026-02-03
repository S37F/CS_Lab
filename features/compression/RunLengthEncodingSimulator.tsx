
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { encodeRLE, decodeRLE } from '../../services/runLengthEncodingService';

const RunLengthEncodingSimulator: React.FC = () => {
    const [original, setOriginal] = useState<string>('WWWWWWWWWWWWBWWWWWWWWWWWWBBB');
    const [compressed, setCompressed] = useState<string>('');
    const [active, setActive] = useState<'original' | 'compressed'>('original');

    useEffect(() => {
        if (active === 'original') {
            setCompressed(encodeRLE(original));
        }
    }, [original, active]);

    useEffect(() => {
        if (active === 'compressed') {
            setOriginal(decodeRLE(compressed));
        }
    }, [compressed, active]);

    const handleOriginalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setActive('original');
        setOriginal(e.target.value);
    };

    const handleCompressedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setActive('compressed');
        setCompressed(e.target.value);
    };
    
    const originalSize = original.length;
    const compressedSize = compressed.length;
    const compressionRatio = originalSize > 0 ? (compressedSize / originalSize) * 100 : 0;


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card title="Original Data">
                    <textarea
                        value={original}
                        onChange={handleOriginalChange}
                        className="w-full h-48 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                        placeholder="Enter text to compress..."
                    />
                </Card>
            </div>
            <div className="space-y-6">
                <Card title="Compressed Data (RLE)">
                     <textarea
                        value={compressed}
                        onChange={handleCompressedChange}
                        className="w-full h-48 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                        placeholder="Enter RLE text to decompress..."
                    />
                </Card>
                <Card title="Metrics">
                     <div className="font-mono text-sm space-y-3">
                        <div className="flex justify-between">
                            <span className="text-text-tertiary">Original Size:</span>
                            <span className="text-text-primary">{originalSize} bytes</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-tertiary">Compressed Size:</span>
                            <span className="text-text-primary">{compressedSize} bytes</span>
                        </div>
                         <div className="flex justify-between font-bold">
                            <span className="text-text-tertiary">Compression Ratio:</span>
                            <span className={`text-text-primary ${compressionRatio < 100 ? 'text-accent-success' : 'text-accent-warning'}`}>
                                {compressionRatio.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RunLengthEncodingSimulator;
