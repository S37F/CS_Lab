
export const scanDiskCode = {
  'Python': `def scan_disk_scheduling(requests, start_position, direction='up', max_cylinder=200):
    total_movement = 0
    current_position = start_position
    requests_copy = sorted(requests)
    path = []
    
    if direction == 'up':
        up_requests = [r for r in requests_copy if r >= current_position]
        for req in up_requests:
            path.append(req)
            total_movement += abs(req - current_position)
            current_position = req
        
        if any(r < start_position for r in requests_copy):
            total_movement += abs(max_cylinder - 1 - current_position)
            current_position = max_cylinder - 1
            path.append(current_position)
        
        down_requests = sorted([r for r in requests_copy if r < start_position], reverse=True)
        for req in down_requests:
            path.append(req)
            total_movement += abs(req - current_position)
            current_position = req

    else: # direction == 'down'
        down_requests = sorted([r for r in requests_copy if r <= current_position], reverse=True)
        for req in down_requests:
            path.append(req)
            total_movement += abs(req - current_position)
            current_position = req
            
        if any(r > start_position for r in requests_copy):
            total_movement += abs(0 - current_position)
            current_position = 0
            path.append(current_position)
        
        up_requests = sorted([r for r in requests_copy if r > start_position])
        for req in up_requests:
            path.append(req)
            total_movement += abs(req - current_position)
            current_position = req

    return total_movement, path

# Example
requests = [98, 183, 37, 122, 14, 124, 65, 67]
start_pos = 53
movement, path = scan_disk_scheduling(requests, start_pos, direction='up')
print(f"Total head movement: {movement}")
print(f"Path: {path}")
`,
  'Java': `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SCANDiskScheduling {

    public static int calculateTotalMovement(List<Integer> requests, int startPosition, String direction, int maxCylinder) {
        int totalMovement = 0;
        int currentPosition = startPosition;
        List<Integer> sortedRequests = new ArrayList<>(requests);
        Collections.sort(sortedRequests);

        if (direction.equalsIgnoreCase("up")) {
            for (int req : sortedRequests) {
                if (req >= currentPosition) {
                    totalMovement += Math.abs(req - currentPosition);
                    currentPosition = req;
                }
            }
            if (sortedRequests.get(0) < startPosition) { // If there are requests on the other side
                totalMovement += Math.abs(maxCylinder - 1 - currentPosition);
                currentPosition = maxCylinder - 1;
            }
            for (int i = sortedRequests.size() - 1; i >= 0; i--) {
                int req = sortedRequests.get(i);
                if (req < startPosition) {
                    totalMovement += Math.abs(req - currentPosition);
                    currentPosition = req;
                }
            }
        } else { // "down"
            for (int i = sortedRequests.size() - 1; i >= 0; i--) {
                int req = sortedRequests.get(i);
                if (req <= currentPosition) {
                    totalMovement += Math.abs(req - currentPosition);
                    currentPosition = req;
                }
            }
             if (sortedRequests.get(sortedRequests.size() - 1) > startPosition) {
                totalMovement += Math.abs(0 - currentPosition);
                currentPosition = 0;
            }
            for (int req : sortedRequests) {
                if (req > startPosition) {
                    totalMovement += Math.abs(req - currentPosition);
                    currentPosition = req;
                }
            }
        }
        return totalMovement;
    }

    public static void main(String[] args) {
        List<Integer> requests = List.of(98, 183, 37, 122, 14, 124, 65, 67);
        int startPos = 53;
        int movement = calculateTotalMovement(new ArrayList<>(requests), startPos, "up", 200);
        System.out.println("Total head movement: " + movement);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>

int scanDiskScheduling(std::vector<int> requests, int startPosition, std::string direction, int maxCylinder) {
    int totalMovement = 0;
    int currentPosition = startPosition;
    std::sort(requests.begin(), requests.end());

    if (direction == "up") {
        for (int req : requests) {
            if (req >= currentPosition) {
                totalMovement += std::abs(req - currentPosition);
                currentPosition = req;
            }
        }
        if (requests[0] < startPosition) {
            totalMovement += std::abs(maxCylinder - 1 - currentPosition);
            currentPosition = maxCylinder - 1;
        }
        for (int i = requests.size() - 1; i >= 0; --i) {
            if (requests[i] < startPosition) {
                totalMovement += std::abs(requests[i] - currentPosition);
                currentPosition = requests[i];
            }
        }
    } else { // "down"
        for (int i = requests.size() - 1; i >= 0; --i) {
            if (requests[i] <= currentPosition) {
                totalMovement += std::abs(requests[i] - currentPosition);
                currentPosition = requests[i];
            }
        }
        if (requests.back() > startPosition) {
            totalMovement += std::abs(0 - currentPosition);
            currentPosition = 0;
        }
        for (int req : requests) {
            if (req > startPosition) {
                totalMovement += std::abs(req - currentPosition);
                currentPosition = req;
            }
        }
    }
    return totalMovement;
}

int main() {
    std::vector<int> requests = {98, 183, 37, 122, 14, 124, 65, 67};
    int startPos = 53;
    int movement = scanDiskScheduling(requests, startPos, "up", 200);
    std::cout << "Total head movement: " << movement << std::endl;
    return 0;
}
`
};
