export const runLengthEncodingCode = {
  'Python': `def encode_rle(data):
    if not data:
        return ""
    
    encoded = []
    count = 1
    
    for i in range(1, len(data)):
        if data[i] == data[i-1]:
            count += 1
        else:
            encoded.append(str(count) + data[i-1])
            count = 1
            
    # Append the last run
    encoded.append(str(count) + data[-1])
    
    return "".join(encoded)

def decode_rle(encoded_data):
    decoded = []
    i = 0
    while i < len(encoded_data):
        count_str = ""
        while i < len(encoded_data) and encoded_data[i].isdigit():
            count_str += encoded_data[i]
            i += 1
        
        count = int(count_str)
        char = encoded_data[i]
        decoded.append(char * count)
        i += 1
        
    return "".join(decoded)

# Example
original = "WWWWWBWWBB"
encoded = encode_rle(original)
print(f"Encoded: {encoded}") # Output: 5W1B2W2B

decoded = decode_rle(encoded)
print(f"Decoded: {decoded}") # Output: WWWWWBWWBB
`,
  'Java': `import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RunLengthEncoding {

    public static String encode(String data) {
        if (data == null || data.isEmpty()) {
            return "";
        }
        
        StringBuilder encoded = new StringBuilder();
        int count = 1;
        
        for (int i = 1; i < data.length(); i++) {
            if (data.charAt(i) == data.charAt(i - 1)) {
                count++;
            } else {
                encoded.append(count).append(data.charAt(i - 1));
                count = 1;
            }
        }
        encoded.append(count).append(data.charAt(data.length() - 1));
        
        return encoded.toString();
    }

    public static String decode(String encodedData) {
        StringBuilder decoded = new StringBuilder();
        Pattern pattern = Pattern.compile("(\\\\d+)(\\\\D)");
        Matcher matcher = pattern.matcher(encodedData);
        
        while (matcher.find()) {
            int count = Integer.parseInt(matcher.group(1));
            String character = matcher.group(2);
            for (int i = 0; i < count; i++) {
                decoded.append(character);
            }
        }
        
        return decoded.toString();
    }

    public static void main(String[] args) {
        String original = "WWWWWBWWBB";
        String encoded = encode(original);
        System.out.println("Encoded: " + encoded); // Output: 5W1B2W2B

        String decoded = decode(encoded);
        System.out.println("Decoded: " + decoded); // Output: WWWWWBWWBB
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <vector>

std::string encode_rle(const std::string& data) {
    if (data.empty()) {
        return "";
    }

    std::string encoded;
    int count = 1;

    for (size_t i = 1; i < data.length(); ++i) {
        if (data[i] == data[i - 1]) {
            count++;
        } else {
            encoded += std::to_string(count) + data[i - 1];
            count = 1;
        }
    }
    encoded += std::to_string(count) + data.back();

    return encoded;
}

std::string decode_rle(const std::string& encoded_data) {
    std::string decoded;
    std::string count_str;

    for (char ch : encoded_data) {
        if (isdigit(ch)) {
            count_str += ch;
        } else {
            if (!count_str.empty()) {
                int count = std::stoi(count_str);
                decoded.append(count, ch);
                count_str.clear();
            }
        }
    }
    return decoded;
}

int main() {
    std::string original = "WWWWWBWWBB";
    std::string encoded = encode_rle(original);
    std::cout << "Encoded: " << encoded << std::endl; // Output: 5W1B2W2B

    std::string decoded = decode_rle(encoded);
    std::cout << "Decoded: " << decoded << std::endl; // Output: WWWWWBWWBB

    return 0;
}
`
};
