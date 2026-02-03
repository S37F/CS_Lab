
export const csmacdCode = {
    'Python': `# CSMA/CD is an event-driven simulation, not a simple function.
# The code below is a conceptual outline of a node's behavior.

import random
import time

class Node:
    def __init__(self, name):
        self.name = name
        self.backoff_attempts = 0

    def transmit(self, medium):
        # 1. Sense the medium (Carrier Sense)
        if medium.is_busy():
            print(f"[{self.name}] Medium is busy, deferring transmission.")
            return

        # 2. Start transmitting
        print(f"[{self.name}] Started transmitting.")
        
        # 3. Collision Detection
        # In a real system, this happens during transmission.
        # We simulate it with a probability.
        if random.random() < 0.5: # 50% chance of collision
            print(f"[{self.name}] Collision detected!")
            self.backoff()
        else:
            print(f"[{self.name}] Transmission successful.")
            self.backoff_attempts = 0

    def backoff(self):
        # 4. Binary Exponential Backoff
        self.backoff_attempts += 1
        max_delay = (2 ** min(self.backoff_attempts, 10)) - 1
        delay = random.randint(0, max_delay) * 51.2 # Slot time in microseconds
        print(f"[{self.name}] Backing off for {delay:.2f} us...")
        # In a real sim, you'd use time.sleep(delay / 1_000_000)

class Medium:
    def is_busy(self):
        # In a real simulation, this would check if other nodes are transmitting
        return random.random() < 0.3 # 30% chance medium is busy

# Conceptual run
medium = Medium()
nodeA = Node("A")
nodeB = Node("B")

nodeA.transmit(medium)
nodeB.transmit(medium)
`,
    'Java': `// CSMA/CD is a distributed algorithm based on events over time.
// A full simulation would require threads and a shared medium state.

import java.util.Random;

public class CSMACD {

    static class Node {
        String name;
        int backoffAttempts = 0;
        Random rand = new Random();

        public Node(String name) { this.name = name; }

        public void transmit(SharedMedium medium) {
            // 1. Carrier Sense
            if (medium.isBusy()) {
                System.out.println("[" + name + "] Medium is busy, deferring.");
                return;
            }

            // 2. Transmit & Collision Detection
            System.out.println("[" + name + "] Started transmitting.");
            if (medium.hasCollision()) {
                System.out.println("[" + name + "] Collision detected!");
                backoff();
            } else {
                System.out.println("[" + name + "] Transmission successful.");
                backoffAttempts = 0;
            }
        }

        private void backoff() {
            // 4. Binary Exponential Backoff
            backoffAttempts++;
            int maxDelay = (int) Math.pow(2, Math.min(backoffAttempts, 10)) - 1;
            int delaySlots = rand.nextInt(maxDelay + 1);
            System.out.println("[" + name + "] Backing off for " + delaySlots + " time slots.");
            // Thread.sleep(delaySlots * SLOT_TIME_MS);
        }
    }

    static class SharedMedium {
        Random rand = new Random();
        public boolean isBusy() { return rand.nextFloat() < 0.3; }
        public boolean hasCollision() { return rand.nextFloat() < 0.5; }
    }

    public static void main(String[] args) {
        SharedMedium medium = new SharedMedium();
        Node nodeA = new Node("A");
        Node nodeB = new Node("B");
        
        nodeA.transmit(medium);
        nodeB.transmit(medium);
    }
}
`,
    'C++': `#include <iostream>
#include <string>
#include <vector>
#include <random>
#include <chrono>
#include <thread>

class SharedMedium {
    std::mt19937 rng;
public:
    SharedMedium() : rng(std::random_device{}()) {}
    bool isBusy() {
        std::uniform_real_distribution<> dist(0.0, 1.0);
        return dist(rng) < 0.3;
    }
    bool hasCollision() {
        std::uniform_real_distribution<> dist(0.0, 1.0);
        return dist(rng) < 0.5;
    }
};

class Node {
    std::string name;
    int backoffAttempts = 0;
    std::mt19937 rng;
public:
    Node(std::string n) : name(n), rng(std::random_device{}()) {}

    void transmit(SharedMedium& medium) {
        if (medium.isBusy()) {
            std::cout << "[" << name << "] Medium busy." << std::endl;
            return;
        }

        std::cout << "[" << name << "] Transmitting..." << std::endl;
        if (medium.hasCollision()) {
            std::cout << "[" << name << "] Collision!" << std::endl;
            backoff();
        } else {
            std::cout << "[" << name << "] Success." << std::endl;
            backoffAttempts = 0;
        }
    }
    
    void backoff() {
        backoffAttempts++;
        int max_k = (1 << std::min(backoffAttempts, 10)) - 1;
        std::uniform_int_distribution<> dist(0, max_k);
        int delaySlots = dist(rng);
        std::cout << "[" << name << "] Backing off for " << delaySlots << " slots." << std::endl;
    }
};

int main() {
    SharedMedium medium;
    Node nodeA("A"), nodeB("B");
    nodeA.transmit(medium);
    nodeB.transmit(medium);
    return 0;
}
`
};
