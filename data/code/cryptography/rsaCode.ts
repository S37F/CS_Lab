export const rsaCode = {
  'Python': `import random

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def mod_inverse(e, phi):
    d = pow(e, -1, phi)
    return d

def is_prime(n, k=5):
    if n <= 1: return False
    if n <= 3: return True
    if n % 2 == 0: return False
    # Miller-Rabin primality test
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1
        d //= 2
    for _ in range(k):
        a = random.randrange(2, n - 1)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True

def generate_keypair(p, q):
    if not (is_prime(p) and is_prime(q)):
        raise ValueError("Both numbers must be prime.")
    elif p == q:
        raise ValueError("p and q cannot be equal.")

    n = p * q
    phi = (p - 1) * (q - 1)

    # Choose e such that e and phi are coprime
    e = 65537 # Common choice for e
    while gcd(e, phi) != 1:
        e = random.randrange(3, phi, 2)
        
    d = mod_inverse(e, phi)
    
    # Public key is (e, n), Private key is (d, n)
    return ((e, n), (d, n))

def encrypt(public_key, plaintext):
    e, n = public_key
    # Convert each character to a number, encrypt it, and return a list of numbers
    cipher = [pow(ord(char), e, n) for char in plaintext]
    return cipher

def decrypt(private_key, ciphertext):
    d, n = private_key
    # Decrypt each number and convert back to a character
    plain = [chr(pow(char, d, n)) for char in ciphertext]
    return ''.join(plain)

# Example (using small primes for demonstration)
p = 61
q = 53
public, private = generate_keypair(p, q)
print("Public key:", public)
print("Private key:", private)

message = "Hello RSA!"
encrypted_msg = encrypt(public, message)
print("Encrypted message:", encrypted_msg)

decrypted_msg = decrypt(private, encrypted_msg)
print("Decrypted message:", decrypted_msg)
`,
  'Java': `import java.math.BigInteger;
import java.security.SecureRandom;

public class RSA {
    private BigInteger n, d, e;

    public RSA(int bitLength) {
        SecureRandom r = new SecureRandom();
        BigInteger p = new BigInteger(bitLength / 2, 100, r);
        BigInteger q = new BigInteger(bitLength / 2, 100, r);
        n = p.multiply(q);
        BigInteger phi = (p.subtract(BigInteger.ONE)).multiply(q.subtract(BigInteger.ONE));
        e = new BigInteger("65537"); // Common public exponent
        while (phi.gcd(e).intValue() > 1) {
            e = e.add(new BigInteger("2"));
        }
        d = e.modInverse(phi);
    }

    public synchronized String encrypt(String message) {
        return (new BigInteger(message.getBytes())).modPow(e, n).toString();
    }

    public synchronized String decrypt(String encryptedMessage) {
        return new String((new BigInteger(encryptedMessage)).modPow(d, n).toByteArray());
    }

    public static void main(String[] args) {
        RSA rsa = new RSA(1024); // Use small bit length for demo speed
        String message = "Hello RSA!";
        
        String encrypted = rsa.encrypt(message);
        System.out.println("Encrypted: " + encrypted);
        
        String decrypted = rsa.decrypt(encrypted);
        System.out.println("Decrypted: " + decrypted);
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <vector>
#include <numeric> // For std::gcd in C++17, otherwise implement manually

// Function to calculate (base^exp) % mod
long long power(long long base, long long exp, long long mod) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp % 2 == 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp /= 2;
    }
    return res;
}

// Function to find modular inverse of a under modulo m
long long modInverse(long long a, long long m) {
    a = a % m;
    for (long long x = 1; x < m; x++) {
        if ((a * x) % m == 1) {
            return x;
        }
    }
    return -1;
}

int main() {
    // Small primes for demonstration
    long long p = 61;
    long long q = 53;
    
    long long n = p * q;
    long long phi = (p - 1) * (q - 1);
    
    long long e = 65537; // A common choice
    // In a real scenario, you'd find a coprime e for phi.
    
    long long d = modInverse(e, phi);

    std::cout << "Public Key: (" << e << ", " << n << ")" << std::endl;
    std::cout << "Private Key: (" << d << ", " << n << ")" << std::endl;

    std::string message = "RSA";
    std::cout << "Original Message: " << message << std::endl;

    // Encrypt
    std::vector<long long> encrypted;
    std::cout << "Encrypted: ";
    for (char ch : message) {
        long long encrypted_char = power(ch, e, n);
        encrypted.push_back(encrypted_char);
        std::cout << encrypted_char << " ";
    }
    std::cout << std::endl;

    // Decrypt
    std::string decrypted;
    for (long long encrypted_char : encrypted) {
        decrypted += (char)power(encrypted_char, d, n);
    }
    std::cout << "Decrypted Message: " << decrypted << std::endl;

    return 0;
}
`
};
