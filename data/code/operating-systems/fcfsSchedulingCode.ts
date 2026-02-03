export const fcfsSchedulingCode = {
  'Python': `class Process:
    def __init__(self, pid, arrival_time, burst_time):
        self.pid = pid
        self.arrival_time = arrival_time
        self.burst_time = burst_time
        self.completion_time = 0
        self.turnaround_time = 0
        self.waiting_time = 0

def fcfs_scheduling(processes):
    # Sort processes based on arrival time
    processes.sort(key=lambda p: p.arrival_time)
    
    current_time = 0
    total_waiting_time = 0
    total_turnaround_time = 0
    
    for p in processes:
        # If CPU is idle, move current_time to process arrival time
        if current_time < p.arrival_time:
            current_time = p.arrival_time
            
        p.waiting_time = current_time - p.arrival_time
        p.completion_time = current_time + p.burst_time
        p.turnaround_time = p.completion_time - p.arrival_time
        
        current_time = p.completion_time
        
        total_waiting_time += p.waiting_time
        total_turnaround_time += p.turnaround_time
        
    avg_waiting_time = total_waiting_time / len(processes)
    avg_turnaround_time = total_turnaround_time / len(processes)
    
    return processes, avg_waiting_time, avg_turnaround_time

# Example
processes = [
    Process("P1", 0, 8),
    Process("P2", 1, 4),
    Process("P3", 2, 9),
    Process("P4", 3, 5)
]

results, avg_wt, avg_tat = fcfs_scheduling(processes)

print("PID\\tAT\\tBT\\tCT\\tTAT\\tWT")
for p in results:
    print(f"{p.pid}\\t{p.arrival_time}\\t{p.burst_time}\\t{p.completion_time}\\t{p.turnaround_time}\\t{p.waiting_time}")

print(f"\\nAverage Waiting Time: {avg_wt:.2f}")
print(f"Average Turnaround Time: {avg_tat:.2f}")
`,
  'Java': `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Process {
    String pid;
    int arrivalTime;
    int burstTime;
    int completionTime;
    int turnaroundTime;
    int waitingTime;

    public Process(String pid, int arrivalTime, int burstTime) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
    }
}

public class FCFS {
    public static void schedule(List<Process> processes) {
        // Sort processes by arrival time
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        int currentTime = 0;
        float totalWaitingTime = 0;
        float totalTurnaroundTime = 0;

        for (Process p : processes) {
            if (currentTime < p.arrivalTime) {
                currentTime = p.arrivalTime;
            }
            p.waitingTime = currentTime - p.arrivalTime;
            p.completionTime = currentTime + p.burstTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            
            currentTime = p.completionTime;

            totalWaitingTime += p.waitingTime;
            totalTurnaroundTime += p.turnaroundTime;
        }

        System.out.println("PID\\tAT\\tBT\\tCT\\tTAT\\tWT");
        for (Process p : processes) {
            System.out.println(p.pid + "\\t" + p.arrivalTime + "\\t" + p.burstTime + "\\t" + 
                               p.completionTime + "\\t" + p.turnaroundTime + "\\t" + p.waitingTime);
        }

        System.out.printf("\\nAverage Waiting Time: %.2f\\n", totalWaitingTime / processes.size());
        System.out.printf("Average Turnaround Time: %.2f\\n", totalTurnaroundTime / processes.size());
    }

    public static void main(String[] args) {
        List<Process> processes = new ArrayList<>();
        processes.add(new Process("P1", 0, 8));
        processes.add(new Process("P2", 1, 4));
        processes.add(new Process("P3", 2, 9));
        processes.add(new Process("P4", 3, 5));
        
        schedule(processes);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>

struct Process {
    std::string pid;
    int arrivalTime;
    int burstTime;
    int completionTime;
    int turnaroundTime;
    int waitingTime;
};

void fcfsSchedule(std::vector<Process>& processes) {
    // Sort processes by arrival time
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.arrivalTime < b.arrivalTime;
    });

    int currentTime = 0;
    float totalWaitingTime = 0;
    float totalTurnaroundTime = 0;

    for (auto& p : processes) {
        if (currentTime < p.arrivalTime) {
            currentTime = p.arrivalTime;
        }
        p.waitingTime = currentTime - p.arrivalTime;
        p.completionTime = currentTime + p.burstTime;
        p.turnaroundTime = p.completionTime - p.arrivalTime;
        
        currentTime = p.completionTime;

        totalWaitingTime += p.waitingTime;
        totalTurnaroundTime += p.turnaroundTime;
    }
    
    std::cout << "PID\\tAT\\tBT\\tCT\\tTAT\\tWT" << std::endl;
    for (const auto& p : processes) {
        std::cout << p.pid << "\\t" << p.arrivalTime << "\\t" << p.burstTime << "\\t"
                  << p.completionTime << "\\t" << p.turnaroundTime << "\\t" << p.waitingTime << std::endl;
    }

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "\\nAverage Waiting Time: " << totalWaitingTime / processes.size() << std::endl;
    std::cout << "Average Turnaround Time: " << totalTurnaroundTime / processes.size() << std::endl;
}

int main() {
    std::vector<Process> processes = {
        {"P1", 0, 8},
        {"P2", 1, 4},
        {"P3", 2, 9},
        {"P4", 3, 5}
    };
    
    fcfsSchedule(processes);
    
    return 0;
}
`
};
