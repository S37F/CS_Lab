export const fifoPageReplacementCode = {
  'Python': `from collections import deque

def fifo_page_replacement(pages, frame_count):
    frames = []
    page_faults = 0
    page_hits = 0
    
    for page in pages:
        if page in frames:
            page_hits += 1
        else:
            page_faults += 1
            if len(frames) < frame_count:
                frames.append(page)
            else:
                # Replace the first page that was added (FIFO)
                frames.pop(0)
                frames.append(page)
                
    return page_faults, page_hits

# Example
pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
frame_count = 3
faults, hits = fifo_page_replacement(pages, frame_count)
print(f"Page Faults: {faults}")
print(f"Page Hits: {hits}")
`,
  'Java': `import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;

public class FIFOPageReplacement {

    public static int[] fifo(int[] pages, int frameCount) {
        Set<Integer> frames = new HashSet<>(frameCount);
        Queue<Integer> pageOrder = new LinkedList<>();
        int pageFaults = 0;
        int pageHits = 0;

        for (int page : pages) {
            if (frames.contains(page)) {
                pageHits++;
            } else {
                pageFaults++;
                if (frames.size() < frameCount) {
                    frames.add(page);
                    pageOrder.add(page);
                } else {
                    int oldestPage = pageOrder.poll();
                    frames.remove(oldestPage);
                    frames.add(page);
                    pageOrder.add(page);
                }
            }
        }
        return new int[]{pageFaults, pageHits};
    }

    public static void main(String[] args) {
        int[] pages = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
        int frameCount = 3;
        int[] result = fifo(pages, frameCount);
        System.out.println("Page Faults: " + result[0]);
        System.out.println("Page Hits: " + result[1]);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>

void fifoPageReplacement(const std::vector<int>& pages, int frame_count) {
    std::unordered_set<int> frames;
    std::queue<int> page_order;
    int page_faults = 0;
    int page_hits = 0;

    for (int page : pages) {
        if (frames.find(page) != frames.end()) {
            page_hits++;
        } else {
            page_faults++;
            if (frames.size() < frame_count) {
                frames.insert(page);
                page_order.push(page);
            } else {
                int oldest_page = page_order.front();
                page_order.pop();
                frames.erase(oldest_page);
                frames.insert(page);
                page_order.push(page);
            }
        }
    }

    std::cout << "Page Faults: " << page_faults << std::endl;
    std::cout << "Page Hits: " << page_hits << std::endl;
}

int main() {
    std::vector<int> pages = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
    int frame_count = 3;
    fifoPageReplacement(pages, frame_count);
    return 0;
}
`
};
