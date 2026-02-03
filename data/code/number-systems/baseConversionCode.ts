export const baseConversionCode = {
  'Python': `def to_decimal(num_str, base):
    return int(num_str, base)

def from_decimal(decimal_num, base):
    if decimal_num == 0:
        return "0"
    
    digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    result = ""
    
    while decimal_num > 0:
        remainder = decimal_num % base
        result = digits[remainder] + result
        decimal_num //= base
        
    return result

# Example: Convert hex '1A' to binary
decimal_val = to_decimal("1A", 16) # 26
binary_val = from_decimal(decimal_val, 2) # "11010"

print(f"1A (base 16) = {binary_val} (base 2)")
`,
  'Java': `public class BaseConverter {
    public static int toDecimal(String numStr, int base) {
        return Integer.parseInt(numStr, base);
    }

    public static String fromDecimal(int decimalNum, int base) {
        return Integer.toString(decimalNum, base).toUpperCase();
    }

    public static void main(String[] args) {
        // Example: Convert hex "1A" to binary
        int decimalVal = toDecimal("1A", 16); // 26
        String binaryVal = fromDecimal(decimalVal, 2); // "11010"

        System.out.println("1A (base 16) = " + binaryVal + " (base 2)");
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <algorithm>
#include <vector>

// Convert from any base to decimal
long long toDecimal(std::string numStr, int base) {
    return std::stoll(numStr, nullptr, base);
}

// Convert from decimal to any base
std::string fromDecimal(long long decimalNum, int base) {
    if (decimalNum == 0) return "0";

    const std::string digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    std::string result = "";

    while (decimalNum > 0) {
        result += digits[decimalNum % base];
        decimalNum /= base;
    }
    std::reverse(result.begin(), result.end());
    return result;
}

int main() {
    // Example: Convert hex "1A" to binary
    long long decimalVal = toDecimal("1A", 16); // 26
    std::string binaryVal = fromDecimal(decimalVal, 2); // "11010"

    std::cout << "1A (base 16) = " << binaryVal << " (base 2)" << std::endl;
    return 0;
}
`
};
