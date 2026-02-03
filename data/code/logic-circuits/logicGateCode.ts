
export const logicGateCode = {
  'Python': `def AND(a, b):
    return a and b

def OR(a, b):
    return a or b

def NOT(a):
    return not a

def XOR(a, b):
    return a != b

def NAND(a, b):
    return not (a and b)

def NOR(a, b):
    return not (a or b)

# Example: Simulate a half-adder
def half_adder(a, b):
    """
    A half-adder adds two single binary digits.
    It has two outputs: sum (S) and carry (C).
    """
    s = XOR(a, b)
    c = AND(a, b)
    return s, c

# Inputs (True/False can represent 1/0)
input_a = True
input_b = False

sum_out, carry_out = half_adder(input_a, input_b)

print(f"Half-Adder for {int(input_a)} + {int(input_b)}:")
print(f"Sum = {int(sum_out)}")
print(f"Carry = {int(carry_out)}")
`,
  'Java': `public class LogicGates {

    public static boolean and(boolean a, boolean b) {
        return a && b;
    }

    public static boolean or(boolean a, boolean b) {
        return a || b;
    }

    public static boolean not(boolean a) {
        return !a;
    }

    public static boolean xor(boolean a, boolean b) {
        return a != b;
    }

    public static boolean nand(boolean a, boolean b) {
        return !(a && b);
    }

    public static boolean nor(boolean a, boolean b) {
        return !(a || b);
    }

    // Example: Half-Adder
    public static class HalfAdderResult {
        public boolean sum;
        public boolean carry;
    }

    public static HalfAdderResult halfAdder(boolean a, boolean b) {
        HalfAdderResult result = new HalfAdderResult();
        result.sum = xor(a, b);
        result.carry = and(a, b);
        return result;
    }

    public static void main(String[] args) {
        boolean a = true;
        boolean b = true;

        HalfAdderResult result = halfAdder(a, b);
        System.out.println("Half-Adder for " + (a ? 1 : 0) + " + " + (b ? 1 : 0) + ":");
        System.out.println("Sum = " + (result.sum ? 1 : 0));
        System.out.println("Carry = " + (result.carry ? 1 : 0));
    }
}
`,
  'C++': `#include <iostream>

namespace LogicGates {
    bool AND(bool a, bool b) {
        return a && b;
    }

    bool OR(bool a, bool b) {
        return a || b;
    }

    bool NOT(bool a) {
        return !a;
    }

    bool XOR(bool a, bool b) {
        return a != b;
    }
    
    bool NAND(bool a, bool b) {
        return !(a && b);
    }

    bool NOR(bool a, bool b) {
        return !(a || b);
    }
}

// Example: Half-Adder
struct HalfAdderResult {
    bool sum;
    bool carry;
};

HalfAdderResult half_adder(bool a, bool b) {
    HalfAdderResult result;
    result.sum = LogicGates::XOR(a, b);
    result.carry = LogicGates::AND(a, b);
    return result;
}

int main() {
    bool a = true;
    bool b = true;

    HalfAdderResult result = half_adder(a, b);
    std::cout << "Half-Adder for " << a << " + " << b << ":" << std::endl;
    std::cout << "Sum = " << result.sum << std::endl;
    std::cout << "Carry = " << result.carry << std::endl;

    return 0;
}
`
};
