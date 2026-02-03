export const signedMagnitudeCode = {
  'Python': `def to_signed_magnitude(n, bits):
    """Converts a decimal integer to its signed magnitude representation."""
    if not -(2**(bits - 1)) < n < 2**(bits - 1):
        raise ValueError(f"Number {n} is out of range for {bits} bits.")

    if n >= 0:
        sign_bit = '0'
    else:
        sign_bit = '1'
        
    magnitude = abs(n)
    # Format the magnitude to the required number of bits (bits - 1)
    magnitude_bits = format(magnitude, f'0{bits - 1}b')
    
    return sign_bit + magnitude_bits

# Example
num = -42
bits = 8
signed_mag = to_signed_magnitude(num, bits)
print(f"{num} in {bits}-bit signed magnitude is: {signed_mag}")
# Expected output: 10101010
`,
  'Java': `public class SignedMagnitude {

    public static String toSignedMagnitude(int n, int bits) {
        int max_val = (1 << (bits - 1)) - 1; // 2^(bits-1) - 1
        if (n < -max_val || n > max_val) {
            throw new IllegalArgumentException("Number " + n + " is out of range for " + bits + " bits.");
        }

        String signBit = (n >= 0) ? "0" : "1";
        
        int magnitude = Math.abs(n);
        String magnitudeBits = Integer.toBinaryString(magnitude);
        
        // Pad magnitude with leading zeros
        while (magnitudeBits.length() < bits - 1) {
            magnitudeBits = "0" + magnitudeBits;
        }
        
        return signBit + magnitudeBits;
    }

    public static void main(String[] args) {
        int num = -42;
        int bits = 8;
        String signedMag = toSignedMagnitude(num, bits);
        System.out.println(num + " in " + bits + "-bit signed magnitude is: " + signedMag);
        // Expected output: 10101010
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <cmath>
#include <bitset>

std::string toSignedMagnitude(int n, int bits) {
    int max_val = (1 << (bits - 1)) - 1;
    if (n < -max_val || n > max_val) {
        throw std::out_of_range("Number is out of range for the given number of bits.");
    }

    char sign_bit = (n >= 0) ? '0' : '1';
    
    int magnitude = std::abs(n);
    // Use std::bitset to easily convert and pad with zeros
    std::string magnitude_bits = std::bitset<64>(magnitude).to_string();
    
    // Get the relevant part of the bitset string
    return sign_bit + magnitude_bits.substr(64 - (bits - 1));
}

int main() {
    int num = -42;
    int bits = 8;
    try {
        std::string signedMag = toSignedMagnitude(num, bits);
        std::cout << num << " in " << bits << "-bit signed magnitude is: " << signedMag << std::endl;
        // Expected output: 10101010
    } catch (const std::out_of_range& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    return 0;
}
`
};
