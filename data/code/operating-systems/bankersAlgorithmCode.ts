export const bankersAlgorithmCode = {
  'Python': `def is_safe_state(processes, available, allocation, need):
    num_processes = len(processes)
    num_resources = len(available)
    
    work = list(available)
    finish = [False] * num_processes
    safe_sequence = []
    
    count = 0
    while count < num_processes:
        found = False
        for p in range(num_processes):
            if not finish[p]:
                # Check if need <= work for all resources
                if all(need[p][j] <= work[j] for j in range(num_resources)):
                    # Execute process
                    for j in range(num_resources):
                        work[j] += allocation[p][j]
                    
                    safe_sequence.append(p)
                    finish[p] = True
                    found = True
                    count += 1
        
        if not found:
            # If no process can be allocated, system is not in a safe state
            return False, []
            
    return True, safe_sequence

# Example
processes = [0, 1, 2, 3, 4]
available = [3, 3, 2]
allocation = [
    [0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]
]
max_claim = [
    [7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]
]
need = [
    [max_claim[i][j] - allocation[i][j] for j in range(len(available))]
    for i in range(len(processes))
]

is_safe, sequence = is_safe_state(processes, available, allocation, need)

if is_safe:
    print("System is in a safe state.")
    print("Safe sequence:", [f"P{i}" for i in sequence])
else:
    print("System is in an unsafe state.")
`,
  'Java': `import java.util.Arrays;

public class BankersAlgorithm {

    static boolean isSafe(int processes[], int available[], int max[][], int allocation[][]) {
        int n = processes.length;
        int r = available.length;
        int[][] need = new int[n][r];

        // Calculate need matrix
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < r; j++) {
                need[i][j] = max[i][j] - allocation[i][j];
            }
        }

        boolean[] finish = new boolean[n];
        int[] safeSequence = new int[n];
        int[] work = Arrays.copyOf(available, r);
        
        int count = 0;
        while (count < n) {
            boolean found = false;
            for (int p = 0; p < n; p++) {
                if (!finish[p]) {
                    int j;
                    for (j = 0; j < r; j++) {
                        if (need[p][j] > work[j]) break;
                    }

                    if (j == r) { // If all needs are satisfied
                        for (int k = 0; k < r; k++) {
                            work[k] += allocation[p][k];
                        }
                        safeSequence[count++] = p;
                        finish[p] = true;
                        found = true;
                    }
                }
            }
            if (!found) {
                System.out.println("System is not in a safe state.");
                return false;
            }
        }

        System.out.println("System is in a safe state.");
        System.out.print("Safe sequence is: ");
        for (int i = 0; i < n; i++) System.out.print("P" + safeSequence[i] + " ");
        System.out.println();
        return true;
    }

    public static void main(String[] args) {
        int[] processes = {0, 1, 2, 3, 4};
        int[] available = {3, 3, 2};
        int[][] max = {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}};
        int[][] allocation = {{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}};
        isSafe(processes, available, max, allocation);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>

using namespace std;

bool isSafeState(int n, int m, const vector<int>& available, const vector<vector<int>>& max, const vector<vector<int>>& allocation) {
    vector<vector<int>> need(n, vector<int>(m));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }

    vector<bool> finish(n, false);
    vector<int> safeSequence;
    vector<int> work = available;

    int count = 0;
    while (count < n) {
        bool found = false;
        for (int p = 0; p < n; p++) {
            if (!finish[p]) {
                int j;
                for (j = 0; j < m; j++) {
                    if (need[p][j] > work[j]) break;
                }

                if (j == m) {
                    for (int k = 0; k < m; k++) {
                        work[k] += allocation[p][k];
                    }
                    safeSequence.push_back(p);
                    finish[p] = true;
                    found = true;
                    count++;
                }
            }
        }
        if (!found) {
            cout << "System is not in a safe state." << endl;
            return false;
        }
    }

    cout << "System is in a safe state." << endl;
    cout << "Safe sequence is: ";
    for (int i = 0; i < n; i++) cout << "P" << safeSequence[i] << " ";
    cout << endl;
    return true;
}

int main() {
    int n = 5; // Number of processes
    int m = 3; // Number of resources
    vector<int> available = {3, 3, 2};
    vector<vector<int>> max = {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}};
    vector<vector<int>> allocation = {{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}};

    isSafeState(n, m, available, max, allocation);

    return 0;
}
`
};
