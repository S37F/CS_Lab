export const lzwCompressionCode = {
  'Python': `def lzw_encode(data):
    # Initialize dictionary with single characters
    dictionary = {chr(i): i for i in range(256)}
    dict_size = 256
    
    w = ""
    result = []
    for c in data:
        wc = w + c
        if wc in dictionary:
            w = wc
        else:
            result.append(dictionary[w])
            # Add wc to the dictionary
            dictionary[wc] = dict_size
            dict_size += 1
            w = c

    # Output the code for the last word
    if w:
        result.append(dictionary[w])
        
    return result

def lzw_decode(compressed_data):
    # Initialize dictionary
    dictionary = {i: chr(i) for i in range(256)}
    dict_size = 256

    # First character is always known
    w = result = dictionary[compressed_data.pop(0)]
    
    for k in compressed_data:
        if k in dictionary:
            entry = dictionary[k]
        elif k == dict_size:
            entry = w + w[0]
        else:
            raise ValueError("Bad compressed k: %s" % k)

        result += entry
        
        # Add w + entry[0] to the dictionary
        dictionary[dict_size] = w + entry[0]
        dict_size += 1
        
        w = entry
        
    return result

# Example
original = "TOBEORNOTTOBEORTOBEORNOT"
encoded = lzw_encode(original)
print(f"Encoded: {encoded}")

decoded = lzw_decode(encoded)
print(f"Decoded: {decoded}")
`,
  'Java': `import java.util.*;

public class LZW {

    public static List<Integer> encode(String data) {
        Map<String, Integer> dictionary = new HashMap<>();
        for (int i = 0; i < 256; i++) {
            dictionary.put("" + (char)i, i);
        }
        int dictSize = 256;

        String w = "";
        List<Integer> result = new ArrayList<>();
        for (char c : data.toCharArray()) {
            String wc = w + c;
            if (dictionary.containsKey(wc)) {
                w = wc;
            } else {
                result.add(dictionary.get(w));
                dictionary.put(wc, dictSize++);
                w = "" + c;
            }
        }

        if (!w.equals("")) {
            result.add(dictionary.get(w));
        }
        return result;
    }

    public static String decode(List<Integer> compressed) {
        Map<Integer, String> dictionary = new HashMap<>();
        for (int i = 0; i < 256; i++) {
            dictionary.put(i, "" + (char)i);
        }
        int dictSize = 256;

        String w = "" + (char)(int)compressed.remove(0);
        StringBuilder result = new StringBuilder(w);
        for (int k : compressed) {
            String entry;
            if (dictionary.containsKey(k)) {
                entry = dictionary.get(k);
            } else if (k == dictSize) {
                entry = w + w.charAt(0);
            } else {
                throw new IllegalArgumentException("Bad compressed k: " + k);
            }

            result.append(entry);
            dictionary.put(dictSize++, w + entry.charAt(0));
            w = entry;
        }
        return result.toString();
    }

    public static void main(String[] args) {
        String original = "TOBEORNOTTOBEORTOBEORNOT";
        List<Integer> encoded = encode(original);
        System.out.println("Encoded: " + encoded);

        String decoded = decode(new ArrayList<>(encoded));
        System.out.println("Decoded: " + decoded);
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <vector>
#include <map>

std::vector<int> lzw_encode(const std::string& data) {
    std::map<std::string, int> dictionary;
    for (int i = 0; i < 256; ++i) {
        dictionary[std::string(1, char(i))] = i;
    }
    int dict_size = 256;

    std::string w;
    std::vector<int> result;
    for (char c : data) {
        std::string wc = w + c;
        if (dictionary.count(wc)) {
            w = wc;
        } else {
            result.push_back(dictionary[w]);
            dictionary[wc] = dict_size++;
            w = std::string(1, c);
        }
    }

    if (!w.empty()) {
        result.push_back(dictionary[w]);
    }
    return result;
}

std::string lzw_decode(const std::vector<int>& compressed) {
    std::map<int, std::string> dictionary;
    for (int i = 0; i < 256; ++i) {
        dictionary[i] = std::string(1, char(i));
    }
    int dict_size = 256;

    std::string w(1, compressed[0]);
    std::string result = w;
    std::string entry;
    for (size_t i = 1; i < compressed.size(); ++i) {
        int k = compressed[i];
        if (dictionary.count(k)) {
            entry = dictionary[k];
        } else if (k == dict_size) {
            entry = w + w[0];
        } else {
            throw std::runtime_error("Bad compressed k");
        }

        result += entry;
        dictionary[dict_size++] = w + entry[0];
        w = entry;
    }
    return result;
}

int main() {
    std::string original = "TOBEORNOTTOBEORTOBEORNOT";
    std::vector<int> encoded = lzw_encode(original);

    std::cout << "Encoded: ";
    for (int code : encoded) {
        std::cout << code << " ";
    }
    std::cout << std::endl;

    std::string decoded = lzw_decode(encoded);
    std::cout << "Decoded: " << decoded << std::endl;

    return 0;
}
`
};
