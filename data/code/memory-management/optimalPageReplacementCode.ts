export const optimalPageReplacementCode = {
  'Python': `def find_farthest_page(frames, future_pages):
    farthest_page = -1
    farthest_distance = -1
    for frame_page in frames:
        try:
            distance = future_pages.index(frame_page)
            if distance > farthest_distance:
                farthest_distance = distance
                farthest_page = frame_page
        except ValueError: # Page not found in future references
            return frame_page
    return farthest_page

def optimal_page_replacement(pages, frame_count):
    frames = []
    page_faults = 0
    page_hits = 0
    
    for i, page in enumerate(pages):
        if page in frames:
            page_hits += 1
        else:
            page_faults += 1
            if len(frames) < frame_count:
                frames.append(page)
            else:
                future_pages = pages[i+1:]
                page_to_replace = find_farthest_page(frames, future_pages)
                replace_index = frames.index(page_to_replace)
                frames[replace_index] = page
                
    return page_faults, page_hits

# Example
pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
frame_count = 3
faults, hits = optimal_page_replacement(pages, frame_count)
print(f"Page Faults: {faults}")
print(f"Page Hits: {hits}")
`,
  'Java': `import java.util.ArrayList;
import java.util.List;

public class OptimalPageReplacement {

    private static int findFarthestPage(List<Integer> frames, int[] pages, int currentIndex) {
        int farthestPage = -1;
        int farthestDistance = -1;
        
        for (Integer framePage : frames) {
            int distance = Integer.MAX_VALUE;
            for (int i = currentIndex; i < pages.length; i++) {
                if (pages[i] == framePage) {
                    distance = i;
                    break;
                }
            }
            if (distance > farthestDistance) {
                farthestDistance = distance;
                farthestPage = framePage;
            }
        }
        return farthestPage;
    }

    public static int[] optimal(int[] pages, int frameCount) {
        List<Integer> frames = new ArrayList<>();
        int pageFaults = 0;
        int pageHits = 0;

        for (int i = 0; i < pages.length; i++) {
            int page = pages[i];
            if (frames.contains(page)) {
                pageHits++;
            } else {
                pageFaults++;
                if (frames.size() < frameCount) {
                    frames.add(page);
                } else {
                    int pageToReplace = findFarthestPage(frames, pages, i + 1);
                    int replaceIndex = frames.indexOf(pageToReplace);
                    frames.set(replaceIndex, page);
                }
            }
        }
        return new int[]{pageFaults, pageHits};
    }

    public static void main(String[] args) {
        int[] pages = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
        int frameCount = 3;
        int[] result = optimal(pages, frameCount);
        System.out.println("Page Faults: " + result[0]);
        System.out.println("Page Hits: " + result[1]);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <algorithm>

int findFarthestPage(const std::vector<int>& frames, const std::vector<int>& pages, int currentIndex) {
    int farthestPage = -1;
    int farthestDistance = -1;
    
    for (int framePage : frames) {
        int distance = -1;
        for (int i = currentIndex; i < pages.size(); ++i) {
            if (pages[i] == framePage) {
                distance = i;
                break;
            }
        }
        if (distance == -1) { // Not found in the future
            return framePage;
        }
        if (distance > farthestDistance) {
            farthestDistance = distance;
            farthestPage = framePage;
        }
    }
    return farthestPage;
}

void optimalPageReplacement(const std::vector<int>& pages, int frame_count) {
    std::vector<int> frames;
    int page_faults = 0;
    int page_hits = 0;

    for (int i = 0; i < pages.size(); ++i) {
        int page = pages[i];
        auto it = std::find(frames.begin(), frames.end(), page);

        if (it != frames.end()) {
            page_hits++;
        } else {
            page_faults++;
            if (frames.size() < frame_count) {
                frames.push_back(page);
            } else {
                int pageToReplace = findFarthestPage(frames, pages, i + 1);
                auto replace_it = std::find(frames.begin(), frames.end(), pageToReplace);
                *replace_it = page;
            }
        }
    }

    std::cout << "Page Faults: " << page_faults << std::endl;
    std::cout << "Page Hits: " << page_hits << std::endl;
}

int main() {
    std::vector<int> pages = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
    int frame_count = 3;
    optimalPageReplacement(pages, frame_count);
    return 0;
}
`
};
