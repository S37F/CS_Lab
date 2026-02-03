export const sjfSchedulingCode = {
  'Python': `class Process:
    def __init__(self, pid, arrival_time, burst_time):
        self.pid = pid
        self.arrival_time = arrival_time
        self.burst_time = burst_time
        self.remaining_time = burst_time
        # ... other metrics

def sjf_scheduling(processes, preemptive=False):
    processes.sort(key=lambda p: p.arrival_time)
    n = len(processes)
    completed = 0
    current_time = 0
    total_wt = 0
    total_tat = 0

    while completed != n:
        ready_queue = [p for p in processes if p.arrival_time <= current_time and p.remaining_time > 0]
        
        if not ready_queue:
            current_time += 1
            continue
            
        # Sort ready queue by shortest remaining time
        ready_queue.sort(key=lambda p: p.remaining_time)
        shortest_process = ready_queue[0]

        if preemptive:
            shortest_process.remaining_time -= 1
            current_time += 1
        else: # Non-preemptive
            current_time += shortest_process.remaining_time
            shortest_process.remaining_time = 0
            
        if shortest_process.remaining_time == 0:
            completed += 1
            completion_time = current_time
            shortest_process.turnaround_time = completion_time - shortest_process.arrival_time
            shortest_process.waiting_time = shortest_process.turnaround_time - shortest_process.burst_time
            total_wt += shortest_process.waiting_time
            total_tat += shortest_process.turnaround_time

    avg_wt = total_wt / n
    avg_tat = total_tat / n
    return processes, avg_wt, avg_tat

# Example
procs = [Process(1, 0, 8), Process(2, 1, 4), Process(3, 2, 9), Process(4, 3, 5)]
results, avg_wt, avg_tat = sjf_scheduling(procs, preemptive=True) # For SRTF
# ... print results ...
`,
  'Java': `import java.util.*;

class Process {
    String pid;
    int arrivalTime, burstTime, remainingTime;
    int completionTime, turnaroundTime, waitingTime;
    
    public Process(String pid, int at, int bt) {
        this.pid = pid;
        this.arrivalTime = at;
        this.burstTime = bt;
        this.remainingTime = bt;
    }
}

public class SJF {
    public static void schedule(List<Process> processes, boolean preemptive) {
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));
        int n = processes.size();
        int completed = 0;
        int currentTime = 0;
        // ... implementation is more complex, requiring a loop and management of ready queue
        System.out.println("SJF (SRTF) logic is complex to show statically. Please see simulator.");
    }

    public static void main(String[] args) {
        List<Process> procs = new ArrayList<>();
        procs.add(new Process("P1", 0, 8));
        // ... add others
        schedule(procs, true); // for SRTF
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <algorithm>
// ... include headers

struct Process {
    std::string pid;
    int arrivalTime, burstTime, remainingTime;
    // ... other metrics
};

void sjfSchedule(std::vector<Process>& processes, bool preemptive) {
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b){
        return a.arrivalTime < b.arrivalTime;
    });
    // ... implementation is more complex, requiring a loop and management of ready queue
    std::cout << "SJF (SRTF) logic is complex to show statically. Please see simulator." << std::endl;
}

int main() {
    std::vector<Process> procs = {{"P1", 0, 8, 8}, /* ... */};
    sjfSchedule(procs, true); // For SRTF
    return 0;
}
`
};
