export const crcCode = {
  'Python': `def crc(data, generator):
    """
    Calculates CRC remainder using binary polynomial division (XOR).
    """
    data_bits = list(map(int, data))
    generator_bits = list(map(int, generator))
    
    # Append r zeros to data, where r is degree of generator
    r = len(generator_bits) - 1
    dividend = data_bits + [0] * r
    
    # Perform division
    divisor = generator_bits
    for i in range(len(data_bits)):
        if dividend[i] == 1:
            for j in range(len(divisor)):
                dividend[i + j] ^= divisor[j] # XOR operation
                
    # The remainder is the last r bits
    remainder = "".join(map(str, dividend[-r:]))
    transmitted_data = data + remainder
    
    return remainder, transmitted_data

def crc_check(codeword, generator):
    """
    Checks the received codeword. Returns True if no error is detected.
    """
    codeword_bits = list(map(int, codeword))
    generator_bits = list(map(int, generator))
    
    divisor = generator_bits
    for i in range(len(codeword_bits) - (len(generator_bits) - 1)):
        if codeword_bits[i] == 1:
            for j in range(len(divisor)):
                codeword_bits[i + j] ^= divisor[j]
                
    # If the remainder is all zeros, no error is detected
    return all(bit == 0 for bit in codeword_bits)

# Example
data = "110101"
generator = "1011"
remainder, transmitted = crc(data, generator)
print(f"Data: {data}")
print(f"Generator: {generator}")
print(f"CRC Remainder: {remainder}")
print(f"Transmitted Codeword: {transmitted}")

# Receiver check
is_valid = crc_check(transmitted, generator)
print(f"Receiver check passed: {is_valid}")
`,
  'Java': `public class CRC {

    public static String calculate(String data, String generator) {
        int r = generator.length() - 1;
        StringBuilder dividend = new StringBuilder(data);
        for (int i = 0; i < r; i++) {
            dividend.append('0');
        }

        for (int i = 0; i <= dividend.length() - generator.length(); i++) {
            if (dividend.charAt(i) == '1') {
                for (int j = 0; j < generator.length(); j++) {
                    char dividendChar = dividend.charAt(i + j);
                    char generatorChar = generator.charAt(j);
                    // XOR operation
                    dividend.setCharAt(i + j, (dividendChar == generatorChar) ? '0' : '1');
                }
            }
        }
        return dividend.substring(dividend.length() - r);
    }
    
    public static boolean verify(String codeword, String generator) {
        StringBuilder dividend = new StringBuilder(codeword);
        
        for (int i = 0; i <= dividend.length() - generator.length(); i++) {
            if (dividend.charAt(i) == '1') {
                for (int j = 0; j < generator.length(); j++) {
                    char dividendChar = dividend.charAt(i + j);
                    char generatorChar = generator.charAt(j);
                    dividend.setCharAt(i + j, (dividendChar == generatorChar) ? '0' : '1');
                }
            }
        }

        // Check if remainder is all zeros
        for (int i = 0; i < dividend.length(); i++) {
            if (dividend.charAt(i) == '1') {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        String data = "110101";
        String generator = "1011";
        String remainder = calculate(data, generator);
        String transmitted = data + remainder;

        System.out.println("Data: " + data);
        System.out.println("Generator: " + generator);
        System.out.println("CRC Remainder: " + remainder);
        System.out.println("Transmitted Codeword: " + transmitted);

        boolean isValid = verify(transmitted, generator);
        System.out.println("Receiver check passed: " + isValid);
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <vector>

std::string crc(std::string data, const std::string& generator) {
    int r = generator.length() - 1;
    data.append(r, '0');

    for (int i = 0; i <= data.length() - generator.length(); ++i) {
        if (data[i] == '1') {
            for (int j = 0; j < generator.length(); ++j) {
                data[i + j] = (data[i + j] == generator[j]) ? '0' : '1';
            }
        }
    }
    return data.substr(data.length() - r);
}

bool crc_check(std::string codeword, const std::string& generator) {
    for (int i = 0; i <= codeword.length() - generator.length(); ++i) {
        if (codeword[i] == '1') {
            for (int j = 0; j < generator.length(); ++j) {
                codeword[i + j] = (codeword[i + j] == generator[j]) ? '0' : '1';
            }
        }
    }

    for (char bit : codeword) {
        if (bit == '1') return false;
    }
    return true;
}

int main() {
    std::string data = "110101";
    std::string generator = "1011";
    
    std::string remainder = crc(data, generator);
    std::string transmitted = data + remainder;

    std::cout << "Data: " << data << std::endl;
    std::cout << "Generator: " << generator << std::endl;
    std::cout << "CRC Remainder: " << remainder << std::endl;
    std::cout << "Transmitted Codeword: " << transmitted << std::endl;

    bool isValid = crc_check(transmitted, generator);
    std::cout << "Receiver check passed: " << std::boolalpha << isValid << std::endl;

    return 0;
}
`
};
