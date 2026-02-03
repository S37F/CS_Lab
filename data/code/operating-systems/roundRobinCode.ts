export const roundRobinCode = {
  'Python': `from collections import deque

class Process:
    def __init__(self, pid, arrival_time, burst_time):
        self.pid = pid
        self.arrival_time = arrival_time
        self.burst_time = burst_time
        self.remaining_time = burst_time
        # ... other metrics

def round_robin(processes, time_quantum):
    processes.sort(key=lambda p: p.arrival_time)
    
    ready_queue = deque()
    current_time = 0
    process_index = 0
    completed = 0
    n = len(processes)

    while completed < n:
        # Add processes that have arrived to the ready queue
        while process_index < n and processes[process_index].arrival_time <= current_time:
            ready_queue.append(processes[process_index])
            process_index += 1
            
        if not ready_queue:
            current_time += 1
            continue

        current_process = ready_queue.popleft()
        
        execute_time = min(current_process.remaining_time, time_quantum)
        current_process.remaining_time -= execute_time
        current_time += execute_time

        # Add newly arrived processes during this execution
        while process_index < n and processes[process_index].arrival_time <= current_time:
            ready_queue.append(processes[process_index])
            process_index += 1

        if current_process.remaining_time == 0:
            completed += 1
            # Calculate metrics...
        else:
            ready_queue.append(current_process)
            
    # ... calculate and return average metrics ...
    return processes

# Example
procs = [Process("P1", 0, 10), Process("P2", 1, 5), Process("P3", 2, 8)]
results = round_robin(procs, time_quantum=4)
# ... print results ...
`,
  'Java': `import java.util.*;

class Process {
    String pid;
    int arrivalTime, burstTime, remainingTime;
    // ... other metrics
    public Process(String pid, int at, int bt) { /* ... constructor ... */ }
}

public class RoundRobin {
    public static void schedule(List<Process> processes, int timeQuantum) {
        Queue<Process> readyQueue = new LinkedList<>();
        // ... complex logic similar to Python version
        System.out.println("Round Robin logic is complex for a static example. Please use the simulator.");
    }
    public static void main(String[] args) {
        List<Process> procs = new ArrayList<>();
        procs.add(new Process("P1", 0, 10));
        // ... add others
        schedule(procs, 4);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

struct Process {
    std::string pid;
    int arrivalTime, burstTime, remainingTime;
    // ... other metrics
};

void roundRobinSchedule(std::vector<Process>& processes, int timeQuantum) {
    // ... complex logic similar to Python version
    std::cout << "Round Robin logic is complex for a static example. Please use the simulator." << std::endl;
}

int main() {
    std::vector<Process> procs = {{"P1", 0, 10, 10}, /* ... */};
    roundRobinSchedule(procs, 4);
    return 0;
}
`
};
