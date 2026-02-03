
// Helper functions for RSA. Using BigInt for calculations.

// Simple primality test
const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Greatest Common Divisor
const gcd = (a: bigint, b: bigint): bigint => {
    return b === 0n ? a : gcd(b, a % b);
};

// Modular Multiplicative Inverse using Extended Euclidean Algorithm
const modInverse = (e: bigint, phi: bigint): bigint => {
    let [m0, t, q] = [phi, 0n, 0n];
    let [x0, x1] = [0n, 1n];
    if (phi === 1n) return 0n;
    while (e > 1n) {
        q = e / m0;
        [t, e, m0] = [m0, m0, e % m0];
        [t, x0, x1] = [x0, x1 - q * x0, t];
    }
    if (x1 < 0n) x1 += phi;
    return x1;
};

export const generateRsaKeys = (p: number, q: number, eNum: number) => {
    if (!isPrime(p) || !isPrime(q)) {
        return { error: 'p and q must be prime numbers.' };
    }
    if (p === q) {
        return { error: 'p and q cannot be the same.' };
    }

    const n = BigInt(p) * BigInt(q);
    const phi = (BigInt(p) - 1n) * (BigInt(q) - 1n);
    const e = BigInt(eNum);

    if (e <= 1n || e >= phi) {
        return { error: `e must be between 1 and ${phi}.` };
    }
    if (gcd(e, phi) !== 1n) {
        return { error: `e must be coprime to ${phi}.` };
    }

    const d = modInverse(e, phi);

    return {
        keys: { n, e, d, phi },
        error: ''
    };
};

export const rsaEncryptDecrypt = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
    // Modular exponentiation (base^exponent % modulus)
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent >> 1n; // equivalent to exponent /= 2
        base = (base * base) % modulus;
    }
    return result;
};
