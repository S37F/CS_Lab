
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

const InsertionSortArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Insertion Sort is a simple, in-place sorting algorithm that builds the final sorted array one item at a time. It iterates through an input array and removes one element per iteration, finds the location it belongs within the sorted part of the array, and inserts it there.</p>
                <p>It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. However, it provides several advantages: simple implementation, efficient for small data sets, adaptive (efficient for data sets that are already substantially sorted), and stable (does not change the relative order of elements with equal keys).</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Consider the first element to be a sorted sub-array of size 1.</li>
                    <li>Pick the next element from the unsorted part (the "key").</li>
                    <li>Compare the key with the elements in the sorted sub-array, moving from right to left.</li>
                    <li>Shift all elements in the sorted sub-array that are greater than the key one position to the right.</li>
                    <li>Insert the key into the newly created gap.</li>
                    <li>Repeat steps 2-5 until the entire array is sorted.</li>
                </ol>
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
                            <td className="border-b border-border p-2 font-mono">O(n)</td>
                            <td rowSpan={3} className="border-b border-border p-2 font-mono align-middle">O(1)</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Average Case</td>
                            <td className="border-b border-border p-2 font-mono">O(n²)</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Worst Case</td>
                            <td className="border-b border-border p-2 font-mono">O(n²)</td>
                        </tr>
                    </tbody>
                </table>
                <p>The best-case scenario occurs when the array is already sorted, resulting in O(n) complexity. The worst-case occurs for a reverse-sorted array. The space complexity is O(1) as it is an in-place sort.</p>
            </Section>
            
            <Section title="Pseudocode Example">
                <CodeBlock>{`function insertionSort(array)
  for i from 1 to length(array) - 1
    key = array[i]
    j = i - 1
    while j >= 0 and array[j] > key
      array[j + 1] = array[j]
      j = j - 1
    end while
    array[j + 1] = key
  end for
end function`}</CodeBlock>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> What is the state of the array [6, 5, 3, 1, 8, 7, 2, 4] after 3 passes of Insertion Sort?</p>
                    <p><strong>2.</strong> Why is Insertion Sort more efficient than Bubble Sort on average, despite both having O(n²) complexity?</p>
                    <p><strong>3.</strong> In what scenario would Insertion Sort perform with O(n) time complexity?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default InsertionSortArticle;
