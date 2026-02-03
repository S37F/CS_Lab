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

const SelectionSortArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Selection Sort is an in-place comparison-based algorithm in which the list is divided into two parts, the sorted part at the left end and the unsorted part at the right end. Initially, the sorted part is empty and the unsorted part is the entire list.</p>
                <p>The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, swapping it with the leftmost unsorted element, and moving the sublist boundaries one element to the right. Due to its O(n²) complexity, it is not efficient on large lists but is noted for its simplicity and for having a low number of swaps.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Start with the first element as the current minimum.</li>
                    <li>Iterate through the rest of the unsorted part of the array.</li>
                    <li>If you find an element smaller than the current minimum, update the current minimum.</li>
                    <li>After scanning the entire unsorted part, if the current minimum is not the element you started with, swap them.</li>
                    <li>The first element is now sorted. Move the boundary of the sorted part one position to the right.</li>
                    <li>Repeat the process for the remaining unsorted array until the entire array is sorted.</li>
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
                            <td className="border-b border-border p-2 font-mono">O(n²)</td>
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
                <p>Selection sort has a consistent time complexity of O(n²) because it must always iterate through the remaining unsorted elements to find the minimum. Its main advantage is that it performs at most O(n) swaps, which can be useful if writing to memory is a costly operation.</p>
            </Section>
            
            <Section title="Pseudocode Example">
                <CodeBlock>{`function selectionSort(array)
  n = length(array)
  for i = 0 to n-2
    minIndex = i
    for j = i+1 to n-1
      if array[j] < array[minIndex]
        minIndex = j
      end if
    end for
    swap(array[i], array[minIndex])
  end for
end function`}</CodeBlock>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default SelectionSortArticle;
