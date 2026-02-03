
export const kMeansCode = {
    'Python': `import random

def euclidean_distance(p1, p2):
    return sum((a - b) ** 2 for a, b in zip(p1, p2)) ** 0.5

def assign_to_clusters(data, centroids):
    clusters = [[] for _ in centroids]
    for i, point in enumerate(data):
        closest_centroid_index = min(range(len(centroids)), 
                                     key=lambda j: euclidean_distance(point, centroids[j]))
        clusters[closest_centroid_index].append(point)
    return clusters

def update_centroids(clusters):
    new_centroids = []
    for cluster in clusters:
        if not cluster: continue
        # Calculate the mean of all points in the cluster
        centroid = [sum(dim) / len(cluster) for dim in zip(*cluster)]
        new_centroids.append(centroid)
    return new_centroids

def k_means(data, k, max_iterations=100):
    # 1. Initialize centroids randomly
    centroids = random.sample(data, k)
    
    for _ in range(max_iterations):
        # 2. Assign points to the closest centroid
        clusters = assign_to_clusters(data, centroids)
        
        # 3. Update centroids to be the mean of their clusters
        new_centroids = update_centroids(clusters)
        
        # 4. Check for convergence
        if new_centroids == centroids:
            break
        centroids = new_centroids
        
    return clusters, centroids

# Example
data_points = [(2, 10), (2, 5), (8, 4), (5, 8), (7, 5), (6, 4), (1, 2), (4, 9)]
k = 3
clusters, centroids = k_means(data_points, k)

print("Final Centroids:", centroids)
for i, cluster in enumerate(clusters):
    print(f"Cluster {i+1}: {cluster}")
`,
    'Java': `import java.util.*;

public class KMeans {

    // Represents a data point
    static class Point {
        double[] features;
        // ... constructor
    }
    
    // Represents a cluster with a centroid
    static class Cluster {
        Point centroid;
        List<Point> points = new ArrayList<>();
        // ...
    }

    public List<Cluster> run(List<Point> data, int k, int maxIterations) {
        // 1. Initialize k clusters with random centroids
        // ...
        
        // Loop for maxIterations or until convergence
            // 2. Clear all cluster point assignments
            // 3. For each data point, find the closest centroid and assign it to that cluster
            // 4. For each cluster, update its centroid to be the mean of all its points
            // 5. Check if centroids have changed. If not, break.
        
        System.out.println("Full K-Means implementation is complex. See Python code.");
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        // ... setup data points ...
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <cmath>
#include <random>
#include <algorithm>

using Point = std::vector<double>;

double euclidean_distance(const Point& p1, const Point& p2) {
    double sum = 0.0;
    for (size_t i = 0; i < p1.size(); ++i) {
        sum += (p1[i] - p2[i]) * (p1[i] - p2[i]);
    }
    return std::sqrt(sum);
}

void k_means(std::vector<Point>& data, int k, int max_iterations) {
    // 1. Initialize centroids
    std::vector<Point> centroids;
    // ... random sampling ...

    for (int i = 0; i < max_iterations; ++i) {
        // 2. Assign points to clusters
        std::vector<std::vector<Point>> clusters(k);
        // ... logic to find closest centroid for each point ...

        // 3. Update centroids
        std::vector<Point> new_centroids;
        // ... logic to calculate mean of each cluster ...

        // 4. Check for convergence
        // ...
    }
    std::cout << "Full K-Means implementation is complex. See Python code." << std::endl;
}

int main() {
    std::vector<Point> data = {{2, 10}, {2, 5}, {8, 4}, {5, 8}, {7, 5}, {6, 4}, {1, 2}, {4, 9}};
    k_means(data, 3, 100);
    return 0;
}
`
};
