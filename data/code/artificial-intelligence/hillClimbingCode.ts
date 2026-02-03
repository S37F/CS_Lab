export const hillClimbingCode = {
    'Python': `def hill_climbing(problem):
    current = problem.initial_state
    while True:
        neighbor = highest_valued_neighbor(current)
        if neighbor.value <= current.value:
            return current
        current = neighbor`,
    'JavaScript': `function hillClimbing(problem) {
    let current = problem.initialState;
    while (true) {
        let neighbor = getHighestValuedNeighbor(current);
        if (neighbor.value <= current.value) {
            return current;
        }
        current = neighbor;
    }
}`
};
