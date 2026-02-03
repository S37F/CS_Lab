
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const DistanceVectorRoutingArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Distance Vector Routing is a class of routing algorithms used in packet-switched networks. It requires that each router maintain a routing table containing information about the distance (or cost/metric) to every other reachable router and which next-hop neighbor to use to get there.</p>
                <p>The goal is for each router to build up a complete picture of the network's topology by periodically exchanging routing tables with its immediate neighbors.</p>
            </Section>

            <Section title="How It Works (Bellman-Ford)">
                <p>The algorithm is an application of the Bellman-Ford algorithm.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Initialization:</strong> Each router knows the distance to its direct neighbors. The distance to all other routers is initialized to infinity.</li>
                    <li><strong>Sharing:</strong> Periodically, each router sends its entire routing table (its current "distance vector") to each of its direct neighbors.</li>
                    <li><strong>Update:</strong> When a router receives a distance vector from a neighbor, it updates its own table. For each destination in the neighbor's table, the router calculates the cost to reach that destination via that neighbor (cost to neighbor + neighbor's cost to destination).</li>
                    <li><strong>Decision:</strong> If this newly calculated path is shorter than the path currently in its own table, the router updates its table with the new, shorter path, listing the neighbor as the next hop.</li>
                    <li><strong>Convergence:</strong> This process repeats. Over time, the routing information propagates through the network, and the tables converge to a stable state where every router knows the shortest path to every other router.</li>
                </ol>
            </Section>

            <Section title="Limitations: The Count-to-Infinity Problem">
                <p>The main drawback of distance vector routing is its slow convergence and the "count-to-infinity" problem. If a link goes down, the "bad news" (an increase in a route's cost) propagates very slowly. Routers might continue to believe there is a valid, albeit longer, path through a neighbor that no longer has a path, leading to routing loops and packets bouncing back and forth until the costs increment up to "infinity".</p>
                <p>Techniques like "split horizon" and "poison reverse" are used to mitigate this problem, but it remains a significant issue compared to faster-converging link-state protocols like OSPF.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default DistanceVectorRoutingArticle;
