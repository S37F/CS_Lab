export const twosComplementCode = {
  'Python': `def to_twos_complement(n, bits):
    """Converts a decimal integer to its two's complement representation."""
    # Calculate the valid range for the given number of bits
    min_val = -2**(bits - 1)
    max_val = 2**(bits - 1) - 1
    
    if not min_val <= n <= max_val:
        raise ValueError(f"Number {n} is out of range for {bits} bits [{min_val}, {max_val}]")

    # For positive numbers, it's just the binary representation
    if n >= 0:
        return format(n, f'0{bits}b')
    
    # For negative numbers:
    # 1. Take the absolute value
    # 2. Convert to binary
    # 3. Invert the bits
    # 4. Add 1
    # A simpler way is to use the formula 2^bits + n
    else:
        return format(2**bits + n, f'0{bits}b')

# Example
num = -42
bits = 8
twos_comp = to_twos_complement(num, bits)
print(f"{num} in {bits}-bit two's complement is: {twos_comp}")
# Expected output: 11010110
`,
  'Java': `public class TwosComplement {

    public static String toTwosComplement(int n, int bits) {
        long minVal = -(1L << (bits - 1));
        long maxVal = (1L << (bits - 1)) - 1;

        if (n < minVal || n > maxVal) {
            throw new IllegalArgumentException("Number " + n + " is out of range for " + bits + " bits.");
        }

        // Java's toBinaryString handles two's complement automatically.
        // We just need to handle the length.
        String binaryString = Integer.toBinaryString(n);

        if (binaryString.length() > bits) {
            // Take the last 'bits' characters for negative numbers
            return binaryString.substring(binaryString.length() - bits);
        } else {
            // Pad with leading zeros for positive numbers
            return String.format("%" + bits + "s", binaryString).replace(' ', '0');
        }
    }

    public static void main(String[] args) {
        int num = -42;
        int bits = 8;
        String twosComp = toTwosComplement(num, bits);
        System.out.println(num + " in " + bits + "-bit two's complement is: " + twosComp);
        // Expected output: 11010110
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <bitset>
#include <cmath>

template<int BITS>
std::string toTwosComplement(int n) {
    long minVal = -(1L << (BITS - 1));
    long maxVal = (1L << (BITS - 1)) - 1;

    if (n < minVal || n > maxVal) {
        throw std::out_of_range("Number out of range for specified bits.");
    }

    // std::bitset handles two's complement conversion correctly for the given type
    return std::bitset<BITS>(n).to_string();
}

int main() {
    int num = -42;
    const int BITS = 8;
    try {
        std::string twosComp = toTwosComplement<BITS>(num);
        std::cout << num << " in " << BITS << "-bit two's complement is: " << twosComp << std::endl;
        // Expected output: 11010110
    } catch (const std::out_of_range& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    return 0;
}
`
};
