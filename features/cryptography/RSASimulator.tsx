import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { generateRsaKeys, rsaEncryptDecrypt } from '../../services/rsaService';

const RSASimulator: React.FC = () => {
    const [p, setP] = useState<string>('11');
    const [q, setQ] = useState<string>('13');
    const [e, setE] = useState<string>('7');
    const [message, setMessage] = useState<string>('42');

    const [keys, setKeys] = useState<{ n: bigint, e: bigint, d: bigint, phi: bigint } | null>(null);
    const [error, setError] = useState<string>('');

    const [encrypted, setEncrypted] = useState<bigint | null>(null);
    const [decrypted, setDecrypted] = useState<bigint | null>(null);

    const handleKeyGeneration = () => {
        setError('');
        setKeys(null);
        setEncrypted(null);
        setDecrypted(null);
        const pNum = parseInt(p);
        const qNum = parseInt(q);
        const eNum = parseInt(e);

        const result = generateRsaKeys(pNum, qNum, eNum);
        if (result.error) {
            setError(result.error);
        } else {
            setKeys(result.keys);
        }
    };

    const handleEncryption = () => {
        if (!keys) return;
        const mNum = BigInt(parseInt(message));
        if (mNum >= keys.n) {
            setError(`Message must be less than n (${keys.n.toString()}).`);
            return;
        }
        setError('');
        const c = rsaEncryptDecrypt(mNum, keys.e, keys.n);
        setEncrypted(c);
        setDecrypted(null);
    };

    const handleDecryption = () => {
        if (!keys || encrypted === null) return;
        const m = rsaEncryptDecrypt(encrypted, keys.d, keys.n);
        setDecrypted(m);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card title="1. Key Generation">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-text-secondary mb-1 block">Prime p</label>
                                <Input type="number" value={p} onChange={e => setP(e.target.value)} />
                            </div>
                             <div>
                                <label className="text-sm font-medium text-text-secondary mb-1 block">Prime q</label>
                                <Input type="number" value={q} onChange={e => setQ(e.target.value)} />
                            </div>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Public Exponent e</label>
                            <Input type="number" value={e} onChange={e => setE(e.target.value)} />
                        </div>
                        <Button onClick={handleKeyGeneration} className="w-full">Generate Keys</Button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                </Card>
                {keys && (
                     <Card title="Generated Keys">
                        <div className="font-mono text-sm space-y-2 break-all">
                            <p><strong>Modulus (n):</strong> {keys.n.toString()}</p>
                            <p><strong>Phi(n):</strong> {keys.phi.toString()}</p>
                            <p className="text-accent-primary"><strong>Public Key (e, n):</strong> ({keys.e.toString()}, {keys.n.toString()})</p>
                            <p className="text-accent-warning"><strong>Private Key (d, n):</strong> ({keys.d.toString()}, {keys.n.toString()})</p>
                        </div>
                    </Card>
                )}
            </div>
             <div className="space-y-6">
                 <Card title="2. Encryption">
                     <div className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">{`Message (as number M < n)`}</label>
                            <Input type="number" value={message} onChange={e => setMessage(e.target.value)} disabled={!keys}/>
                        </div>
                        <Button onClick={handleEncryption} className="w-full" disabled={!keys}>Encrypt</Button>
                        {encrypted !== null && <p className="font-mono text-center">Ciphertext (C): <strong className="text-accent-primary">{encrypted.toString()}</strong></p>}
                     </div>
                 </Card>
                 <Card title="3. Decryption">
                     <div className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Ciphertext (C)</label>
                            <Input value={encrypted?.toString() || ''} readOnly disabled={!keys || encrypted === null}/>
                        </div>
                        <Button onClick={handleDecryption} className="w-full" disabled={!keys || encrypted === null}>Decrypt</Button>
                        {decrypted !== null && <p className="font-mono text-center">Decrypted Message (M): <strong className="text-accent-success">{decrypted.toString()}</strong></p>}
                     </div>
                 </Card>
            </div>
        </div>
    );
};

export default RSASimulator;
