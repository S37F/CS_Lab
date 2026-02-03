
export const cscanDiskCode = {
  'Python': `def cscan_disk_scheduling(requests, start_position, max_cylinder=200):
    total_movement = 0
    current_position = start_position
    requests_copy = sorted(requests)
    path = []

    # Service requests >= start_position
    up_requests = [r for r in requests_copy if r >= current_position]
    for req in up_requests:
        path.append(req)
        total_movement += abs(req - current_position)
        current_position = req

    # If there are requests on the other side, jump to the start
    if any(r < start_position for r in requests_copy):
        # Move to the end
        total_movement += abs(max_cylinder - 1 - current_position)
        current_position = max_cylinder - 1
        path.append(current_position)
        
        # Jump to the beginning
        total_movement += abs(0 - current_position)
        current_position = 0
        path.append(current_position)

    # Service remaining requests from the start
    down_requests = [r for r in requests_copy if r < start_position]
    for req in down_requests:
        path.append(req)
        total_movement += abs(req - current_position)
        current_position = req
        
    return total_movement, path

# Example
requests = [98, 183, 37, 122, 14, 124, 65, 67]
start_pos = 53
movement, path = cscan_disk_scheduling(requests, start_pos)
print(f"Total head movement: {movement}")
print(f"Path: {path}")
`,
  'Java': `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CSCANDiskScheduling {

    public static int calculateTotalMovement(List<Integer> requests, int startPosition, int maxCylinder) {
        int totalMovement = 0;
        int currentPosition = startPosition;
        List<Integer> sortedRequests = new ArrayList<>(requests);
        Collections.sort(sortedRequests);

        // Service requests >= startPosition
        for (int req : sortedRequests) {
            if (req >= currentPosition) {
                totalMovement += Math.abs(req - currentPosition);
                currentPosition = req;
            }
        }

        // Jump to the beginning if necessary
        boolean hasLowerRequests = false;
        for(int req : sortedRequests) {
            if (req < startPosition) {
                hasLowerRequests = true;
                break;
            }
        }
        
        if(hasLowerRequests) {
            totalMovement += Math.abs(maxCylinder - 1 - currentPosition);
            currentPosition = maxCylinder - 1;
            totalMovement += Math.abs(0 - currentPosition);
            currentPosition = 0;
        }

        // Service requests < startPosition
        for (int req : sortedRequests) {
            if (req < startPosition) {
                totalMovement += Math.abs(req - currentPosition);
                currentPosition = req;
            }
        }
        return totalMovement;
    }

    public static void main(String[] args) {
        List<Integer> requests = List.of(98, 183, 37, 122, 14, 124, 65, 67);
        int startPos = 53;
        int movement = calculateTotalMovement(new ArrayList<>(requests), startPos, 200);
        System.out.println("Total head movement: " + movement);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>

int cscanDiskScheduling(std::vector<int> requests, int startPosition, int maxCylinder) {
    int totalMovement = 0;
    int currentPosition = startPosition;
    std::sort(requests.begin(), requests.end());

    for (int req : requests) {
        if (req >= currentPosition) {
            totalMovement += std::abs(req - currentPosition);
            currentPosition = req;
        }
    }

    bool hasLowerRequests = false;
    for(int req : requests) {
        if (req < startPosition) {
            hasLowerRequests = true;
            break;
        }
    }

    if(hasLowerRequests) {
        totalMovement += std::abs(maxCylinder - 1 - currentPosition);
        currentPosition = maxCylinder - 1;
        totalMovement += std::abs(0 - currentPosition);
        currentPosition = 0;
    }

    for (int req : requests) {
        if (req < startPosition) {
            totalMovement += std::abs(req - currentPosition);
            currentPosition = req;
        }
    }
    return totalMovement;
}

int main() {
    std::vector<int> requests = {98, 183, 37, 122, 14, 124, 65, 67};
    int startPos = 53;
    int movement = cscanDiskScheduling(requests, startPos, 200);
    std::cout << "Total head movement: " << movement << std::endl;
    return 0;
}
`
};
