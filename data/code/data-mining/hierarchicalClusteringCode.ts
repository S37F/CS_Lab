export const hierarchicalClusteringCode = {
    'Python': `import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import pdist, squareform

def hierarchical_clustering(data, method='single', metric='euclidean'):
    """
    Hierarchical Clustering using different linkage methods
    
    data: numpy array of shape (n_samples, n_features)
    method: 'single', 'complete', 'average', 'ward'
    metric: distance metric (e.g., 'euclidean', 'manhattan')
    
    Returns: linkage matrix
    """
    # Compute linkage matrix
    Z = linkage(data, method=method, metric=metric)
    return Z

def distance_matrix(data, metric='euclidean'):
    """Compute pairwise distance matrix"""
    return squareform(pdist(data, metric=metric))

def agglomerative_clustering_manual(data, n_clusters=2, linkage_method='single'):
    """
    Manual implementation of Agglomerative Hierarchical Clustering
    """
    n_samples = len(data)
    
    # Initialize: each point is its own cluster
    clusters = {i: [i] for i in range(n_samples)}
    cluster_centers = {i: data[i] for i in range(n_samples)}
    
    # Compute initial distance matrix
    dist_matrix = distance_matrix(data)
    
    merge_history = []
    
    # Merge until we have the desired number of clusters
    while len(clusters) > n_clusters:
        # Find minimum distance between clusters
        min_dist = float('inf')
        merge_i, merge_j = -1, -1
        
        cluster_ids = list(clusters.keys())
        for i in range(len(cluster_ids)):
            for j in range(i + 1, len(cluster_ids)):
                ci, cj = cluster_ids[i], cluster_ids[j]
                
                # Calculate distance based on linkage method
                if linkage_method == 'single':
                    # Minimum distance between any points
                    d = min(dist_matrix[p1][p2] 
                           for p1 in clusters[ci] 
                           for p2 in clusters[cj])
                elif linkage_method == 'complete':
                    # Maximum distance between any points
                    d = max(dist_matrix[p1][p2] 
                           for p1 in clusters[ci] 
                           for p2 in clusters[cj])
                elif linkage_method == 'average':
                    # Average distance between all points
                    distances = [dist_matrix[p1][p2] 
                                for p1 in clusters[ci] 
                                for p2 in clusters[cj]]
                    d = sum(distances) / len(distances)
                else:
                    d = np.linalg.norm(cluster_centers[ci] - cluster_centers[cj])
                
                if d < min_dist:
                    min_dist = d
                    merge_i, merge_j = ci, cj
        
        # Merge clusters
        clusters[merge_i].extend(clusters[merge_j])
        cluster_centers[merge_i] = np.mean(data[clusters[merge_i]], axis=0)
        del clusters[merge_j]
        del cluster_centers[merge_j]
        
        merge_history.append((merge_i, merge_j, min_dist))
    
    # Assign cluster labels
    labels = np.zeros(n_samples, dtype=int)
    for cluster_id, (label, members) in enumerate(clusters.items()):
        for point_idx in members:
            labels[point_idx] = cluster_id
    
    return labels, clusters, merge_history

# Example usage
data = np.array([
    [1, 2], [1, 4], [1, 0],
    [4, 2], [4, 4], [4, 0],
    [7, 3], [7, 5]
])

print("Data points:")
print(data)

# Using scipy for dendrogram
Z = hierarchical_clustering(data, method='ward')
print("\nLinkage Matrix (Ward method):")
print(Z)

# Manual implementation
labels, clusters, history = agglomerative_clustering_manual(
    data, n_clusters=3, linkage_method='single'
)

print("\nCluster assignments:")
for i, label in enumerate(labels):
    print(f"Point {i} {data[i]}: Cluster {label}")

print("\nFinal clusters:")
for cluster_id, members in clusters.items():
    print(f"Cluster {cluster_id}: {[data[i].tolist() for i in members]}")
`,
    'Java': `import java.util.*;

class Point {
    double[] coordinates;
    
    public Point(double... coords) {
        this.coordinates = coords.clone();
    }
    
    public double euclideanDistance(Point other) {
        double sum = 0;
        for (int i = 0; i < coordinates.length; i++) {
            sum += Math.pow(coordinates[i] - other.coordinates[i], 2);
        }
        return Math.sqrt(sum);
    }
    
    public static Point average(List<Point> points) {
        int dim = points.get(0).coordinates.length;
        double[] avg = new double[dim];
        for (Point p : points) {
            for (int i = 0; i < dim; i++) {
                avg[i] += p.coordinates[i];
            }
        }
        for (int i = 0; i < dim; i++) {
            avg[i] /= points.size();
        }
        return new Point(avg);
    }
    
    @Override
    public String toString() {
        return Arrays.toString(coordinates);
    }
}

class Cluster {
    List<Point> points;
    Point centroid;
    
    public Cluster(Point point) {
        this.points = new ArrayList<>();
        this.points.add(point);
        this.centroid = point;
    }
    
    public void merge(Cluster other) {
        this.points.addAll(other.points);
        this.centroid = Point.average(this.points);
    }
    
    public double singleLinkage(Cluster other) {
        double minDist = Double.MAX_VALUE;
        for (Point p1 : this.points) {
            for (Point p2 : other.points) {
                minDist = Math.min(minDist, p1.euclideanDistance(p2));
            }
        }
        return minDist;
    }
    
    public double completeLinkage(Cluster other) {
        double maxDist = 0;
        for (Point p1 : this.points) {
            for (Point p2 : other.points) {
                maxDist = Math.max(maxDist, p1.euclideanDistance(p2));
            }
        }
        return maxDist;
    }
    
    public double averageLinkage(Cluster other) {
        double sumDist = 0;
        int count = 0;
        for (Point p1 : this.points) {
            for (Point p2 : other.points) {
                sumDist += p1.euclideanDistance(p2);
                count++;
            }
        }
        return sumDist / count;
    }
}

public class HierarchicalClustering {
    
    public static List<Cluster> cluster(List<Point> data, int nClusters, String linkage) {
        // Initialize: each point is its own cluster
        List<Cluster> clusters = new ArrayList<>();
        for (Point p : data) {
            clusters.add(new Cluster(p));
        }
        
        // Merge until we have desired number of clusters
        while (clusters.size() > nClusters) {
            double minDist = Double.MAX_VALUE;
            int mergeI = -1, mergeJ = -1;
            
            // Find closest pair of clusters
            for (int i = 0; i < clusters.size(); i++) {
                for (int j = i + 1; j < clusters.size(); j++) {
                    double dist;
                    
                    switch (linkage) {
                        case "single":
                            dist = clusters.get(i).singleLinkage(clusters.get(j));
                            break;
                        case "complete":
                            dist = clusters.get(i).completeLinkage(clusters.get(j));
                            break;
                        case "average":
                            dist = clusters.get(i).averageLinkage(clusters.get(j));
                            break;
                        default:
                            dist = clusters.get(i).centroid.euclideanDistance(
                                   clusters.get(j).centroid);
                    }
                    
                    if (dist < minDist) {
                        minDist = dist;
                        mergeI = i;
                        mergeJ = j;
                    }
                }
            }
            
            // Merge clusters
            clusters.get(mergeI).merge(clusters.get(mergeJ));
            clusters.remove(mergeJ);
        }
        
        return clusters;
    }
    
    public static void main(String[] args) {
        List<Point> data = Arrays.asList(
            new Point(1, 2), new Point(1, 4), new Point(1, 0),
            new Point(4, 2), new Point(4, 4), new Point(4, 0),
            new Point(7, 3), new Point(7, 5)
        );
        
        List<Cluster> clusters = cluster(data, 3, "single");
        
        System.out.println("Hierarchical Clustering Results:");
        for (int i = 0; i < clusters.size(); i++) {
            System.out.println("Cluster " + i + ":");
            for (Point p : clusters.get(i).points) {
                System.out.println("  " + p);
            }
        }
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <cmath>
#include <limits>
#include <algorithm>

using namespace std;

class Point {
public:
    vector<double> coords;
    
    Point(vector<double> c) : coords(c) {}
    
    double euclideanDistance(const Point& other) const {
        double sum = 0;
        for (size_t i = 0; i < coords.size(); i++) {
            sum += pow(coords[i] - other.coords[i], 2);
        }
        return sqrt(sum);
    }
    
    static Point average(const vector<Point>& points) {
        vector<double> avg(points[0].coords.size(), 0.0);
        for (const auto& p : points) {
            for (size_t i = 0; i < p.coords.size(); i++) {
                avg[i] += p.coords[i];
            }
        }
        for (auto& val : avg) {
            val /= points.size();
        }
        return Point(avg);
    }
    
    void print() const {
        cout << "[";
        for (size_t i = 0; i < coords.size(); i++) {
            cout << coords[i];
            if (i < coords.size() - 1) cout << ", ";
        }
        cout << "]";
    }
};

class Cluster {
public:
    vector<Point> points;
    Point centroid;
    
    Cluster(const Point& p) : centroid(p) {
        points.push_back(p);
    }
    
    void merge(const Cluster& other) {
        points.insert(points.end(), other.points.begin(), other.points.end());
        centroid = Point::average(points);
    }
    
    double singleLinkage(const Cluster& other) const {
        double minDist = numeric_limits<double>::max();
        for (const auto& p1 : points) {
            for (const auto& p2 : other.points) {
                minDist = min(minDist, p1.euclideanDistance(p2));
            }
        }
        return minDist;
    }
    
    double completeLinkage(const Cluster& other) const {
        double maxDist = 0;
        for (const auto& p1 : points) {
            for (const auto& p2 : other.points) {
                maxDist = max(maxDist, p1.euclideanDistance(p2));
            }
        }
        return maxDist;
    }
    
    double averageLinkage(const Cluster& other) const {
        double sumDist = 0;
        int count = 0;
        for (const auto& p1 : points) {
            for (const auto& p2 : other.points) {
                sumDist += p1.euclideanDistance(p2);
                count++;
            }
        }
        return sumDist / count;
    }
};

vector<Cluster> hierarchicalClustering(
        const vector<Point>& data, 
        int nClusters,
        const string& linkage = "single") {
    
    // Initialize: each point is its own cluster
    vector<Cluster> clusters;
    for (const auto& p : data) {
        clusters.push_back(Cluster(p));
    }
    
    // Merge until we have desired number of clusters
    while (clusters.size() > nClusters) {
        double minDist = numeric_limits<double>::max();
        int mergeI = -1, mergeJ = -1;
        
        // Find closest pair of clusters
        for (size_t i = 0; i < clusters.size(); i++) {
            for (size_t j = i + 1; j < clusters.size(); j++) {
                double dist;
                
                if (linkage == "single") {
                    dist = clusters[i].singleLinkage(clusters[j]);
                } else if (linkage == "complete") {
                    dist = clusters[i].completeLinkage(clusters[j]);
                } else if (linkage == "average") {
                    dist = clusters[i].averageLinkage(clusters[j]);
                } else {
                    dist = clusters[i].centroid.euclideanDistance(clusters[j].centroid);
                }
                
                if (dist < minDist) {
                    minDist = dist;
                    mergeI = i;
                    mergeJ = j;
                }
            }
        }
        
        // Merge clusters
        clusters[mergeI].merge(clusters[mergeJ]);
        clusters.erase(clusters.begin() + mergeJ);
    }
    
    return clusters;
}

int main() {
    vector<Point> data = {
        Point({1, 2}), Point({1, 4}), Point({1, 0}),
        Point({4, 2}), Point({4, 4}), Point({4, 0}),
        Point({7, 3}), Point({7, 5})
    };
    
    auto clusters = hierarchicalClustering(data, 3, "single");
    
    cout << "Hierarchical Clustering Results:" << endl;
    for (size_t i = 0; i < clusters.size(); i++) {
        cout << "Cluster " << i << ":" << endl;
        for (const auto& p : clusters[i].points) {
            cout << "  ";
            p.print();
            cout << endl;
        }
    }
    
    return 0;
}
`
};
