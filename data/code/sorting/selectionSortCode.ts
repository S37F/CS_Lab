export const selectionSortCode = {
  'Python': `def selection_sort(arr):
    # Traverse through all array elements
    for i in range(len(arr)):
        # Find the minimum element in remaining unsorted array
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
                
        # Swap the found minimum element with the first element
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Example usage:
my_array = [64, 25, 12, 22, 11]
sorted_array = selection_sort(my_array.copy())
print("Sorted array is:", sorted_array)
`,
  'Java': `import java.util.Arrays;

class SelectionSort {
    void sort(int[] arr) {
        int n = arr.length;

        // One by one move boundary of unsorted subarray
        for (int i = 0; i < n - 1; i++) {
            // Find the minimum element in unsorted array
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[min_idx]) {
                    min_idx = j;
                }
            }

            // Swap the found minimum element with the first element
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }

    public static void main(String[] args) {
        SelectionSort ob = new SelectionSort();
        int[] arr = {64, 25, 12, 22, 11};
        ob.sort(arr);
        System.out.println("Sorted array: " + Arrays.toString(arr));
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <algorithm> // For std::swap

void selectionSort(std::vector<int>& arr) {
    int n = arr.size();

    // One by one move boundary of unsorted subarray
    for (int i = 0; i < n - 1; i++) {
        // Find the minimum element in unsorted array
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }

        // Swap the found minimum element with the first element
        std::swap(arr[min_idx], arr[i]);
    }
}

int main() {
    std::vector<int> arr = {64, 25, 12, 22, 11};
    selectionSort(arr);
    std::cout << "Sorted array: ";
    for (int i : arr) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
    return 0;
}
`
};
