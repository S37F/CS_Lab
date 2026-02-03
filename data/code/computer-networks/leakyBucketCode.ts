
export const leakyBucketCode = {
    'Python': `import time

class LeakyBucket:
    def __init__(self, capacity, output_rate):
        self.capacity = capacity  # Max bucket size
        self.output_rate = output_rate  # Packets per second
        self.current_size = 0
        self.last_leak_time = time.time()

    def _leak(self):
        now = time.time()
        time_passed = now - self.last_leak_time
        leaked_packets = time_passed * self.output_rate
        self.current_size = max(0, self.current_size - leaked_packets)
        self.last_leak_time = now

    def add_packet(self, packet_size):
        self._leak() # Let packets leak before adding a new one
        if self.current_size + packet_size <= self.capacity:
            self.current_size += packet_size
            print(f"Packet of size {packet_size} added. Bucket size: {self.current_size:.2f}")
            return True
        else:
            print(f"Packet of size {packet_size} dropped. Bucket full.")
            return False

# Example
bucket = LeakyBucket(capacity=100, output_rate=10) # 100 units capacity, leaks 10 units/sec

bucket.add_packet(50)
time.sleep(1) # Wait 1 second
bucket.add_packet(30)
time.sleep(2) # Wait 2 seconds
bucket.add_packet(80) # This might get dropped if bucket is still too full
`,
    'Java': `public class LeakyBucket {
    private final int capacity;
    private final int outputRate; // units per second
    private double currentSize;
    private long lastLeakTime;

    public LeakyBucket(int capacity, int outputRate) {
        this.capacity = capacity;
        this.outputRate = outputRate;
        this.currentSize = 0;
        this.lastLeakTime = System.currentTimeMillis();
    }

    private synchronized void leak() {
        long now = System.currentTimeMillis();
        long timePassedMs = now - lastLeakTime;
        double leakedAmount = (timePassedMs / 1000.0) * outputRate;
        currentSize = Math.max(0, currentSize - leakedAmount);
        lastLeakTime = now;
    }

    public synchronized boolean addPacket(int packetSize) {
        leak();
        if (currentSize + packetSize <= capacity) {
            currentSize += packetSize;
            System.out.printf("Packet of size %d added. Bucket size: %.2f\\n", packetSize, currentSize);
            return true;
        } else {
            System.out.printf("Packet of size %d dropped. Bucket full.\\n", packetSize);
            return false;
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        LeakyBucket bucket = new LeakyBucket(100, 10);
        bucket.addPacket(50);
        Thread.sleep(1000); // 1 sec
        bucket.addPacket(30);
        Thread.sleep(2000); // 2 sec
        bucket.addPacket(80);
    }
}
`,
    'C++': `#include <iostream>
#include <chrono>
#include <thread>
#include <algorithm>

class LeakyBucket {
    int capacity;
    int outputRate; // units per second
    double currentSize;
    std::chrono::steady_clock::time_point lastLeakTime;

public:
    LeakyBucket(int cap, int rate) : capacity(cap), outputRate(rate), currentSize(0) {
        lastLeakTime = std::chrono::steady_clock::now();
    }

    void leak() {
        auto now = std::chrono::steady_clock::now();
        std::chrono::duration<double> timePassed = now - lastLeakTime;
        double leakedAmount = timePassed.count() * outputRate;
        currentSize = std::max(0.0, currentSize - leakedAmount);
        lastLeakTime = now;
    }

    bool addPacket(int packetSize) {
        leak();
        if (currentSize + packetSize <= capacity) {
            currentSize += packetSize;
            std::cout << "Packet of size " << packetSize << " added. Bucket size: " << currentSize << std::endl;
            return true;
        } else {
            std::cout << "Packet of size " << packetSize << " dropped. Bucket full." << std::endl;
            return false;
        }
    }
};

int main() {
    LeakyBucket bucket(100, 10); // 100 units capacity, 10 units/sec rate
    
    bucket.addPacket(50);
    std::this_thread::sleep_for(std::chrono::seconds(1));
    bucket.addPacket(30);
    std::this_thread::sleep_for(std::chrono::seconds(2));
    bucket.addPacket(80);

    return 0;
}
`
};
