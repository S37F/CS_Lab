export const hammingCodeCode = {
  'Python': `def generate_hamming_code(data):
    m = len(data)
    r = 1
    while 2**r < m + r + 1:
        r += 1
    n = m + r
    
    codeword = [0] * n
    j = 0
    # Place data bits
    for i in range(1, n + 1):
        if (i & (i - 1)) != 0: # Not a power of 2
            codeword[i - 1] = int(data[j])
            j += 1
            
    # Calculate parity bits
    for i in range(r):
        p_pos = 2**i
        ones_count = 0
        for j in range(1, n + 1):
            if j != p_pos and (j & p_pos) != 0:
                if codeword[j - 1] == 1:
                    ones_count += 1
        
        if ones_count % 2 != 0:
            codeword[p_pos - 1] = 1
            
    return "".join(map(str, codeword))

def correct_hamming_code(received):
    n = len(received)
    r = 0
    while 2**r < n + 1:
        r += 1
    
    syndrome = 0
    for i in range(r):
        p_pos = 2**i
        ones_count = 0
        for j in range(1, n + 1):
            if (j & p_pos) != 0:
                if received[j - 1] == '1':
                    ones_count += 1
        if ones_count % 2 != 0:
            syndrome += p_pos
            
    if syndrome != 0:
        print(f"Error detected at position: {syndrome}")
        corrected_list = list(received)
        # Flip the bit at the error position
        corrected_list[syndrome - 1] = '0' if received[syndrome - 1] == '1' else '1'
        return "".join(corrected_list)
    else:
        print("No error detected.")
        return received

# Example
data = "1011"
codeword = generate_hamming_code(data)
print(f"Data: {data} -> Codeword: {codeword}")

# Simulate an error
received = list(codeword)
received[4] = '0' # Flipped bit at pos 5
received = "".join(received)
print(f"Received (with error): {received}")

corrected = correct_hamming_code(received)
print(f"Corrected Codeword: {corrected}")
`,
  'Java': `public class HammingCode {

    public static String generate(String data) {
        int m = data.length();
        int r = 1;
        while (Math.pow(2, r) < m + r + 1) {
            r++;
        }
        int n = m + r;
        int[] codeword = new int[n];

        int dataIndex = 0;
        for (int i = 1; i <= n; i++) {
            if ((i & (i - 1)) != 0) { // Not power of 2
                codeword[i - 1] = data.charAt(dataIndex++) - '0';
            }
        }

        for (int i = 0; i < r; i++) {
            int pPos = (int) Math.pow(2, i);
            int onesCount = 0;
            for (int j = 1; j <= n; j++) {
                if (j != pPos && (j & pPos) != 0 && codeword[j - 1] == 1) {
                    onesCount++;
                }
            }
            if (onesCount % 2 != 0) {
                codeword[pPos - 1] = 1;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int bit : codeword) sb.append(bit);
        return sb.toString();
    }

    public static String correct(String received) {
        int n = received.length();
        int r = 0;
        while(Math.pow(2, r) < n + 1) r++;
        
        int syndrome = 0;
        for (int i = 0; i < r; i++) {
            int pPos = (int) Math.pow(2, i);
            int onesCount = 0;
            for (int j = 1; j <= n; j++) {
                if ((j & pPos) != 0 && received.charAt(j - 1) == '1') {
                    onesCount++;
                }
            }
            if (onesCount % 2 != 0) {
                syndrome += pPos;
            }
        }

        if (syndrome != 0) {
            System.out.println("Error detected at position: " + syndrome);
            char[] corrected = received.toCharArray();
            corrected[syndrome - 1] = (received.charAt(syndrome - 1) == '0') ? '1' : '0';
            return new String(corrected);
        } else {
            System.out.println("No error detected.");
            return received;
        }
    }

    public static void main(String[] args) {
        String data = "1011";
        String codeword = generate(data);
        System.out.println("Data: " + data + " -> Codeword: " + codeword);

        String received = codeword.substring(0, 4) + "0" + codeword.substring(5);
        System.out.println("Received (with error): " + received);

        String corrected = correct(received);
        System.out.println("Corrected Codeword: " + corrected);
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <vector>
#include <cmath>
#include <algorithm>

std::string generateHammingCode(std::string data) {
    int m = data.length();
    int r = 1;
    while (pow(2, r) < m + r + 1) {
        r++;
    }
    int n = m + r;
    std::string codeword(n, '0');

    for (int i = 0, j = 0; i < n; ++i) {
        int pos = i + 1;
        if ((pos & (pos - 1)) != 0) { // Not a power of 2
            codeword[i] = data[j++];
        }
    }

    for (int i = 0; i < r; ++i) {
        int p_pos = pow(2, i);
        int ones_count = 0;
        for (int j = 1; j <= n; ++j) {
            if (j != p_pos && (j & p_pos) && codeword[j - 1] == '1') {
                ones_count++;
            }
        }
        if (ones_count % 2 != 0) {
            codeword[p_pos - 1] = '1';
        }
    }
    return codeword;
}

std::string correctHammingCode(std::string received) {
    int n = received.length();
    int r = 0;
    while(pow(2, r) < n + 1) r++;
    
    int syndrome = 0;
    for (int i = 0; i < r; ++i) {
        int p_pos = pow(2, i);
        int ones_count = 0;
        for (int j = 1; j <= n; ++j) {
            if ((j & p_pos) && received[j - 1] == '1') {
                ones_count++;
            }
        }
        if (ones_count % 2 != 0) {
            syndrome += p_pos;
        }
    }

    if (syndrome != 0) {
        std::cout << "Error at position: " << syndrome << std::endl;
        received[syndrome - 1] = (received[syndrome - 1] == '0' ? '1' : '0');
    } else {
        std::cout << "No error detected." << std::endl;
    }
    return received;
}

int main() {
    std::string data = "1011";
    std::string codeword = generateHammingCode(data);
    std::cout << "Data: " << data << " -> Codeword: " << codeword << std::endl;

    std::string received = codeword;
    received[4] = '0'; // Flip bit at pos 5
    std::cout << "Received (with error): " << received << std::endl;
    
    std::string corrected = correctHammingCode(received);
    std::cout << "Corrected Codeword: " << corrected << std::endl;

    return 0;
}
`
};
