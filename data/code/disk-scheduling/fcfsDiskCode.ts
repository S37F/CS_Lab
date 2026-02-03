export const fcfsDiskCode = {
  'Python': `def fcfs_disk_scheduling(requests, start_position):
    """
    Calculates the total head movement for FCFS disk scheduling.
    """
    total_movement = 0
    current_position = start_position
    
    print(f"Head starts at {current_position}")
    
    for request in requests:
        movement = abs(request - current_position)
        total_movement += movement
        current_position = request
        print(f"Move from {current_position} to {request} with movement {movement}")
        
    return total_movement

# Example
requests = [98, 183, 37, 122, 14, 124, 65, 67]
start_pos = 53
total_head_movement = fcfs_disk_scheduling(requests, start_pos)
print(f"\\nTotal head movement: {total_head_movement}")
`,
  'Java': `import java.util.List;

public class FCFSDiskScheduling {

    public static int calculateTotalMovement(List<Integer> requests, int startPosition) {
        int totalMovement = 0;
        int currentPosition = startPosition;

        System.out.println("Head starts at " + currentPosition);

        for (int request : requests) {
            int movement = Math.abs(request - currentPosition);
            totalMovement += movement;
            System.out.println("Move from " + currentPosition + " to " + request + " with movement " + movement);
            currentPosition = request;
        }
        return totalMovement;
    }

    public static void main(String[] args) {
        List<Integer> requests = List.of(98, 183, 37, 122, 14, 124, 65, 67);
        int startPos = 53;
        int totalHeadMovement = calculateTotalMovement(requests, startPos);
        System.out.println("\\nTotal head movement: " + totalHeadMovement);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <cmath>

int fcfsDiskScheduling(const std::vector<int>& requests, int startPosition) {
    int totalMovement = 0;
    int currentPosition = startPosition;

    std::cout << "Head starts at " << currentPosition << std::endl;

    for (int request : requests) {
        int movement = std::abs(request - currentPosition);
        totalMovement += movement;
        std::cout << "Move from " << currentPosition << " to " << request << " with movement " << movement << std::endl;
        currentPosition = request;
    }
    return totalMovement;
}

int main() {
    std::vector<int> requests = {98, 183, 37, 122, 14, 124, 65, 67};
    int startPos = 53;
    int totalHeadMovement = fcfsDiskScheduling(requests, startPos);
    std::cout << "\\nTotal head movement: " << totalHeadMovement << std::endl;
    return 0;
}
`
};
