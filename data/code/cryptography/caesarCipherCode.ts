export const caesarCipherCode = {
  'Python': `def caesar_cipher(text, shift, encrypt=True):
    result = []
    
    if not encrypt:
        shift = -shift
        
    for char in text:
        if 'a' <= char <= 'z':
            start = ord('a')
            shifted_char = chr((ord(char) - start + shift) % 26 + start)
            result.append(shifted_char)
        elif 'A' <= char <= 'Z':
            start = ord('A')
            shifted_char = chr((ord(char) - start + shift) % 26 + start)
            result.append(shifted_char)
        else:
            result.append(char)
            
    return "".join(result)

# Example
plaintext = "Hello, World!"
shift = 3
encrypted = caesar_cipher(plaintext, shift, encrypt=True)
print(f"Encrypted: {encrypted}") # Output: Khoor, Zruog!

decrypted = caesar_cipher(encrypted, shift, encrypt=False)
print(f"Decrypted: {decrypted}") # Output: Hello, World!
`,
  'Java': `public class CaesarCipher {

    public static String process(String text, int shift, boolean encrypt) {
        if (!encrypt) {
            shift = -shift;
        }
        
        StringBuilder result = new StringBuilder();
        
        for (char character : text.toCharArray()) {
            if (character >= 'a' && character <= 'z') {
                int start = 'a';
                int originalAlphabetPosition = character - start;
                int newAlphabetPosition = (originalAlphabetPosition + shift) % 26;
                if (newAlphabetPosition < 0) { // Handle negative shift
                    newAlphabetPosition += 26;
                }
                char newCharacter = (char) (start + newAlphabetPosition);
                result.append(newCharacter);
            } else if (character >= 'A' && character <= 'Z') {
                int start = 'A';
                int originalAlphabetPosition = character - start;
                int newAlphabetPosition = (originalAlphabetPosition + shift) % 26;
                if (newAlphabetPosition < 0) {
                    newAlphabetPosition += 26;
                }
                char newCharacter = (char) (start + newAlphabetPosition);
                result.append(newCharacter);
            } else {
                result.append(character);
            }
        }
        return result.toString();
    }

    public static void main(String[] args) {
        String plaintext = "Hello, World!";
        int shift = 3;
        String encrypted = process(plaintext, shift, true);
        System.out.println("Encrypted: " + encrypted); // Output: Khoor, Zruog!
        
        String decrypted = process(encrypted, shift, false);
        System.out.println("Decrypted: " + decrypted); // Output: Hello, World!
    }
}
`,
  'C++': `#include <iostream>
#include <string>

std::string caesar_cipher(const std::string& text, int shift, bool encrypt) {
    std::string result = "";
    
    if (!encrypt) {
        shift = -shift;
    }
    
    for (char ch : text) {
        if (ch >= 'a' && ch <= 'z') {
            char base = 'a';
            // Need to handle negative results of % in C++
            result += (char)((((ch - base) + shift) % 26 + 26) % 26 + base);
        } else if (ch >= 'A' && ch <= 'Z') {
            char base = 'A';
            result += (char)((((ch - base) + shift) % 26 + 26) % 26 + base);
        } else {
            result += ch;
        }
    }
    return result;
}

int main() {
    std::string plaintext = "Hello, World!";
    int shift = 3;
    
    std::string encrypted = caesar_cipher(plaintext, shift, true);
    std::cout << "Encrypted: " << encrypted << std::endl; // Output: Khoor, Zruog!
    
    std::string decrypted = caesar_cipher(encrypted, shift, false);
    std::cout << "Decrypted: " << decrypted << std::endl; // Output: Hello, World!
    
    return 0;
}
`
};
