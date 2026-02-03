
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

const BubbleSortArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm gets its name from the way smaller or larger elements "bubble" to the top of the list.</p>
                <p>Due to its simplicity, it's often used as a teaching tool. However, its inefficiency makes it impractical for most real-world scenarios, except for very small datasets or as a building block in more complex algorithms like Timsort (for small runs).</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Start at the beginning of the array.</li>
                    <li>Compare the first element with the second. If the first is greater than the second, swap them.</li>
                    <li>Move to the next pair of elements, compare them, and swap if necessary.</li>
                    <li>Continue this process until the end of the array. After the first pass, the largest element will be at the end.</li>
                    <li>Repeat the process for the remaining n-1 elements. Each pass places the next largest element in its proper place.</li>
                    <li>The algorithm terminates when a full pass through the array completes with no swaps.</li>
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
                <p>The space complexity is O(1) because it's an in-place sorting algorithm; it only requires a single additional memory space for the temporary variable used in swapping.</p>
            </Section>
            
            <Section title="Pseudocode Example">
                <CodeBlock>{`function bubbleSort(array)
  n = length(array)
  repeat
    swapped = false
    for i = 1 to n-1
      if array[i-1] > array[i]
        swap(array[i-1], array[i])
        swapped = true
      end if
    end for
    n = n - 1
  until not swapped
end function`}</CodeBlock>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> How many swaps will be performed to sort the array [5, 1, 4, 2, 8] using Bubble Sort?</p>
                    <p><strong>2.</strong> What is the state of the array [3, 6, 1, 8, 4, 2] after the first complete pass of Bubble Sort?</p>
                    <p><strong>3.</strong> Why is Bubble Sort considered a "stable" sorting algorithm?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default BubbleSortArticle;
