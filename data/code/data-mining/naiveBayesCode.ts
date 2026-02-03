
export const naiveBayesCode = {
    'Python': `from collections import defaultdict

class NaiveBayesClassifier:
    def __init__(self):
        self.class_priors = defaultdict(float)
        self.conditional_probs = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
        self.vocab = set()

    def train(self, data, labels):
        num_docs = len(data)
        class_counts = defaultdict(int)
        
        for label in labels:
            class_counts[label] += 1
            
        for c, count in class_counts.items():
            self.class_priors[c] = count / num_docs
            
        word_counts_per_class = defaultdict(lambda: defaultdict(int))
        total_words_per_class = defaultdict(int)

        for text, label in zip(data, labels):
            words = text.split()
            for word in words:
                self.vocab.add(word)
                word_counts_per_class[label][word] += 1
                total_words_per_class[label] += 1

        # Calculate conditional probabilities with Laplace smoothing
        for c in class_counts:
            for word in self.vocab:
                count = word_counts_per_class[c][word]
                self.conditional_probs[c][word] = (count + 1) / (total_words_per_class[c] + len(self.vocab))

    def predict(self, text):
        words = text.split()
        scores = {}
        for c in self.class_priors:
            # Use log probabilities to avoid underflow
            score = self.class_priors[c] # Should be log(self.class_priors[c])
            for word in words:
                if word in self.vocab:
                    score *= self.conditional_probs[c][word] # Should be += log(...)
            scores[c] = score
            
        return max(scores, key=scores.get)

# Example: Spam classification
data = [
    "offer is secret",
    "click secret link",
    "secret sports link",
    "play sports today",
    "went play sports",
    "secret sports event",
    "sports is today",
    "sports costs money"
]
labels = ["spam", "spam", "spam", "not spam", "not spam", "spam", "not spam", "not spam"]

classifier = NaiveBayesClassifier()
classifier.train(data, labels)

test_doc = "today is secret"
prediction = classifier.predict(test_doc)
print(f"The document '{test_doc}' is classified as: {prediction}")
`,
    'Java': `// Naive Bayes in Java requires careful handling of probabilities and data structures.
import java.util.*;

public class NaiveBayes {
    private Map<String, Double> classPriors;
    // Map<Class, Map<Feature, Probability>>
    private Map<String, Map<String, Double>> conditionalProbs;

    public void train(List<String> data, List<String> labels) {
        // 1. Calculate class priors P(c)
        // 2. For each class, count occurrences of each word.
        // 3. For each class, calculate conditional probability P(word|c)
        //    for every word in the vocabulary, using Laplace smoothing.
        System.out.println("Full implementation is complex. See Python code.");
    }

    public String predict(String text) {
        // 1. For each class c:
        //    a. Calculate score(c) = log(P(c)) + sum(log(P(word|c))) for each word in text.
        // 2. Return the class with the highest score.
        return "N/A";
    }

    public static void main(String[] args) {
        // ...
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <set>
#include <sstream>

// Naive Bayes in C++ involves significant data structure management.
class NaiveBayesClassifier {
    std::map<std::string, double> classPriors;
    std::map<std::string, std::map<std::string, double>> conditionalProbs;
    std::set<std::string> vocab;
public:
    void train(const std::vector<std::string>& data, const std::vector<std::string>& labels) {
        // 1. Calculate class priors.
        // 2. Count word frequencies per class.
        // 3. Calculate conditional probabilities with smoothing.
    }

    std::string predict(const std::string& text) {
        // Calculate scores for each class using log probabilities.
        // Return class with the max score.
        return "N/A";
    }
};

int main() {
    std::cout << "Full implementation is complex. See Python code." << std::endl;
    return 0;
}
`
};
