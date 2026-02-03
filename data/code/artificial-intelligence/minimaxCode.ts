
export const minimaxCode = {
    'Python': `import math

def minimax(node_index, depth, maximizing_player, scores, tree_depth):
    """
    Finds the optimal value for the current player.
    """
    # Base case: if we are at a leaf node
    if depth == tree_depth:
        return scores[node_index]

    if maximizing_player:
        best_value = -math.inf
        # Recur for left and right children
        for i in range(2):
            value = minimax(node_index * 2 + i, depth + 1, False, scores, tree_depth)
            best_value = max(best_value, value)
        return best_value
    else: # Minimizing player
        best_value = math.inf
        for i in range(2):
            value = minimax(node_index * 2 + i, depth + 1, True, scores, tree_depth)
            best_value = min(best_value, value)
        return best_value

# Example
# A game tree with depth 3 and 8 terminal nodes
# The scores are for the MAX player at the leaves
terminal_scores = [3, 5, 2, 9, 12, 5, 23, 23]
tree_depth = 3 # math.log2(len(terminal_scores))

optimal_value = minimax(0, 0, True, terminal_scores, tree_depth)
print(f"The optimal value for the MAX player is: {optimal_value}")

# --- Alpha-Beta Pruning ---
def alphabeta(node_index, depth, alpha, beta, maximizing_player, scores, tree_depth):
    if depth == tree_depth:
        return scores[node_index]

    if maximizing_player:
        value = -math.inf
        for i in range(2):
            value = max(value, alphabeta(node_index * 2 + i, depth + 1, alpha, beta, False, scores, tree_depth))
            alpha = max(alpha, value)
            if alpha >= beta:
                break # Beta cut-off
        return value
    else:
        value = math.inf
        for i in range(2):
            value = min(value, alphabeta(node_index * 2 + i, depth + 1, alpha, beta, True, scores, tree_depth))
            beta = min(beta, value)
            if alpha >= beta:
                break # Alpha cut-off
        return value

optimal_value_ab = alphabeta(0, 0, -math.inf, math.inf, True, terminal_scores, tree_depth)
print(f"Optimal value with Alpha-Beta Pruning: {optimal_value_ab}")
`,
    'Java': `// Minimax with Alpha-Beta Pruning
public class Minimax {

    public static int minimax(int depth, int nodeIndex, boolean isMaximizingPlayer, 
                              int[] scores, int h, int alpha, int beta) {
        
        if (depth == h) {
            return scores[nodeIndex];
        }

        if (isMaximizingPlayer) {
            int best = Integer.MIN_VALUE;
            for (int i = 0; i < 2; i++) {
                int val = minimax(depth + 1, nodeIndex * 2 + i, false, scores, h, alpha, beta);
                best = Math.max(best, val);
                alpha = Math.max(alpha, best);

                // Alpha Beta Pruning
                if (beta <= alpha)
                    break;
            }
            return best;
        } else {
            int best = Integer.MAX_VALUE;
            for (int i = 0; i < 2; i++) {
                int val = minimax(depth + 1, nodeIndex * 2 + i, true, scores, h, alpha, beta);
                best = Math.min(best, val);
                beta = Math.min(beta, best);

                // Alpha Beta Pruning
                if (beta <= alpha)
                    break;
            }
            return best;
        }
    }

    public static void main(String[] args) {
        int[] scores = {3, 5, 2, 9, 12, 5, 23, 23};
        int h = (int) (Math.log(scores.length) / Math.log(2));
        int result = minimax(0, 0, true, scores, h, Integer.MIN_VALUE, Integer.MAX_VALUE);
        System.out.println("The optimal value is: " + result);
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

int minimax(int depth, int nodeIndex, bool maximizingPlayer, const std::vector<int>& scores, int h, int alpha, int beta) {
    if (depth == h) {
        return scores[nodeIndex];
    }

    if (maximizingPlayer) {
        int best = -1000;
        for (int i = 0; i < 2; ++i) {
            int val = minimax(depth + 1, nodeIndex * 2 + i, false, scores, h, alpha, beta);
            best = std::max(best, val);
            alpha = std::max(alpha, best);

            if (beta <= alpha) break;
        }
        return best;
    } else {
        int best = 1000;
        for (int i = 0; i < 2; ++i) {
            int val = minimax(depth + 1, nodeIndex * 2 + i, true, scores, h, alpha, beta);
            best = std::min(best, val);
            beta = std::min(beta, best);
            
            if (beta <= alpha) break;
        }
        return best;
    }
}

int main() {
    std::vector<int> scores = {3, 5, 2, 9, 12, 5, 23, 23};
    int h = log2(scores.size());
    int result = minimax(0, 0, true, scores, h, -1000, 1000);
    std::cout << "The optimal value is: " << result << std::endl;
    return 0;
}
`
};
