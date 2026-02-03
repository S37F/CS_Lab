export const lruPageReplacementCode = {
  'Python': `from collections import OrderedDict

def lru_page_replacement(pages, frame_count):
    # OrderedDict can be used to simulate LRU cache behavior
    frames = OrderedDict()
    page_faults = 0
    page_hits = 0
    
    for page in pages:
        if page in frames:
            page_hits += 1
            # Move the accessed page to the end to mark it as most recently used
            frames.move_to_end(page)
        else:
            page_faults += 1
            if len(frames) >= frame_count:
                # Remove the first item (least recently used)
                frames.popitem(last=False)
            frames[page] = None # Add new page to the end
            
    return page_faults, page_hits

# Example
pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
frame_count = 3
faults, hits = lru_page_replacement(pages, frame_count)
print(f"Page Faults: {faults}")
print(f"Page Hits: {hits}")
`,
  'Java': `import java.util.LinkedHashMap;
import java.util.Map;

public class LRUPageReplacement {

    // LinkedHashMap can be configured to act as an LRU cache
    static class LRUCache<K, V> extends LinkedHashMap<K, V> {
        private int capacity;

        public LRUCache(int capacity) {
            super(capacity, 0.75f, true); // true for access-order
            this.capacity = capacity;
        }

        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > capacity;
        }
    }

    public static int[] lru(int[] pages, int frameCount) {
        LRUCache<Integer, Boolean> frames = new LRUCache<>(frameCount);
        int pageFaults = 0;
        int pageHits = 0;

        for (int page : pages) {
            if (frames.containsKey(page)) {
                pageHits++;
                frames.get(page); // Access to update order
            } else {
                pageFaults++;
                frames.put(page, true);
            }
        }
        return new int[]{pageFaults, pageHits};
    }

    public static void main(String[] args) {
        int[] pages = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
        int frameCount = 3;
        int[] result = lru(pages, frameCount);
        System.out.println("Page Faults: " + result[0]);
        System.out.println("Page Hits: " + result[1]);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <list>
#include <unordered_map>

void lruPageReplacement(const std::vector<int>& pages, int frame_count) {
    std::list<int> lru_list; // Stores pages in LRU order
    std::unordered_map<int, std::list<int>::iterator> frame_map;
    int page_faults = 0;
    int page_hits = 0;

    for (int page : pages) {
        if (frame_map.find(page) != frame_map.end()) {
            // Page hit
            page_hits++;
            // Move accessed page to the front (most recent)
            lru_list.erase(frame_map[page]);
            lru_list.push_front(page);
            frame_map[page] = lru_list.begin();
        } else {
            // Page fault
            page_faults++;
            if (lru_list.size() == frame_count) {
                // Remove the least recently used page (at the back)
                int lru_page = lru_list.back();
                lru_list.pop_back();
                frame_map.erase(lru_page);
            }
            // Add the new page to the front
            lru_list.push_front(page);
            frame_map[page] = lru_list.begin();
        }
    }

    std::cout << "Page Faults: " << page_faults << std::endl;
    std::cout << "Page Hits: " << page_hits << std::endl;
}

int main() {
    std::vector<int> pages = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
    int frame_count = 3;
    lruPageReplacement(pages, frame_count);
    return 0;
}
`
};
