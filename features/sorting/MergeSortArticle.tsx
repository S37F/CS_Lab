
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

const MergeSortArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Merge Sort is a highly efficient, general-purpose, comparison-based sorting algorithm. It operates on the "divide and conquer" principle. Most implementations produce a stable sort, meaning that the implementation preserves the input order of equal elements in the sorted output.</p>
                <p>It's widely used in practice, for example, in the `Array.prototype.sort()` method in some JavaScript engines (like V8 for arrays with more than 10 elements). It is also commonly used for sorting linked lists and for external sorting on large datasets that don't fit into memory.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <p>The Merge Sort algorithm follows three main steps:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Divide:</strong> The unsorted list is divided into n sublists, each containing one element (a list of one element is considered sorted).</li>
                    <li><strong>Conquer:</strong> Sublists are repeatedly merged to produce new sorted sublists until there is only one sublist remaining. This will be the sorted list.</li>
                    <li><strong>Merge:</strong> This is the core step. Two sorted sublists are taken, and they are combined to form a single sorted list. This is done by comparing the first elements of both sublists, picking the smaller one, and adding it to the result list. This is repeated until one of the sublists is empty, at which point the remaining elements of the other sublist are appended.</li>
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
                            <td className="border-b border-border p-2 font-mono">O(n log n)</td>
                            <td rowSpan={3} className="border-b border-border p-2 font-mono align-middle">O(n)</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Average Case</td>
                            <td className="border-b border-border p-2 font-mono">O(n log n)</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Worst Case</td>
                            <td className="border-b border-border p-2 font-mono">O(n log n)</td>
                        </tr>
                    </tbody>
                </table>
                <p>Merge Sort has a consistent time complexity across all cases because it always divides the array into two halves and takes linear time to merge two halves. The main disadvantage is its O(n) space complexity, as it requires an auxiliary array to store the merged elements.</p>
            </Section>
            
            <Section title="Pseudocode Example">
                <CodeBlock>{`function mergeSort(array)
  if length(array) <= 1
    return array

  middle = floor(length(array) / 2)
  left = array[0 to middle]
  right = array[middle to end]

  left = mergeSort(left)
  right = mergeSort(right)
  
  return merge(left, right)

function merge(left, right)
  result = new array
  while left is not empty and right is not empty
    if left[0] <= right[0]
      append left[0] to result
      remove left[0] from left
    else
      append right[0] to result
      remove right[0] from right
  
  append remaining elements of left to result
  append remaining elements of right to result
  return result`}</CodeBlock>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Trace the merge sort algorithm for the array [38, 27, 43, 3, 9, 82, 10]. Show the state of the array after each merge operation.</p>
                    <p><strong>2.</strong> Explain why Merge Sort is a "stable" sort.</p>
                    <p><strong>3.</strong> How would you modify Merge Sort to sort a linked list efficiently without requiring O(n) auxiliary space for the list nodes?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default MergeSortArticle;
