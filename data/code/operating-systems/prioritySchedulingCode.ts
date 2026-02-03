export const prioritySchedulingCode = {
  'Python': `class Process:
    def __init__(self, pid, arrival_time, burst_time, priority):
        self.pid = pid
        self.arrival_time = arrival_time
        self.burst_time = burst_time
        self.priority = priority # Lower number = higher priority
        self.remaining_time = burst_time
        # ... other metrics

def priority_scheduling(processes, preemptive=False):
    processes.sort(key=lambda p: p.arrival_time)
    n = len(processes)
    completed = 0
    current_time = 0
    
    while completed < n:
        ready_queue = [p for p in processes if p.arrival_time <= current_time and p.remaining_time > 0]
        
        if not ready_queue:
            current_time += 1
            continue
        
        # Sort by priority
        ready_queue.sort(key=lambda p: p.priority)
        highest_priority_process = ready_queue[0]

        if preemptive:
            highest_priority_process.remaining_time -= 1
            current_time += 1
        else: # Non-preemptive
            current_time += highest_priority_process.remaining_time
            highest_priority_process.remaining_time = 0

        if highest_priority_process.remaining_time == 0:
            completed += 1
            # Calculate metrics
            # ...

    # ... calculate and return average metrics
    return processes

# Example
procs = [
    Process(1, 0, 8, 3), Process(2, 1, 4, 1),
    Process(3, 2, 9, 4), Process(4, 3, 5, 2)
]
results = priority_scheduling(procs, preemptive=True)
# ... print results ...
`,
  'Java': `import java.util.*;

class Process implements Comparable<Process> {
    String pid;
    int arrivalTime, burstTime, priority, remainingTime;
    // ... constructor and other metrics
    
    @Override
    public int compareTo(Process other) {
        return Integer.compare(this.priority, other.priority);
    }
}

public class PriorityScheduling {
    public static void schedule(List<Process> processes, boolean preemptive) {
        // ... logic is complex for a static example
        System.out.println("Priority Scheduling logic is complex. Please see the simulator.");
    }
    public static void main(String[] args) {
        // ... create processes and call schedule
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <algorithm>

struct Process {
    std::string pid;
    int arrivalTime, burstTime, priority, remainingTime;
    // ... other metrics
};

void prioritySchedule(std::vector<Process>& processes, bool preemptive) {
    // ... logic is complex for a static example
    std::cout << "Priority Scheduling logic is complex. Please see the simulator." << std::endl;
}

int main() {
    std::vector<Process> procs = { /* ... initialize processes ... */ };
    prioritySchedule(procs, true);
    return 0;
}
`
};
