export const checksumCode = {
  'Python': `def calculate_checksum(hex_words):
    """Calculates the 16-bit Internet Checksum."""
    total_sum = 0
    
    # Sum all 16-bit words
    for word in hex_words:
        total_sum += int(word, 16)
        
    # Add the carry-out bits to the sum (end-around carry)
    while (total_sum >> 16) > 0:
        carry = total_sum >> 16
        main_sum = total_sum & 0xFFFF
        total_sum = main_sum + carry
        
    # Take the one's complement of the final sum
    checksum = ~total_sum & 0xFFFF
    
    return hex(checksum)

def verify_checksum(hex_words_with_checksum):
    """Verifies a checksum. Returns True if valid."""
    total_sum = 0
    for word in hex_words_with_checksum:
        total_sum += int(word, 16)
        
    while (total_sum >> 16) > 0:
        carry = total_sum >> 16
        main_sum = total_sum & 0xFFFF
        total_sum = main_sum + carry
        
    # If the checksum is correct, the one's complement sum will be 0xFFFF
    return total_sum == 0xFFFF

# Example
data = ['4500', '003c', '1c46', '4000', '4006']
checksum_val = calculate_checksum(data)
print(f"Calculated Checksum: {checksum_val}") # Example output: 0xb89e

# Verification
received_data = data + [checksum_val[2:]] # Add checksum to data
is_valid = verify_checksum(received_data)
print(f"Verification successful: {is_valid}") # True
`,
  'Java': `import java.util.ArrayList;
import java.util.List;

public class InternetChecksum {

    public static int calculateChecksum(List<String> hexWords) {
        int sum = 0;
        for (String word : hexWords) {
            sum += Integer.parseInt(word, 16);
        }

        // End-around carry
        while ((sum >> 16) > 0) {
            sum = (sum & 0xFFFF) + (sum >> 16);
        }

        // One's complement
        return ~sum & 0xFFFF;
    }

    public static boolean verifyChecksum(List<String> receivedWords) {
        int sum = 0;
        for (String word : receivedWords) {
            sum += Integer.parseInt(word, 16);
        }

        while ((sum >> 16) > 0) {
            sum = (sum & 0xFFFF) + (sum >> 16);
        }
        
        return sum == 0xFFFF;
    }
    
    public static void main(String[] args) {
        List<String> data = new ArrayList<>(List.of("4500", "003c", "1c46", "4000", "4006"));
        int checksum = calculateChecksum(data);
        System.out.printf("Calculated Checksum: 0x%04x\\n", checksum);

        data.add(String.format("%04x", checksum));
        boolean isValid = verifyChecksum(data);
        System.out.println("Verification successful: " + isValid);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <string>
#include <numeric>
#include <iomanip>

uint16_t calculateChecksum(const std::vector<uint16_t>& data) {
    uint32_t sum = 0;
    for (uint16_t word : data) {
        sum += word;
    }

    // End-around carry
    while (sum >> 16) {
        sum = (sum & 0xFFFF) + (sum >> 16);
    }

    // One's complement
    return ~static_cast<uint16_t>(sum);
}

bool verifyChecksum(std::vector<uint16_t> receivedData) {
    uint32_t sum = 0;
    for (uint16_t word : receivedData) {
        sum += word;
    }

    while (sum >> 16) {
        sum = (sum & 0xFFFF) + (sum >> 16);
    }

    return static_cast<uint16_t>(sum) == 0xFFFF;
}

int main() {
    std::vector<uint16_t> data = {0x4500, 0x003c, 0x1c46, 0x4000, 0x4006};
    
    uint16_t checksum = calculateChecksum(data);
    std::cout << "Calculated Checksum: 0x" << std::hex << std::setw(4) << std::setfill('0') << checksum << std::endl;

    data.push_back(checksum);
    bool isValid = verifyChecksum(data);
    std::cout << "Verification successful: " << std::boolalpha << isValid << std::endl;

    return 0;
}
`
};
