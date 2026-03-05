// ==========================================================================
// Joule Playground — WASM Edition
// Pixel-perfect replica of joule-lang.org HolodeckPlayground
// ==========================================================================

import init, { compileToC, compileToWasm, analyzeEnergy, getVersion } from './pkg/joule_playground_wasm.js';

(function () {
    "use strict";

    // ---------- Examples (matching playgroundExamples.ts from joule-lang.org) ----------

    const EXAMPLES = {
        helloWorld: {
            name: "Hello World",
            code: `// Hello World - The classic first program
fn main() {
    println("Hello, World!");
    println("Welcome to Joule - the energy-aware language");
}
`
        },
        variables: {
            name: "Variables",
            code: `// Variables in Joule
fn main() {
    // Immutable by default
    let x = 42;
    let pi = 3.14159;
    let active = true;

    // Mutable with 'mut'
    let mut counter = 0;
    counter = counter + 1;
    counter = counter + 1;
    counter = counter + 1;

    // Type annotations
    let explicit: i32 = 100;
    let big: i64 = 9999999;
    let precise: f64 = 2.718281828;

    if counter == 3 {
        println("Counter is 3");
    }
    if active {
        println("Active is true");
    }
    println("Variables work!");
}
`
        },
        comments: {
            name: "Comments",
            code: `// Single-line comments start with //

// You can comment above functions to document them
// This function is the entry point of every Joule program
fn main() {
    // Comments can go anywhere
    let x = 10; // Even at the end of a line

    // Use comments to explain your logic
    // Step 1: Check if x is positive
    if x > 0 {
        println("x is positive");
    }

    // Step 2: Compute a value
    let y = x * 2 + 5;

    // Comments help others understand your code
    println("Comments make code readable!");
}
`
        },
        primitives: {
            name: "Primitives",
            code: `// Primitive data types in Joule
fn main() {
    // Integers (signed)
    let small: i32 = 42;
    let big: i64 = 9223372036854775;

    // Floating point
    let pi: f64 = 3.14159265358979;
    let e: f64 = 2.71828182845904;

    // Boolean
    let flag: bool = true;
    let done: bool = false;

    // Arithmetic operations
    let sum = 10 + 20;
    let diff = 50 - 15;
    let product = 6 * 7;
    let quotient = 100 / 3;
    let remainder = 17 % 5;

    if flag {
        println("Boolean flag is true");
    }
    if remainder == 2 {
        println("17 mod 5 is 2");
    }
    if product == 42 {
        println("6 * 7 = 42 - the answer to everything");
    }
    println("All primitive types work!");
}
`
        },
        strings: {
            name: "Strings",
            code: `// Strings in Joule
fn main() {
    // String literals
    println("Hello, World!");
    println("Joule is energy-aware");
    println("Strings support special chars:");
    println("  Tabs and indentation work");
    println("  Multiple lines via multiple println calls");

    // Strings in conditions
    let language = "Joule";

    // String-based program flow
    println("---");
    println("Language: Joule");
    println("Version: 1.0.0");
    println("Focus: Energy-efficient computing");
    println("---");
}
`
        },
        arithmetic: {
            name: "Arithmetic",
            code: `// Arithmetic in Joule
fn main() {
    // Basic operations
    let a = 15;
    let b = 4;

    let sum = a + b;
    let diff = a - b;
    let product = a * b;
    let quotient = a / b;
    let remainder = a % b;

    // Verify results
    if sum == 19 {
        println("15 + 4 = 19");
    }
    if diff == 11 {
        println("15 - 4 = 11");
    }
    if product == 60 {
        println("15 * 4 = 60");
    }
    if quotient == 3 {
        println("15 / 4 = 3 (integer division)");
    }
    if remainder == 3 {
        println("15 % 4 = 3 (remainder)");
    }

    // Compound expressions
    let complex = (a + b) * (a - b);
    if complex == 209 {
        println("(15+4) * (15-4) = 209");
    }

    // Negative numbers
    let neg = -10;
    let pos = neg + 25;
    if pos == 15 {
        println("-10 + 25 = 15");
    }
}
`
        },
        conditionals: {
            name: "If/Else",
            code: `// Conditional expressions in Joule
fn main() {
    let temperature = 72;

    // Basic if/else
    if temperature > 90 {
        println("It's hot!");
    } else if temperature > 70 {
        println("It's warm and pleasant");
    } else if temperature > 50 {
        println("It's cool");
    } else {
        println("It's cold!");
    }

    // Nested conditions
    let hour = 14;
    let is_weekend = false;

    if is_weekend {
        println("Enjoy your weekend!");
    } else {
        if hour < 12 {
            println("Good morning, time to work");
        } else if hour < 17 {
            println("Good afternoon, keep going");
        } else {
            println("Evening - time to rest");
        }
    }

    // Boolean logic
    let x = 42;
    let in_range = x >= 10 && x <= 100;
    let is_even = x % 2 == 0;
    let is_special = in_range && is_even;

    if is_special {
        println("42 is in range and even - special!");
    }
}
`
        },
        loops: {
            name: "Loops",
            code: `// Loops in Joule
fn main() {
    // For loop with range
    println("Counting 1 to 5:");
    for i in 0..5 {
        println("  step...");
    }
    println("Done counting!");

    // While loop - countdown
    println("Countdown:");
    let mut countdown = 5;
    while countdown > 0 {
        println("  tick...");
        countdown = countdown - 1;
    }
    println("Liftoff!");

    // Accumulator pattern
    let mut sum = 0;
    for i in 0..10 {
        sum = sum + i;
    }
    if sum == 45 {
        println("Sum of 0..10 = 45");
    }

    // While with break
    let mut i = 0;
    while true {
        if i >= 7 {
            break;
        }
        i = i + 1;
    }
    if i == 7 {
        println("Broke out of loop at 7");
    }

    // Nested loops
    let mut pairs = 0;
    for x in 0..4 {
        for y in 0..4 {
            pairs = pairs + 1;
        }
    }
    if pairs == 16 {
        println("4x4 grid = 16 pairs");
    }
}
`
        },
        matchExpr: {
            name: "Match Expression",
            code: `// Match expressions in Joule
fn main() {
    // Basic match on integers
    let day = 3;
    match day {
        1 => println("Monday"),
        2 => println("Tuesday"),
        3 => println("Wednesday"),
        4 => println("Thursday"),
        5 => println("Friday"),
        6 => println("Saturday"),
        7 => println("Sunday"),
        _ => println("Invalid day"),
    }

    // Match with wildcard
    let score = 85;
    let grade = score / 10;
    match grade {
        10 => println("Perfect score!"),
        9 => println("Grade: A"),
        8 => println("Grade: B"),
        7 => println("Grade: C"),
        6 => println("Grade: D"),
        _ => println("Grade: F"),
    }

    // Multiple matches in a loop
    for i in 0..6 {
        match i {
            0 => println("zero"),
            1 => println("one"),
            2 => println("two"),
            _ => println("many"),
        }
    }
}
`
        },
        basicFunctions: {
            name: "Functions",
            code: `// Functions in Joule
fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

fn square(x: i32) -> i32 {
    return x * x;
}

fn is_even(n: i32) -> bool {
    return n % 2 == 0;
}

fn abs(n: i32) -> i32 {
    if n < 0 {
        return 0 - n;
    }
    return n;
}

fn max(a: i32, b: i32) -> i32 {
    if a > b {
        return a;
    }
    return b;
}

fn main() {
    add(15, 27);
    square(8);
    abs(-42);
    max(10, 20);

    println("Functions defined and called!");
    println("  add(15, 27) -> i32");
    println("  square(8) -> i32");
    println("  is_even(n) -> bool");
    println("  abs(-42) -> i32");
    println("  max(10, 20) -> i32");
}
`
        },
        returnValues: {
            name: "Return Values",
            code: `// Functions with return values
fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

fn multiply(a: i32, b: i32) -> i32 {
    return a * b;
}

fn max(a: i32, b: i32) -> i32 {
    if a > b {
        return a;
    }
    return b;
}

fn main() {
    add(15, 27);
    multiply(6, 7);
    max(10, 20);

    println("Functions with return values defined!");
    println("  fn add(a, b) -> i32");
    println("  fn multiply(a, b) -> i32");
    println("  fn max(a, b) -> i32");
    println("Return types enforce correctness at compile time");
}
`
        },
        fibonacci: {
            name: "Fibonacci",
            code: `// Fibonacci sequence (iterative)
fn main() {
    let mut a = 0;
    let mut b = 1;

    println("Fibonacci sequence:");
    for i in 0..15 {
        if a == 0 { println("  0"); }
        if a == 1 && b == 1 { println("  1"); }
        if a == 1 && b == 2 { println("  1"); }

        let next = a + b;
        a = b;
        b = next;
    }

    if a == 610 {
        println("fib(15) = 610");
    }
    if b == 987 {
        println("fib(16) = 987");
    }

    println("Fibonacci computed successfully!");
}
`
        },
        factorial: {
            name: "Factorial",
            code: `// Factorial (iterative)
fn main() {
    println("Factorials:");

    // 5! = 120
    let mut result = 1;
    for i in 1..6 {
        result = result * i;
    }
    if result == 120 {
        println("  5! = 120");
    }

    // 10! = 3628800
    result = 1;
    for i in 1..11 {
        result = result * i;
    }
    if result == 3628800 {
        println("  10! = 3,628,800");
    }

    // 12! = 479001600
    result = 1;
    for i in 1..13 {
        result = result * i;
    }
    if result == 479001600 {
        println("  12! = 479,001,600");
    }

    println("Factorials computed!");
}
`
        },
        primes: {
            name: "Prime Sieve",
            code: `// Prime number detection
fn is_prime(n: i32) -> bool {
    if n < 2 {
        return false;
    }
    if n == 2 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }
    let mut i = 3;
    while i * i <= n {
        if n % i == 0 {
            return false;
        }
        i = i + 2;
    }
    return true;
}

fn main() {
    println("Prime numbers up to 50:");
    for n in 2..50 {
        if n == 2 { println("  2"); }
        if n == 3 { println("  3"); }
        if n == 5 { println("  5"); }
        if n == 7 { println("  7"); }
        if n == 11 { println("  11"); }
        if n == 13 { println("  13"); }
        if n == 17 { println("  17"); }
        if n == 19 { println("  19"); }
        if n == 23 { println("  23"); }
        if n == 29 { println("  29"); }
        if n == 31 { println("  31"); }
        if n == 37 { println("  37"); }
        if n == 41 { println("  41"); }
        if n == 43 { println("  43"); }
        if n == 47 { println("  47"); }
    }

    let mut count = 0;
    let mut n = 2;
    while n < 100 {
        let mut is_p = true;
        let mut d = 2;
        while d * d <= n {
            if n % d == 0 {
                is_p = false;
            }
            d = d + 1;
        }
        if is_p {
            count = count + 1;
        }
        n = n + 1;
    }
    if count == 25 {
        println("There are 25 primes under 100");
    }
}
`
        },
        basicStruct: {
            name: "Structs",
            code: `// Structs in Joule
struct Point {
    x: i32,
    y: i32,
}

struct Color {
    r: i32,
    g: i32,
    b: i32,
}

struct Config {
    width: i32,
    height: i32,
    fullscreen: bool,
}

fn main() {
    let origin = Point { x: 0, y: 0 };
    let target = Point { x: 10, y: 20 };

    let red = Color { r: 255, g: 0, b: 0 };
    let joule_gold = Color { r: 251, g: 191, b: 36 };

    let settings = Config {
        width: 1920,
        height: 1080,
        fullscreen: true,
    };

    println("Structs created successfully!");

    if settings.fullscreen {
        println("Running in fullscreen mode");
    }

    if joule_gold.r == 251 {
        println("Joule gold: RGB(251, 191, 36)");
    }

    println("Structs work in Joule!");
}
`
        },
        enums: {
            name: "Enums",
            code: `// Enums in Joule - algebraic data types
enum Direction {
    North,
    South,
    East,
    West,
}

enum Season {
    Spring,
    Summer,
    Autumn,
    Winter,
}

enum Priority {
    Low,
    Medium,
    High,
    Critical,
}

fn main() {
    let heading = Direction::North;
    let current = Season::Winter;
    let alert = Priority::High;

    println("Enums created!");

    match heading {
        Direction::North => println("Heading North"),
        Direction::South => println("Heading South"),
        Direction::East => println("Heading East"),
        Direction::West => println("Heading West"),
    }

    match current {
        Season::Spring => println("Flowers blooming"),
        Season::Summer => println("Sun shining"),
        Season::Autumn => println("Leaves falling"),
        Season::Winter => println("Snow falling"),
    }

    println("Enums + match = powerful pattern matching!");
}
`
        },
        sorting: {
            name: "Bubble Sort",
            code: `// Bubble sort algorithm
fn main() {
    let mut a0 = 64;
    let mut a1 = 34;
    let mut a2 = 25;
    let mut a3 = 12;
    let mut a4 = 22;
    let mut a5 = 11;
    let mut a6 = 90;

    println("Before sorting:");
    println("  64 34 25 12 22 11 90");

    for pass in 0..7 {
        if a0 > a1 { let tmp = a0; a0 = a1; a1 = tmp; }
        if a1 > a2 { let tmp = a1; a1 = a2; a2 = tmp; }
        if a2 > a3 { let tmp = a2; a2 = a3; a3 = tmp; }
        if a3 > a4 { let tmp = a3; a3 = a4; a4 = tmp; }
        if a4 > a5 { let tmp = a4; a4 = a5; a5 = tmp; }
        if a5 > a6 { let tmp = a5; a5 = a6; a6 = tmp; }
    }

    println("After sorting:");
    if a0 == 11 && a1 == 12 && a2 == 22 && a3 == 25 {
        println("  11 12 22 25 ...");
    }
    if a4 == 34 && a5 == 64 && a6 == 90 {
        println("  ... 34 64 90");
    }
    println("Sorted!");
}
`
        },
        searching: {
            name: "Binary Search",
            code: `// Binary search algorithm
fn main() {
    let target = 23;
    let mut low = 0;
    let mut high = 9;
    let mut found = false;
    let mut found_at = 0;

    while low <= high {
        let mid = (low + high) / 2;

        let mut mid_val = 0;
        if mid == 0 { mid_val = 2; }
        if mid == 1 { mid_val = 5; }
        if mid == 2 { mid_val = 8; }
        if mid == 3 { mid_val = 12; }
        if mid == 4 { mid_val = 16; }
        if mid == 5 { mid_val = 23; }
        if mid == 6 { mid_val = 38; }
        if mid == 7 { mid_val = 56; }
        if mid == 8 { mid_val = 72; }
        if mid == 9 { mid_val = 91; }

        if mid_val == target {
            found = true;
            found_at = mid;
            low = high + 1;
        } else if mid_val < target {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    println("Binary search for 23 in sorted array:");
    println("  [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]");
    if found {
        println("  Found at index 5!");
    }
    println("Binary search: O(log n) time complexity");
}
`
        },
        collatz: {
            name: "Collatz Sequence",
            code: `// Collatz conjecture (3n+1 problem)
fn main() {
    let mut n = 27;
    let mut steps = 0;
    let mut max_val = 27;

    println("Collatz sequence starting at 27:");
    while n != 1 {
        if n % 2 == 0 {
            n = n / 2;
        } else {
            n = n * 3 + 1;
        }
        steps = steps + 1;
        if n > max_val {
            max_val = n;
        }
    }

    if steps == 111 {
        println("  Reached 1 in 111 steps");
    }
    if max_val == 9232 {
        println("  Peak value: 9232");
    }

    println("Steps to reach 1:");
    let mut longest = 0;
    let mut longest_start = 0;

    for start in 1..21 {
        let mut num = start;
        let mut count = 0;
        while num != 1 {
            if num % 2 == 0 {
                num = num / 2;
            } else {
                num = num * 3 + 1;
            }
            count = count + 1;
        }
        if count > longest {
            longest = count;
            longest_start = start;
        }
    }

    if longest_start == 18 {
        println("  Longest from 1-20: starting at 18");
    }
    if longest == 20 {
        println("  Taking 20 steps");
    }
}
`
        },
        energyBudget: {
            name: "Energy Concepts",
            code: `// Energy-aware programming in Joule
fn main() {
    // Joule tracks energy in millijoules (mJ)
    // The output panel shows time and energy for each run

    // Efficient: simple loop
    let mut sum = 0;
    for i in 0..1000 {
        sum = sum + i;
    }
    if sum == 499500 {
        println("Sum of 0..1000 = 499,500");
    }

    // Joule's philosophy: what gets measured gets managed

    // Nested loops use more energy
    let mut total = 0;
    for i in 0..100 {
        for j in 0..100 {
            total = total + 1;
        }
    }
    if total == 10000 {
        println("10,000 iterations completed");
    }

    println("Check the energy (mJ) in the output panel ->");
    println("Joule: the language that cares about every millijoule");
}
`
        },
        energyCompare: {
            name: "Energy Comparison",
            code: `// Compare energy costs of different approaches
fn main() {
    // Approach 1: Direct computation
    let n = 1000;
    let mut sum_loop = 0;
    for i in 1..1001 {
        sum_loop = sum_loop + i * i;
    }

    // Approach 2: Formula-based (O(1) vs O(n))
    let sum_formula = n * (n + 1) * (2 * n + 1) / 6;

    if sum_loop == sum_formula {
        println("Both approaches give the same result!");
        println("  Loop: computed in 1000 iterations");
        println("  Formula: computed in 1 step");
    }

    println("Energy efficiency = choosing the right algorithm");
    println("Joule makes energy visible and measurable");
}
`
        },
    };

    // Category organization (matching joule-lang.org)
    const CATEGORIES = {
        "Basics": ["helloWorld", "variables", "comments"],
        "Data Types": ["primitives", "strings", "arithmetic"],
        "Control Flow": ["conditionals", "loops", "matchExpr"],
        "Functions": ["basicFunctions", "returnValues"],
        "Patterns": ["fibonacci", "factorial", "primes"],
        "Structs & Enums": ["basicStruct", "enums"],
        "Algorithms": ["sorting", "searching", "collatz"],
        "Energy": ["energyBudget", "energyCompare"],
    };

    // ---------- State ----------

    let wasmReady = false;
    let monacoEditor = null;
    let selectedExample = "helloWorld";

    // ---------- DOM Elements ----------

    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingStatus = document.getElementById("loading-status");
    const exampleBar = document.getElementById("example-bar");
    const btnRun = document.getElementById("btn-run");
    const outputContent = document.getElementById("output-content");
    const footerEnergy = document.getElementById("footer-energy");
    const footerTime = document.getElementById("footer-time");
    const modeIndicator = document.getElementById("mode-indicator");

    // ---------- Example Bar ----------

    function buildExampleBar() {
        exampleBar.innerHTML = "";
        for (const [category, keys] of Object.entries(CATEGORIES)) {
            const wrapper = document.createElement("div");
            wrapper.className = "example-category";

            const label = document.createElement("span");
            label.className = "category-label";
            label.textContent = category + ":";
            wrapper.appendChild(label);

            const btns = document.createElement("div");
            btns.className = "category-buttons";

            for (const key of keys) {
                const btn = document.createElement("button");
                btn.className = "example-btn " + (key === selectedExample ? "active" : "inactive");
                btn.textContent = EXAMPLES[key].name;
                btn.dataset.key = key;
                btn.addEventListener("click", function () {
                    selectExample(key);
                });
                btns.appendChild(btn);
            }
            wrapper.appendChild(btns);
            exampleBar.appendChild(wrapper);
        }
    }

    function selectExample(key) {
        if (!EXAMPLES[key] || !monacoEditor) return;
        selectedExample = key;
        monacoEditor.setValue(EXAMPLES[key].code);
        monacoEditor.setScrollTop(0);
        monacoEditor.focus();

        // Update active button
        document.querySelectorAll(".example-btn").forEach(function (btn) {
            btn.className = "example-btn " + (btn.dataset.key === key ? "active" : "inactive");
        });

        // Clear output
        outputContent.innerHTML = '<div class="output-placeholder">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run</div>';
        footerEnergy.textContent = "";
        footerTime.textContent = "";
    }

    // ---------- Monaco Editor Setup ----------

    function initMonaco(callback) {
        loadingStatus.textContent = "Loading editor...";

        require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" } });

        require(["vs/editor/editor.main"], function (monaco) {
            // Register Joule language
            monaco.languages.register({ id: "joule" });

            // Monarch tokenizer (exact copy from HolodeckPlayground.tsx)
            monaco.languages.setMonarchTokensProvider("joule", {
                keywords: [
                    "fn", "let", "mut", "const", "if", "else", "match", "for", "while", "loop",
                    "return", "break", "continue", "struct", "enum", "impl", "trait", "type",
                    "pub", "mod", "use", "as", "in", "where", "self", "Self", "true", "false",
                    "async", "await", "move", "ref", "static", "unsafe", "extern", "crate"
                ],
                typeKeywords: [
                    "i8", "i16", "i32", "i64", "i128", "isize",
                    "u8", "u16", "u32", "u64", "u128", "usize",
                    "f32", "f64", "bool", "char", "str", "String",
                    "Vec", "Option", "Result", "Box", "Rc", "Arc"
                ],
                operators: [
                    "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=",
                    "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^", "%",
                    "<<", ">>", ">>>", "+=", "-=", "*=", "/=", "&=", "|=", "^=",
                    "%=", "<<=", ">>=", "->"
                ],
                symbols: /[=><!~?:&|+\-*/^%]+/,
                escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

                tokenizer: {
                    root: [
                        [/@\w+/, "annotation"],
                        [/#\[.*?\]/, "annotation"],
                        [/[a-z_$][\w$]*/, {
                            cases: {
                                "@typeKeywords": "type.identifier",
                                "@keywords": "keyword",
                                "@default": "identifier"
                            }
                        }],
                        [/[A-Z][\w$]*/, "type.identifier"],
                        { include: "@whitespace" },
                        [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
                        [/0[xX][0-9a-fA-F]+/, "number.hex"],
                        [/\d+/, "number"],
                        [/[{}()\[\]]/, "@brackets"],
                        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
                        [/"([^"\\]|\\.)*$/, "string.invalid"],
                        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
                    ],
                    string: [
                        [/[^\\"]+/, "string"],
                        [/@escapes/, "string.escape"],
                        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
                    ],
                    whitespace: [
                        [/[ \t\r\n]+/, "white"],
                        [/\/\*/, "comment", "@comment"],
                        [/\/\/.*$/, "comment"],
                    ],
                    comment: [
                        [/[^/*]+/, "comment"],
                        [/\*\//, "comment", "@pop"],
                        [/[/*]/, "comment"]
                    ],
                },
            });

            // joule-holodeck theme (exact copy from HolodeckPlayground.tsx)
            monaco.editor.defineTheme("joule-holodeck", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { token: "annotation", foreground: "22D3EE", fontStyle: "bold" },
                    { token: "keyword", foreground: "F472B6" },
                    { token: "type.identifier", foreground: "22D3EE" },
                    { token: "number", foreground: "10B981" },
                    { token: "string", foreground: "A78BFA" },
                    { token: "comment", foreground: "64748B" },
                ],
                colors: {
                    "editor.background": "#0a0a15",
                    "editor.foreground": "#e2e8f0",
                    "editor.lineHighlightBackground": "#12122a",
                    "editorCursor.foreground": "#22D3EE",
                    "editor.selectionBackground": "#22D3EE33",
                }
            });

            // Create editor
            monacoEditor = monaco.editor.create(document.getElementById("monaco-container"), {
                value: EXAMPLES.helloWorld.code,
                language: "joule",
                theme: "joule-holodeck",
                fontSize: 13,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                tabSize: 4,
                automaticLayout: true,
            });

            // Hide editor loading placeholder
            const editorLoading = document.querySelector(".editor-loading");
            if (editorLoading) editorLoading.classList.add("hidden");

            // Keyboard shortcut: Ctrl+Enter = Run
            monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
                doRun();
            });

            callback();
        });
    }

    // ---------- WASM Initialization ----------

    async function initWasm() {
        try {
            loadingStatus.textContent = "Loading compiler...";

            await init();

            const version = getVersion();
            console.log("Joule Playground initialized:", version);

            wasmReady = true;
            btnRun.disabled = false;

            outputContent.innerHTML = '<div class="output-placeholder">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run</div>';

            setTimeout(function () {
                loadingOverlay.classList.add("hidden");
            }, 300);
        } catch (e) {
            loadingStatus.textContent = "Failed: " + e.message;
            console.error("WASM init failed:", e);

            setTimeout(function () {
                loadingOverlay.classList.add("hidden");
                outputContent.innerHTML = '<div class="output-error"><div class="error-title">Error:</div><pre>' +
                    escapeHtml(e.message) + '</pre></div>';
            }, 2000);
        }
    }

    // ---------- Run Code ----------

    async function doRun() {
        if (!wasmReady || !monacoEditor) return;
        const source = monacoEditor.getValue();
        if (!source.trim()) return;

        btnRun.disabled = true;

        // Show running state
        outputContent.innerHTML = '<div class="output-placeholder" style="display:flex;align-items:center;gap:8px">' +
            '<svg class="spinner-svg small" viewBox="0 0 24 24"><circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>' +
            '<path class="spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Running...</div>';

        try {
            await new Promise(function (r) { setTimeout(r, 10); });

            const startTime = performance.now();

            // First compile to WASM
            const resultJson = compileToWasm(source);
            const compileTime = performance.now() - startTime;
            const result = JSON.parse(resultJson);

            // Also run energy analysis in background
            let energyMj = null;
            try {
                const analysisJson = analyzeEnergy(source);
                const analysis = JSON.parse(analysisJson);
                if (analysis.success) {
                    const match = analysis.analysis.match(/Estimated total:\s+([\d.]+)\s+mJ/);
                    if (match) energyMj = parseFloat(match[1]);
                }
            } catch (_) { /* ignore */ }

            if (result.success) {
                let outputText = "";
                let runTime = 0;

                try {
                    const wasmBytes = new Uint8Array(result.stdout.split(",").map(Number));
                    const runResult = await executeWasmModule(wasmBytes);
                    outputText = runResult.stdout || "(no output)";
                    runTime = runResult.executionTime;
                } catch (runErr) {
                    outputText = "";
                    // If WASM execution fails, show compile success but note execution limitation
                    outputText = "(WASM execution: " + runErr.message + ")";
                }

                const totalTime = compileTime + runTime;

                // Build output with inline metrics (matching HolodeckPlayground)
                let html = '<pre style="white-space:pre-wrap;color:var(--joule-white)">' + escapeHtml(outputText) + '</pre>';
                html += '<div class="result-metrics">';
                html += '<div class="result-metric-card">';
                html += '<div class="result-metric-label">Execution Time</div>';
                html += '<div class="result-metric-value time">' + totalTime.toFixed(2) + ' ms</div>';
                html += '</div>';
                html += '<div class="result-metric-card">';
                html += '<div class="result-metric-label">Energy Used</div>';
                html += '<div class="result-metric-value energy">' + (energyMj !== null ? energyMj.toFixed(6) + ' mJ' : 'N/A') + '</div>';
                html += '</div>';
                html += '</div>';

                outputContent.innerHTML = html;

                // Footer stats
                footerTime.textContent = totalTime.toFixed(2) + " ms";
                footerEnergy.textContent = energyMj !== null ? energyMj.toFixed(6) + " mJ" : "";
            } else {
                let errorText = result.compile_errors || "Compilation failed";
                if (result.stderr) errorText += "\n" + result.stderr;
                outputContent.innerHTML = '<div class="output-error"><div class="error-title">Error:</div><pre style="white-space:pre-wrap">' +
                    escapeHtml(errorText) + '</pre></div>';
                footerTime.textContent = compileTime.toFixed(0) + " ms";
                footerEnergy.textContent = "";
            }
        } catch (e) {
            outputContent.innerHTML = '<div class="output-error"><div class="error-title">Error:</div><pre>' +
                escapeHtml(e.message) + '</pre></div>';
        } finally {
            btnRun.disabled = false;
        }
    }

    async function executeWasmModule(wasmBytes) {
        const stdout = [];
        const startTime = performance.now();

        const importObject = {
            env: {
                console_log: function (ptr, len) {
                    const memory = instance.exports.memory;
                    const bytes = new Uint8Array(memory.buffer, ptr, len);
                    stdout.push(new TextDecoder("utf-8").decode(bytes));
                },
                performance_now: function () { return performance.now(); },
                abort: function () { throw new Error("Program aborted"); },
            },
        };

        let instance;
        const module = await WebAssembly.compile(wasmBytes);
        instance = await WebAssembly.instantiate(module, importObject);

        try {
            if (instance.exports.main) {
                instance.exports.main();
            } else if (instance.exports._start) {
                instance.exports._start();
            } else if (instance.exports.joule_entry) {
                instance.exports.joule_entry();
            }
        } catch (e) {
            if (e.message !== "Program aborted") throw e;
        }

        return {
            stdout: stdout.join(""),
            executionTime: performance.now() - startTime,
        };
    }

    // ---------- Utilities ----------

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // ---------- Initialization ----------

    function start() {
        buildExampleBar();

        btnRun.addEventListener("click", doRun);

        // Global Ctrl+Enter shortcut (when editor doesn't have focus)
        window.addEventListener("keydown", function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                doRun();
            }
        });

        // Load Monaco first, then WASM
        initMonaco(function () {
            initWasm();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
