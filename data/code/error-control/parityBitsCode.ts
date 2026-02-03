export const parityBitsCode = {
  'Python': `def calculate_parity(data, parity_type='even'):
    """Calculates the parity bit for a binary string."""
    ones_count = data.count('1')
    
    if parity_type == 'even':
        # If number of ones is odd, parity bit is 1 to make it even
        return '1' if ones_count % 2 != 0 else '0'
    elif parity_type == 'odd':
        # If number of ones is even, parity bit is 1 to make it odd
        return '1' if ones_count % 2 == 0 else '0'
    else:
        raise ValueError("parity_type must be 'even' or 'odd'")

def check_parity(data_with_parity, parity_type='even'):
    """Checks if the received data has the correct parity."""
    ones_count = data_with_parity.count('1')
    
    if parity_type == 'even':
        return ones_count % 2 == 0
    else: # odd
        return ones_count % 2 != 0

# Example
data = "1011010"
even_parity_bit = calculate_parity(data, 'even')
print(f"Data: {data}, Even Parity Bit: {even_parity_bit}")
# Transmitted data: 10110100

# Receiver checks
received_ok = "10110100"
received_error = "10111100" # One bit flipped
print(f"Check '{received_ok}': {check_parity(received_ok, 'even')}") # True
print(f"Check '{received_error}': {check_parity(received_error, 'even')}") # False
`,
  'Java': `public class ParityBit {

    public static char calculate(String data, String parityType) {
        int onesCount = 0;
        for (char c : data.toCharArray()) {
            if (c == '1') {
                onesCount++;
            }
        }

        if ("even".equalsIgnoreCase(parityType)) {
            return (onesCount % 2 != 0) ? '1' : '0';
        } else if ("odd".equalsIgnoreCase(parityType)) {
            return (onesCount % 2 == 0) ? '1' : '0';
        } else {
            throw new IllegalArgumentException("Parity type must be 'even' or 'odd'");
        }
    }

    public static boolean check(String dataWithParity, String parityType) {
        int onesCount = 0;
        for (char c : dataWithParity.toCharArray()) {
            if (c == '1') {
                onesCount++;
            }
        }

        if ("even".equalsIgnoreCase(parityType)) {
            return onesCount % 2 == 0;
        } else { // odd
            return onesCount % 2 != 0;
        }
    }

    public static void main(String[] args) {
        String data = "1011010";
        char evenParityBit = calculate(data, "even");
        System.out.println("Data: " + data + ", Even Parity Bit: " + evenParityBit);

        System.out.println("Check '10110100': " + check("10110100", "even")); // true
        System.out.println("Check '10111100': " + check("10111100", "even")); // false
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <numeric>

char calculateParity(const std::string& data, const std::string& parityType) {
    int onesCount = 0;
    for (char c : data) {
        if (c == '1') {
            onesCount++;
        }
    }

    if (parityType == "even") {
        return (onesCount % 2 != 0) ? '1' : '0';
    } else { // "odd"
        return (onesCount % 2 == 0) ? '1' : '0';
    }
}

bool checkParity(const std::string& dataWithParity, const std::string& parityType) {
    int onesCount = 0;
    for (char c : dataWithParity) {
        if (c == '1') {
            onesCount++;
        }
    }

    if (parityType == "even") {
        return onesCount % 2 == 0;
    } else { // "odd"
        return onesCount % 2 != 0;
    }
}

int main() {
    std::string data = "1011010";
    char evenParityBit = calculateParity(data, "even");
    std::cout << "Data: " << data << ", Even Parity Bit: " << evenParityBit << std::endl;

    std::cout << std::boolalpha;
    std::cout << "Check '10110100': " << checkParity("10110100", "even") << std::endl;
    std::cout << "Check '10111100': " << checkParity("10111100", "even") << std::endl;
    
    return 0;
}
`
};
