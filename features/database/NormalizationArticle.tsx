
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const NormalizationArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Normalization is the process of organizing the attributes and tables of a relational database to minimize data redundancy and improve data integrity. It involves dividing larger tables into smaller, well-structured tables and defining relationships between them.</p>
                <p>The primary goals are to eliminate redundant data (storing the same data in multiple tables) and to avoid data modification issues known as insertion, update, and deletion anomalies.</p>
            </Section>

            <Section title="Normal Forms">
                <p>Normalization is a step-by-step process, with each step corresponding to a "normal form."</p>
                <h3 className="text-xl font-semibold text-text-primary mt-4 mb-2">First Normal Form (1NF)</h3>
                <p>A table is in 1NF if all its attributes are atomic. This means that every cell holds a single, indivisible value, and there are no repeating groups of columns.</p>
                
                <h3 className="text-xl font-semibold text-text-primary mt-4 mb-2">Second Normal Form (2NF)</h3>
                <p>A table is in 2NF if it is in 1NF and every non-primary-key attribute is fully functionally dependent on the entire primary key. This form addresses partial dependencies, where a non-key attribute depends on only part of a composite primary key.</p>

                <h3 className="text-xl font-semibold text-text-primary mt-4 mb-2">Third Normal Form (3NF)</h3>
                <p>A table is in 3NF if it is in 2NF and there are no transitive dependencies. A transitive dependency exists when a non-key attribute depends on another non-key attribute, rather than directly on the primary key.</p>

                 <h3 className="text-xl font-semibold text-text-primary mt-4 mb-2">Boyce-Codd Normal Form (BCNF)</h3>
                <p>BCNF is a stricter version of 3NF. A table is in BCNF if for every non-trivial functional dependency X → Y, X is a superkey. In simpler terms, the determinant of every dependency must be a candidate key.</p>
            </Section>
            
            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Consider a table `(StudentID, CourseID, StudentName, CourseInstructor)`. The primary key is `(StudentID, CourseID)`. FDs are `StudentID → StudentName` and `CourseID → CourseInstructor`. What is the highest normal form of this relation? How would you decompose it to achieve 3NF?</p>
                    <p><strong>2.</strong> Why is BCNF considered stronger than 3NF?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default NormalizationArticle;
