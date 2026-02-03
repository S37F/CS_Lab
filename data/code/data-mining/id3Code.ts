export const id3Code = {
    'Python': `import numpy as np
from collections import Counter
import math

class TreeNode:
    """Node in the decision tree"""
    def __init__(self, attribute=None, threshold=None, label=None):
        self.attribute = attribute  # Feature to split on
        self.threshold = threshold  # For continuous attributes
        self.label = label  # Class label (for leaf nodes)
        self.children = {}  # Dictionary of child nodes

def entropy(labels):
    """Calculate entropy of a label distribution"""
    if len(labels) == 0:
        return 0
    
    counts = Counter(labels)
    total = len(labels)
    ent = 0
    
    for count in counts.values():
        p = count / total
        if p > 0:
            ent -= p * math.log2(p)
    
    return ent

def information_gain(data, labels, attribute):
    """
    Calculate information gain for splitting on an attribute
    data: list of dictionaries (samples)
    labels: list of class labels
    attribute: attribute name to split on
    """
    # Total entropy before split
    total_entropy = entropy(labels)
    
    # Get unique values for this attribute
    values = set(sample[attribute] for sample in data)
    
    # Calculate weighted entropy after split
    weighted_entropy = 0
    total_samples = len(data)
    
    for value in values:
        # Get subset of data with this value
        subset_indices = [i for i, sample in enumerate(data) 
                         if sample[attribute] == value]
        subset_labels = [labels[i] for i in subset_indices]
        
        # Weight by proportion of samples
        weight = len(subset_labels) / total_samples
        weighted_entropy += weight * entropy(subset_labels)
    
    # Information gain
    return total_entropy - weighted_entropy

def majority_class(labels):
    """Return the most common label"""
    return Counter(labels).most_common(1)[0][0]

def id3(data, labels, attributes, parent_labels=None):
    """
    ID3 Decision Tree Algorithm
    
    data: list of dictionaries (samples with features)
    labels: list of class labels
    attributes: list of attribute names available for splitting
    parent_labels: labels of parent node (for handling empty subsets)
    
    Returns: TreeNode (root of decision tree)
    """
    # Base case 1: all labels are the same
    if len(set(labels)) == 1:
        return TreeNode(label=labels[0])
    
    # Base case 2: no more attributes to split on
    if len(attributes) == 0:
        return TreeNode(label=majority_class(labels))
    
    # Base case 3: no data
    if len(data) == 0:
        if parent_labels:
            return TreeNode(label=majority_class(parent_labels))
        return TreeNode(label=None)
    
    # Find best attribute to split on (maximum information gain)
    gains = {attr: information_gain(data, labels, attr) for attr in attributes}
    best_attribute = max(gains, key=gains.get)
    
    # Create decision node
    root = TreeNode(attribute=best_attribute)
    
    # Get unique values for best attribute
    values = set(sample[best_attribute] for sample in data)
    
    # Create subtree for each value
    remaining_attributes = [attr for attr in attributes if attr != best_attribute]
    
    for value in values:
        # Get subset of data with this value
        subset_data = [sample for sample in data 
                      if sample[best_attribute] == value]
        subset_labels = [labels[i] for i, sample in enumerate(data) 
                        if sample[best_attribute] == value]
        
        # Recursively build subtree
        root.children[value] = id3(subset_data, subset_labels, 
                                   remaining_attributes, labels)
    
    return root

def predict(tree, sample):
    """Predict class label for a sample using the decision tree"""
    # Leaf node - return label
    if tree.label is not None:
        return tree.label
    
    # Decision node - follow appropriate branch
    attribute_value = sample.get(tree.attribute)
    
    if attribute_value in tree.children:
        return predict(tree.children[attribute_value], sample)
    else:
        # Value not seen in training - return None or most common label
        return None

def print_tree(node, depth=0, value=None):
    """Print the decision tree"""
    indent = "  " * depth
    
    if node.label is not None:
        # Leaf node
        if value is not None:
            print(f"{indent}[{value}] -> Label: {node.label}")
        else:
            print(f"{indent}Label: {node.label}")
    else:
        # Decision node
        if value is not None:
            print(f"{indent}[{value}] -> Split on: {node.attribute}")
        else:
            print(f"{indent}Split on: {node.attribute}")
        
        for val, child in sorted(node.children.items()):
            print_tree(child, depth + 1, val)

# Example: Play Tennis dataset
data = [
    {'Outlook': 'Sunny', 'Temperature': 'Hot', 'Humidity': 'High', 'Wind': 'Weak'},
    {'Outlook': 'Sunny', 'Temperature': 'Hot', 'Humidity': 'High', 'Wind': 'Strong'},
    {'Outlook': 'Overcast', 'Temperature': 'Hot', 'Humidity': 'High', 'Wind': 'Weak'},
    {'Outlook': 'Rain', 'Temperature': 'Mild', 'Humidity': 'High', 'Wind': 'Weak'},
    {'Outlook': 'Rain', 'Temperature': 'Cool', 'Humidity': 'Normal', 'Wind': 'Weak'},
    {'Outlook': 'Rain', 'Temperature': 'Cool', 'Humidity': 'Normal', 'Wind': 'Strong'},
    {'Outlook': 'Overcast', 'Temperature': 'Cool', 'Humidity': 'Normal', 'Wind': 'Strong'},
    {'Outlook': 'Sunny', 'Temperature': 'Mild', 'Humidity': 'High', 'Wind': 'Weak'},
    {'Outlook': 'Sunny', 'Temperature': 'Cool', 'Humidity': 'Normal', 'Wind': 'Weak'},
    {'Outlook': 'Rain', 'Temperature': 'Mild', 'Humidity': 'Normal', 'Wind': 'Weak'},
    {'Outlook': 'Sunny', 'Temperature': 'Mild', 'Humidity': 'Normal', 'Wind': 'Strong'},
    {'Outlook': 'Overcast', 'Temperature': 'Mild', 'Humidity': 'High', 'Wind': 'Strong'},
    {'Outlook': 'Overcast', 'Temperature': 'Hot', 'Humidity': 'Normal', 'Wind': 'Weak'},
    {'Outlook': 'Rain', 'Temperature': 'Mild', 'Humidity': 'High', 'Wind': 'Strong'},
]

labels = ['No', 'No', 'Yes', 'Yes', 'Yes', 'No', 'Yes', 
          'No', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No']

attributes = ['Outlook', 'Temperature', 'Humidity', 'Wind']

# Build decision tree
tree = id3(data, labels, attributes)

print("ID3 Decision Tree:")
print_tree(tree)

# Test prediction
test_sample = {'Outlook': 'Sunny', 'Temperature': 'Cool', 
               'Humidity': 'High', 'Wind': 'Strong'}
print(f"\nPrediction for {test_sample}:")
print(f"Play Tennis: {predict(tree, test_sample)}")
`,
    'Java': `import java.util.*;

class TreeNode {
    String attribute;
    String label;
    Map<String, TreeNode> children;
    
    public TreeNode(String attribute, String label) {
        this.attribute = attribute;
        this.label = label;
        this.children = new HashMap<>();
    }
}

public class ID3 {
    
    public static double entropy(List<String> labels) {
        if (labels.isEmpty()) return 0;
        
        Map<String, Integer> counts = new HashMap<>();
        for (String label : labels) {
            counts.put(label, counts.getOrDefault(label, 0) + 1);
        }
        
        double ent = 0;
        int total = labels.size();
        
        for (int count : counts.values()) {
            double p = (double) count / total;
            if (p > 0) {
                ent -= p * (Math.log(p) / Math.log(2));
            }
        }
        
        return ent;
    }
    
    public static double informationGain(List<Map<String, String>> data,
                                        List<String> labels,
                                        String attribute) {
        double totalEntropy = entropy(labels);
        
        // Get unique values for attribute
        Set<String> values = new HashSet<>();
        for (Map<String, String> sample : data) {
            values.add(sample.get(attribute));
        }
        
        double weightedEntropy = 0;
        int totalSamples = data.size();
        
        for (String value : values) {
            List<String> subsetLabels = new ArrayList<>();
            
            for (int i = 0; i < data.size(); i++) {
                if (data.get(i).get(attribute).equals(value)) {
                    subsetLabels.add(labels.get(i));
                }
            }
            
            double weight = (double) subsetLabels.size() / totalSamples;
            weightedEntropy += weight * entropy(subsetLabels);
        }
        
        return totalEntropy - weightedEntropy;
    }
    
    public static String majorityClass(List<String> labels) {
        Map<String, Integer> counts = new HashMap<>();
        for (String label : labels) {
            counts.put(label, counts.getOrDefault(label, 0) + 1);
        }
        
        return Collections.max(counts.entrySet(), 
                             Map.Entry.comparingByValue()).getKey();
    }
    
    public static TreeNode buildTree(List<Map<String, String>> data,
                                    List<String> labels,
                                    List<String> attributes) {
        // Base case: all labels same
        if (new HashSet<>(labels).size() == 1) {
            return new TreeNode(null, labels.get(0));
        }
        
        // Base case: no more attributes
        if (attributes.isEmpty()) {
            return new TreeNode(null, majorityClass(labels));
        }
        
        // Find best attribute
        String bestAttr = null;
        double maxGain = -1;
        
        for (String attr : attributes) {
            double gain = informationGain(data, labels, attr);
            if (gain > maxGain) {
                maxGain = gain;
                bestAttr = attr;
            }
        }
        
        TreeNode root = new TreeNode(bestAttr, null);
        
        // Get unique values for best attribute
        Set<String> values = new HashSet<>();
        for (Map<String, String> sample : data) {
            values.add(sample.get(bestAttr));
        }
        
        // Create subtrees
        List<String> remainingAttrs = new ArrayList<>(attributes);
        remainingAttrs.remove(bestAttr);
        
        for (String value : values) {
            List<Map<String, String>> subset = new ArrayList<>();
            List<String> subsetLabels = new ArrayList<>();
            
            for (int i = 0; i < data.size(); i++) {
                if (data.get(i).get(bestAttr).equals(value)) {
                    subset.add(data.get(i));
                    subsetLabels.add(labels.get(i));
                }
            }
            
            root.children.put(value, buildTree(subset, subsetLabels, remainingAttrs));
        }
        
        return root;
    }
    
    public static String predict(TreeNode tree, Map<String, String> sample) {
        if (tree.label != null) {
            return tree.label;
        }
        
        String value = sample.get(tree.attribute);
        if (tree.children.containsKey(value)) {
            return predict(tree.children.get(value), sample);
        }
        
        return "Unknown";
    }
    
    public static void main(String[] args) {
        // Example data setup
        List<Map<String, String>> data = new ArrayList<>();
        List<String> labels = Arrays.asList("No", "No", "Yes", "Yes", "Yes", 
                                           "No", "Yes", "No", "Yes", "Yes", 
                                           "Yes", "Yes", "Yes", "No");
        
        // Add sample data...
        Map<String, String> sample1 = new HashMap<>();
        sample1.put("Outlook", "Sunny");
        sample1.put("Temperature", "Hot");
        sample1.put("Humidity", "High");
        sample1.put("Wind", "Weak");
        data.add(sample1);
        // ... add more samples
        
        List<String> attributes = Arrays.asList("Outlook", "Temperature", 
                                               "Humidity", "Wind");
        
        TreeNode tree = buildTree(data, labels, attributes);
        
        System.out.println("ID3 Decision Tree built successfully");
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <string>
#include <cmath>
#include <algorithm>
#include <memory>

using namespace std;

class TreeNode {
public:
    string attribute;
    string label;
    map<string, shared_ptr<TreeNode>> children;
    
    TreeNode(string attr = "", string lbl = "") 
        : attribute(attr), label(lbl) {}
};

class ID3 {
public:
    static double entropy(const vector<string>& labels) {
        if (labels.empty()) return 0;
        
        map<string, int> counts;
        for (const auto& label : labels) {
            counts[label]++;
        }
        
        double ent = 0;
        int total = labels.size();
        
        for (const auto& [label, count] : counts) {
            double p = (double)count / total;
            if (p > 0) {
                ent -= p * log2(p);
            }
        }
        
        return ent;
    }
    
    static double informationGain(
            const vector<map<string, string>>& data,
            const vector<string>& labels,
            const string& attribute) {
        
        double totalEntropy = entropy(labels);
        
        // Get unique values
        set<string> values;
        for (const auto& sample : data) {
            values.insert(sample.at(attribute));
        }
        
        double weightedEntropy = 0;
        int totalSamples = data.size();
        
        for (const auto& value : values) {
            vector<string> subsetLabels;
            
            for (size_t i = 0; i < data.size(); i++) {
                if (data[i].at(attribute) == value) {
                    subsetLabels.push_back(labels[i]);
                }
            }
            
            double weight = (double)subsetLabels.size() / totalSamples;
            weightedEntropy += weight * entropy(subsetLabels);
        }
        
        return totalEntropy - weightedEntropy;
    }
    
    static string majorityClass(const vector<string>& labels) {
        map<string, int> counts;
        for (const auto& label : labels) {
            counts[label]++;
        }
        
        return max_element(counts.begin(), counts.end(),
                          [](const auto& a, const auto& b) {
                              return a.second < b.second;
                          })->first;
    }
    
    static shared_ptr<TreeNode> buildTree(
            const vector<map<string, string>>& data,
            const vector<string>& labels,
            const vector<string>& attributes) {
        
        // Base case: all labels same
        set<string> uniqueLabels(labels.begin(), labels.end());
        if (uniqueLabels.size() == 1) {
            return make_shared<TreeNode>("", labels[0]);
        }
        
        // Base case: no attributes
        if (attributes.empty()) {
            return make_shared<TreeNode>("", majorityClass(labels));
        }
        
        // Find best attribute
        string bestAttr;
        double maxGain = -1;
        
        for (const auto& attr : attributes) {
            double gain = informationGain(data, labels, attr);
            if (gain > maxGain) {
                maxGain = gain;
                bestAttr = attr;
            }
        }
        
        auto root = make_shared<TreeNode>(bestAttr, "");
        
        // Get unique values
        set<string> values;
        for (const auto& sample : data) {
            values.insert(sample.at(bestAttr));
        }
        
        // Create subtrees
        vector<string> remainingAttrs;
        for (const auto& attr : attributes) {
            if (attr != bestAttr) {
                remainingAttrs.push_back(attr);
            }
        }
        
        for (const auto& value : values) {
            vector<map<string, string>> subset;
            vector<string> subsetLabels;
            
            for (size_t i = 0; i < data.size(); i++) {
                if (data[i].at(bestAttr) == value) {
                    subset.push_back(data[i]);
                    subsetLabels.push_back(labels[i]);
                }
            }
            
            root->children[value] = buildTree(subset, subsetLabels, remainingAttrs);
        }
        
        return root;
    }
    
    static string predict(shared_ptr<TreeNode> tree, 
                         const map<string, string>& sample) {
        if (!tree->label.empty()) {
            return tree->label;
        }
        
        string value = sample.at(tree->attribute);
        if (tree->children.find(value) != tree->children.end()) {
            return predict(tree->children[value], sample);
        }
        
        return "Unknown";
    }
};

int main() {
    vector<map<string, string>> data = {
        {{"Outlook", "Sunny"}, {"Temp", "Hot"}, {"Humidity", "High"}, {"Wind", "Weak"}},
        {{"Outlook", "Sunny"}, {"Temp", "Hot"}, {"Humidity", "High"}, {"Wind", "Strong"}},
        {{"Outlook", "Overcast"}, {"Temp", "Hot"}, {"Humidity", "High"}, {"Wind", "Weak"}},
        // ... more samples
    };
    
    vector<string> labels = {"No", "No", "Yes"};
    vector<string> attributes = {"Outlook", "Temp", "Humidity", "Wind"};
    
    auto tree = ID3::buildTree(data, labels, attributes);
    
    cout << "ID3 Decision Tree built successfully" << endl;
    
    return 0;
}
`
};
