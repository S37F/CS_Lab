
import React from 'react';
import Card from '../../components/ui/Card';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-background-elevated p-4 rounded-md my-4 overflow-x-auto">
    <code className="font-mono text-sm text-text-secondary">{children}</code>
  </pre>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const QuickSortArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Quick Sort is an in-place, divide-and-conquer sorting algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.</p>
                <p>It is one of the most widely used sorting algorithms due to its average-case time complexity of O(n log n). It is often faster in practice than other O(n log n) algorithms like Merge Sort, primarily due to its in-place nature which leads to better cache performance.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <p>The core of Quick Sort is the partitioning scheme. A common one is the Lomuto partition scheme:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Select a Pivot:</strong> Choose an element from the array. The last element is often chosen for simplicity.</li>
                    <li><strong>Partitioning:</strong> Reorder the array so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it. After this partitioning, the pivot is in its final sorted position.</li>
                    <li><strong>Recurse:</strong> Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.</li>
                </ol>
                <p>The base case for the recursion is a sub-array of size zero or one, which is already sorted.</p>
            </Section>

            <Section title="Time & Space Complexity Analysis">
                 <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b border-border p-2 font-semibold">Case</th>
                            <th className="border-b border-border p-2 font-semibold">Time Complexity</th>
                            <th className="border-b border-border p-2 font-semibold">Space Complexity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-b border-border p-2">Best Case</td>
                            <td className="border-b border-border p-2 font-mono">O(n log n)</td>
                            <td rowSpan={2} className="border-b border-border p-2 font-mono align-middle">O(log n)</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Average Case</td>
                            <td className="border-b border-border p-2 font-mono">O(n log n)</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Worst Case</td>
                            <td className="border-b border-border p-2 font-mono">O(n²)</td>
                            <td className="border-b border-border p-2 font-mono align-middle">O(n)</td>
                        </tr>
                    </tbody>
                </table>
                <p>The worst-case O(n²) time complexity occurs when the pivot selection is poor (e.g., consistently picking the smallest or largest element) in an already sorted or reverse-sorted array. This leads to unbalanced partitions. The space complexity is related to the depth of the recursion stack.</p>
            </Section>
            
            <Section title="Pseudocode Example (Lomuto Partition)">
                <CodeBlock>{`function quickSort(array, low, high)
  if low < high
    pi = partition(array, low, high)
    quickSort(array, low, pi - 1)
    quickSort(array, pi + 1, high)

function partition(array, low, high)
  pivot = array[high]
  i = low - 1
  for j = low to high - 1
    if array[j] < pivot
      i++
      swap(array[i], array[j])
  swap(array[i + 1], array[high])
  return i + 1`}</CodeBlock>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Using the last element as the pivot, what is the state of the array [7, 2, 1, 6, 8, 5, 3, 4] after the first partitioning operation?</p>
                    <p><strong>2.</strong> Describe a pivot selection strategy that can help avoid the worst-case scenario for Quick Sort.</p>
                    <p><strong>3.</strong> Why is Quick Sort generally not a "stable" sort?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default QuickSortArticle;
