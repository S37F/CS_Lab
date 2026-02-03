export const ieee754Code = {
  'Python': `import struct
import sys

def float_to_ieee754(n, precision='single'):
    if precision == 'single':
        # Pack float as big-endian single-precision (32-bit)
        packed = struct.pack('>f', n)
        # Unpack as an integer to get the bits
        integer_representation = struct.unpack('>I', packed)[0]
        # Format as a 32-bit binary string
        return f'{integer_representation:032b}'
    elif precision == 'double':
        # Pack float as big-endian double-precision (64-bit)
        packed = struct.pack('>d', n)
        # Unpack as a long long to get the bits
        integer_representation = struct.unpack('>Q', packed)[0]
        # Format as a 64-bit binary string
        return f'{integer_representation:064b}'
    else:
        raise ValueError("Precision must be 'single' or 'double'")

# Example for single precision
num = 9.125
binary_representation = float_to_ieee754(num, 'single')
sign = binary_representation[0]
exponent = binary_representation[1:9]
mantissa = binary_representation[9:]

print(f"Decimal: {num}")
print(f"Sign: {sign}")
print(f"Exponent: {exponent}")
print(f"Mantissa: {mantissa}")
# Expected output: 0 10000010 00100100000000000000000
`,
  'Java': `public class IEEE754Converter {

    public static String floatToIEEE754(float n) {
        int intBits = Float.floatToIntBits(n);
        String binaryString = Integer.toBinaryString(intBits);
        // Pad with leading zeros to make it 32 bits
        return String.format("%32s", binaryString).replace(' ', '0');
    }

    public static String doubleToIEEE754(double n) {
        long longBits = Double.doubleToLongBits(n);
        String binaryString = Long.toBinaryString(longBits);
        // Pad with leading zeros to make it 64 bits
        return String.format("%64s", binaryString).replace(' ', '0');
    }

    public static void main(String[] args) {
        float num = 9.125f;
        String binaryRep = floatToIEEE754(num);
        
        String sign = binaryRep.substring(0, 1);
        String exponent = binaryRep.substring(1, 9);
        String mantissa = binaryRep.substring(9);

        System.out.println("Decimal: " + num);
        System.out.println("Sign: " + sign);
        System.out.println("Exponent: " + exponent);
        System.out.println("Mantissa: " + mantissa);
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <bitset>
#include <cstdint> // For uint32_t

// Union to reinterpret the bits of a float as an integer
union FloatIntUnion {
    float f;
    uint32_t i;
};

std::string floatToIEEE754(float n) {
    FloatIntUnion u;
    u.f = n;
    // Use std::bitset to get the binary representation
    return std::bitset<32>(u.i).to_string();
}

int main() {
    float num = 9.125f;
    std::string binaryRep = floatToIEEE754(num);

    std::string sign = binaryRep.substr(0, 1);
    std::string exponent = binaryRep.substr(1, 8);
    std::string mantissa = binaryRep.substr(9);
    
    std::cout << "Decimal: " << num << std::endl;
    std::cout << "Sign: " << sign << std::endl;
    std::cout << "Exponent: " << exponent << std::endl;
    std::cout << "Mantissa: " << mantissa << std::endl;

    return 0;
}
`
};
