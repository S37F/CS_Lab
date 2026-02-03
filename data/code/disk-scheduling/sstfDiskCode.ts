export const sstfDiskCode = {
  'Python': `def sstf_disk_scheduling(requests, start_position):
    """
    Calculates the total head movement for SSTF disk scheduling.
    """
    requests_copy = list(requests)
    total_movement = 0
    current_position = start_position
    
    print(f"Head starts at {current_position}")
    
    while requests_copy:
        # Find the request with the minimum seek time
        closest_request = min(requests_copy, key=lambda x: abs(x - current_position))
        
        movement = abs(closest_request - current_position)
        total_movement += movement
        print(f"Move from {current_position} to {closest_request} with movement {movement}")
        current_position = closest_request
        requests_copy.remove(closest_request)
        
    return total_movement

# Example
requests = [98, 183, 37, 122, 14, 124, 65, 67]
start_pos = 53
total_head_movement = sstf_disk_scheduling(requests, start_pos)
print(f"\\nTotal head movement: {total_head_movement}")
`,
  'Java': `import java.util.ArrayList;
import java.util.List;

public class SSTFDiskScheduling {

    public static int calculateTotalMovement(List<Integer> requests, int startPosition) {
        List<Integer> requestsCopy = new ArrayList<>(requests);
        int totalMovement = 0;
        int currentPosition = startPosition;

        System.out.println("Head starts at " + currentPosition);

        while (!requestsCopy.isEmpty()) {
            int closestRequest = -1;
            int minDistance = Integer.MAX_VALUE;

            for (int request : requestsCopy) {
                int distance = Math.abs(request - currentPosition);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestRequest = request;
                }
            }
            
            totalMovement += minDistance;
            System.out.println("Move from " + currentPosition + " to " + closestRequest + " with movement " + minDistance);
            currentPosition = closestRequest;
            requestsCopy.remove(Integer.valueOf(closestRequest));
        }
        return totalMovement;
    }

    public static void main(String[] args) {
        List<Integer> requests = new ArrayList<>(List.of(98, 183, 37, 122, 14, 124, 65, 67));
        int startPos = 53;
        int totalHeadMovement = calculateTotalMovement(requests, startPos);
        System.out.println("\\nTotal head movement: " + totalHeadMovement);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <limits>

int sstfDiskScheduling(std::vector<int> requests, int startPosition) {
    int totalMovement = 0;
    int currentPosition = startPosition;

    std::cout << "Head starts at " << currentPosition << std::endl;

    while (!requests.empty()) {
        auto closest_it = requests.begin();
        int min_distance = std::numeric_limits<int>::max();

        for (auto it = requests.begin(); it != requests.end(); ++it) {
            int distance = std::abs(*it - currentPosition);
            if (distance < min_distance) {
                min_distance = distance;
                closest_it = it;
            }
        }
        
        int closest_request = *closest_it;
        totalMovement += min_distance;
        std::cout << "Move from " << currentPosition << " to " << closest_request << " with movement " << min_distance << std::endl;
        currentPosition = closest_request;
        requests.erase(closest_it);
    }
    return totalMovement;
}

int main() {
    std::vector<int> requests = {98, 183, 37, 122, 14, 124, 65, 67};
    int startPos = 53;
    int totalHeadMovement = sstfDiskScheduling(requests, startPos);
    std::cout << "\\nTotal head movement: " << totalHeadMovement << std::endl;
    return 0;
}
`
};
