// ==========================================================================
// Joule Playground — WASM Edition with Monaco Editor
// Matches joule-lang.org design: syntax highlighting, examples, energy metrics
// ==========================================================================

import init, { compileToC, compileToWasm, analyzeEnergy, getVersion } from './pkg/joule_playground_wasm.js';

(function () {
    "use strict";

    // ---------- DOM Elements ----------

    const examplesSelect = document.getElementById("examples");
    const btnCompile = document.getElementById("btn-compile");
    const btnRun = document.getElementById("btn-run");
    const btnAnalyze = document.getElementById("btn-analyze");
    const statusEl = document.getElementById("status");
    const tabOutput = document.getElementById("tab-output");
    const tabCompiled = document.getElementById("tab-compiled");
    const tabEnergy = document.getElementById("tab-energy");
    const resizeHandle = document.getElementById("resize-handle");
    const editorPane = document.getElementById("editor-pane");
    const outputPane = document.getElementById("output-pane");
    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingBarFill = document.getElementById("loading-bar-fill");
    const loadingStatus = document.getElementById("loading-status");
    const metricTime = document.getElementById("metric-time");
    const metricEnergy = document.getElementById("metric-energy");
    const metricStatus = document.getElementById("metric-status");

    let wasmReady = false;
    let monacoEditor = null;

    // ---------- 27 Example Programs (matching joule-lang.org) ----------

    const EXAMPLES = {
        // --- Hello World & Basics ---
        helloWorld: `// Hello World
// The simplest Joule program.

fn main() {
    println!("Hello, World!");
    println!("Energy-aware computing starts here.");
}`,

        variables: `// Variables & Types
// Joule uses let for immutable bindings, let mut for mutable.

fn main() {
    let name = "Joule";
    let version: i32 = 1;
    let mut counter = 0;

    counter = counter + 1;

    let pi: f64 = 3.14159;
    let active: bool = true;

    println!("Language: {} v{}", name, version);
    println!("Counter: {}", counter);
    println!("Pi: {:.5}", pi);
    println!("Active: {}", active);
}`,

        comments: `// Comments
// Joule supports line comments (//) and block comments (/* */).

fn main() {
    // This is a line comment
    let x = 42; // inline comment

    /* This is a
       block comment */

    /// Documentation comment for the next item
    let documented = true;

    println!("x = {}", x);
    println!("documented = {}", documented);
}`,

        // --- Data Types ---
        primitives: `// Primitive Types
// Joule supports integer, float, and boolean primitives.

fn main() {
    let a: i32 = 42;
    let b: i64 = 1_000_000;
    let c: f64 = 3.14159;
    let d: bool = true;
    let e: char = 'J';

    println!("i32: {}", a);
    println!("i64: {}", b);
    println!("f64: {:.5}", c);
    println!("bool: {}", d);
    println!("char: {}", e);

    // Arithmetic
    println!("a + 8 = {}", a + 8);
    println!("b * 2 = {}", b * 2);
    println!("c / 2.0 = {:.5}", c / 2.0);
}`,

        strings: `// Strings
// Joule strings are UTF-8 encoded.

fn main() {
    let greeting = "Hello";
    let name = "World";

    // String formatting
    println!("{}, {}!", greeting, name);

    // String length
    let msg = "Energy-aware programming";
    println!("Message: {}", msg);
    println!("Length: {}", msg.len());

    // String operations
    let full = String::from("Joule Language");
    println!("Full: {}", full);
}`,

        arithmetic: `// Arithmetic Operations
// All standard math operators are supported.

fn main() {
    let a = 15;
    let b = 4;

    println!("{} + {} = {}", a, b, a + b);
    println!("{} - {} = {}", a, b, a - b);
    println!("{} * {} = {}", a, b, a * b);
    println!("{} / {} = {}", a, b, a / b);
    println!("{} % {} = {}", a, b, a % b);

    // Floating point
    let x: f64 = 10.0;
    let y: f64 = 3.0;
    println!("{:.1} / {:.1} = {:.4}", x, y, x / y);
}`,

        // --- Control Flow ---
        conditionals: `// Conditionals
// If/else expressions with boolean logic.

fn main() {
    let temperature = 72;

    if temperature > 90 {
        println!("Hot! Consider thermal throttling.");
    } else if temperature > 70 {
        println!("Warm. Normal operation.");
    } else if temperature > 50 {
        println!("Cool. Peak efficiency.");
    } else {
        println!("Cold. Optimal energy usage.");
    }

    let status = if temperature > 80 { "warning" } else { "ok" };
    println!("Status: {}", status);
}`,

        loops: `// Loops
// For ranges, while loops, and break statements.

fn main() {
    // For loop with range
    println!("Counting:");
    for i in 0..5 {
        println!("  {}", i);
    }

    // While loop
    let mut n = 1;
    println!("Powers of 2:");
    while n < 100 {
        println!("  {}", n);
        n = n * 2;
    }

    // Loop with break
    let mut sum = 0;
    for i in 1..100 {
        sum = sum + i;
        if sum > 50 {
            println!("Sum exceeded 50 at i={}: sum={}", i, sum);
            break;
        }
    }
}`,

        matchExpr: `// Pattern Matching
// Match expressions for multi-way branching.

fn main() {
    let day = 3;

    let name = match day {
        1 => "Monday",
        2 => "Tuesday",
        3 => "Wednesday",
        4 => "Thursday",
        5 => "Friday",
        6 | 7 => "Weekend",
        _ => "Unknown",
    };

    println!("Day {}: {}", day, name);

    // Match with ranges
    let score = 85;
    let grade = match score {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        60..=69 => "D",
        _ => "F",
    };
    println!("Score {}: Grade {}", score, grade);
}`,

        // --- Functions ---
        basicFunctions: `// Functions
// Functions with parameters and return types.

fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn max(a: i32, b: i32) -> i32 {
    if a > b { a } else { b }
}

fn main() {
    greet("Joule");

    let sum = add(3, 7);
    println!("3 + 7 = {}", sum);

    let m = max(42, 17);
    println!("max(42, 17) = {}", m);
}`,

        returnValues: `// Return Values
// Functions return the last expression (no semicolon) or use explicit return.

fn square(x: i32) -> i32 {
    x * x
}

fn absolute(x: i32) -> i32 {
    if x < 0 {
        return -x;
    }
    x
}

fn clamp(value: i32, min: i32, max: i32) -> i32 {
    if value < min {
        min
    } else if value > max {
        max
    } else {
        value
    }
}

fn main() {
    println!("square(5) = {}", square(5));
    println!("absolute(-7) = {}", absolute(-7));
    println!("clamp(150, 0, 100) = {}", clamp(150, 0, 100));
}`,

        // --- Patterns ---
        fibonacci: `// Fibonacci Sequence
// Classic recursive and iterative implementations.

fn fibonacci(n: i32) -> i32 {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fn main() {
    println!("Fibonacci sequence:");
    for i in 0..12 {
        println!("  fib({}) = {}", i, fibonacci(i));
    }
}`,

        factorial: `// Factorial
// Computing n! with iteration.

fn factorial(n: i64) -> i64 {
    let mut result: i64 = 1;
    for i in 2..=n {
        result = result * i;
    }
    result
}

fn main() {
    println!("Factorials:");
    for i in 0..12 {
        println!("  {}! = {}", i, factorial(i));
    }
}`,

        primes: `// Prime Numbers
// Trial division primality test and sieve.

fn is_prime(n: i32) -> bool {
    if n < 2 { return false; }
    if n < 4 { return true; }
    if n % 2 == 0 { return false; }

    let mut i = 3;
    while i * i <= n {
        if n % i == 0 {
            return false;
        }
        i = i + 2;
    }
    true
}

fn main() {
    println!("Primes up to 50:");
    let mut count = 0;
    for n in 2..50 {
        if is_prime(n) {
            println!("  {}", n);
            count = count + 1;
        }
    }
    println!("Found {} primes", count);
}`,

        // --- Structs & Enums ---
        basicStruct: `// Structs
// Define data types with methods.

struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Point {
        Point { x, y }
    }

    fn distance(&self, other: &Point) -> f64 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        (dx * dx + dy * dy).sqrt()
    }
}

fn main() {
    let p1 = Point::new(0.0, 0.0);
    let p2 = Point::new(3.0, 4.0);

    println!("P1: ({}, {})", p1.x, p1.y);
    println!("P2: ({}, {})", p2.x, p2.y);
    println!("Distance: {:.2}", p1.distance(&p2));
}`,

        enums: `// Enums
// Algebraic data types with pattern matching.

enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle(f64, f64, f64),
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r) => 3.14159 * r * r,
        Shape::Rectangle(w, h) => w * h,
        Shape::Triangle(a, b, c) => {
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
    }
}

fn main() {
    let shapes = vec![
        Shape::Circle(5.0),
        Shape::Rectangle(4.0, 6.0),
        Shape::Triangle(3.0, 4.0, 5.0),
    ];

    for shape in &shapes {
        println!("Area: {:.2}", area(shape));
    }
}`,

        // --- Algorithms ---
        sorting: `// Bubble Sort
// Classic sorting algorithm implementation.

fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..(n - 1 - i) {
            if arr[j] > arr[j + 1] {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

fn main() {
    let mut data = vec![64, 34, 25, 12, 22, 11, 90];
    println!("Before: {:?}", data);
    bubble_sort(&mut data);
    println!("After:  {:?}", data);
}`,

        searching: `// Binary Search
// Efficient search in sorted arrays.

fn binary_search(arr: &Vec<i32>, target: i32) -> i32 {
    let mut low: i32 = 0;
    let mut high: i32 = arr.len() as i32 - 1;

    while low <= high {
        let mid = (low + high) / 2;
        if arr[mid as usize] == target {
            return mid;
        } else if arr[mid as usize] < target {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    -1
}

fn main() {
    let data = vec![2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    println!("Array: {:?}", data);

    let targets = vec![23, 72, 50];
    for t in targets {
        let idx = binary_search(&data, t);
        if idx >= 0 {
            println!("Found {} at index {}", t, idx);
        } else {
            println!("{} not found", t);
        }
    }
}`,

        collatz: `// Collatz Sequence (3n+1)
// Famous unsolved conjecture in mathematics.

fn collatz_steps(mut n: i64) -> i32 {
    let mut steps = 0;
    while n != 1 {
        if n % 2 == 0 {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        steps = steps + 1;
    }
    steps
}

fn main() {
    println!("Collatz sequence lengths:");
    for n in 1..20 {
        let steps = collatz_steps(n);
        println!("  {} -> 1 in {} steps", n, steps);
    }

    // Famous long sequence
    let n: i64 = 27;
    println!("\\n{} takes {} steps to reach 1", n, collatz_steps(n));
}`,

        // --- Energy-Aware ---
        energyBudget: `// Energy Budget
// Joule's defining feature: compile-time energy budget enforcement.

#[energy_budget(max_joules = 0.001)]
fn efficient_sum(data: Vec<i32>) -> i32 {
    let mut sum = 0;
    for i in 0..data.len() {
        sum = sum + data[i];
    }
    sum
}

#[energy_budget(max_joules = 0.0001)]
fn lightweight_op() -> i32 {
    let x = 42;
    let y = 58;
    x + y
}

fn main() {
    let data = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let result = efficient_sum(data);
    println!("Sum: {}", result);

    let quick = lightweight_op();
    println!("Quick: {}", quick);
}`,

        energyCompare: `// Energy Comparison
// Compare energy cost of different algorithms for the same task.

fn sum_loop(data: &Vec<i32>) -> i32 {
    let mut sum = 0;
    for i in 0..data.len() {
        sum = sum + data[i];
    }
    sum
}

fn sum_formula(n: i32) -> i32 {
    n * (n + 1) / 2
}

fn main() {
    let data: Vec<i32> = (1..=100).collect();

    // O(n) approach
    let result_loop = sum_loop(&data);
    println!("Loop sum (1..100):    {}", result_loop);

    // O(1) approach - dramatically less energy
    let result_formula = sum_formula(100);
    println!("Formula sum (1..100): {}", result_formula);

    println!("\\nThe formula approach uses orders of magnitude");
    println!("less energy than the loop approach.");
    println!("This is the power of energy-aware programming.");
}`,

        // --- Advanced ---
        closures: `// Closures
// Anonymous functions with environment capture.

fn apply(f: fn(i32) -> i32, x: i32) -> i32 {
    f(x)
}

fn main() {
    let multiplier = 3;
    let triple = |x: i32| -> i32 { x * multiplier };

    println!("triple(7) = {}", triple(7));

    let add_ten = |x: i32| -> i32 { x + 10 };
    println!("add_ten(5) = {}", add_ten(5));

    let doubled = apply(|x: i32| -> i32 { x * 2 }, 4);
    println!("doubled(4) = {}", doubled);
}`,

        generics: `// Generics
// Type-safe generic functions.

fn max<T: Ord>(a: T, b: T) -> T {
    if a > b { a } else { b }
}

fn sum_vec(items: &Vec<i32>) -> i32 {
    let mut total = 0;
    for i in 0..items.len() {
        total = total + items[i];
    }
    total
}

fn main() {
    println!("max(3, 7) = {}", max(3, 7));
    println!("max(10, 2) = {}", max(10, 2));

    let numbers = vec![10, 20, 30, 40, 50];
    println!("sum = {}", sum_vec(&numbers));
}`,

        ownership: `// Ownership & Borrowing
// Joule uses Rust-style ownership for memory safety.

fn print_length(s: &String) {
    println!("'{}' has length {}", s, s.len());
}

fn append_exclaim(s: &mut String) {
    s.push_str("!");
}

fn main() {
    let mut greeting = String::from("Hello, Joule");

    // Immutable borrow
    print_length(&greeting);

    // Mutable borrow
    append_exclaim(&mut greeting);
    println!("After append: {}", greeting);

    // Ownership transfer
    let owned = greeting;
    println!("Owned: {}", owned);
    // greeting is no longer valid here — ownership moved
}`,

        thermalAdapt: `// Thermal Adaptation
// Joule programs can adapt computation based on hardware thermal state.

fn adaptive_compute(data: Vec<f64>) -> f64 {
    thermal_adapt {
        Cool => {
            // Full precision when hardware is cool
            let mut sum = 0.0;
            for i in 0..data.len() {
                sum = sum + data[i] * data[i];
            }
            sum
        },
        Hot => {
            // Reduced precision under thermal pressure
            let mut sum = 0.0;
            for i in 0..data.len() {
                sum = sum + data[i];
            }
            sum
        }
    }
}

fn main() {
    let data = vec![1.5, 2.5, 3.5, 4.5, 5.5];
    let result = adaptive_compute(data);
    println!("Result: {:.2}", result);
    println!("\\nThe compiler selects the code path based on");
    println!("the thermal state of the hardware at runtime.");
}`
    };

    // ---------- Monaco Editor Setup ----------

    function initMonaco(callback) {
        loadingStatus.textContent = "Loading Monaco Editor...";
        loadingBarFill.style.width = "10%";

        require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" } });

        require(["vs/editor/editor.main"], function (monaco) {
            // Register Joule language
            monaco.languages.register({ id: "joule" });

            // Joule tokenizer rules (matching joule-lang.org syntax highlighting)
            monaco.languages.setMonarchTokensProvider("joule", {
                keywords: [
                    "fn", "let", "mut", "const", "if", "else", "match", "for", "while",
                    "loop", "return", "break", "continue", "struct", "enum", "impl",
                    "trait", "type", "pub", "mod", "use", "as", "in", "where",
                    "self", "Self", "true", "false", "async", "await", "move", "ref",
                    "static", "unsafe", "extern", "crate", "dyn", "thermal_adapt",
                    "energy_budget", "vec"
                ],
                typeKeywords: [
                    "i8", "i16", "i32", "i64", "i128", "isize",
                    "u8", "u16", "u32", "u64", "u128", "usize",
                    "f32", "f64", "bool", "char", "str", "String",
                    "Vec", "Option", "Result", "Box", "Rc", "Arc",
                    "HashMap", "HashSet"
                ],
                operators: [
                    "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=",
                    "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^", "%",
                    "<<", ">>", "+=", "-=", "*=", "/=", "&=", "|=", "^=", "%=",
                    "<<=", ">>=", "->", "=>"
                ],
                symbols: /[=><!~?:&|+\-*/^%]+/,
                escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
                tokenizer: {
                    root: [
                        // Annotations
                        [/#\[.*?\]/, "annotation"],
                        [/@\w+/, "annotation"],
                        // Identifiers and keywords
                        [/[a-zA-Z_]\w*!/, "macro"],
                        [/[a-zA-Z_]\w*/, {
                            cases: {
                                "@keywords": "keyword",
                                "@typeKeywords": "type.identifier",
                                "@default": "identifier"
                            }
                        }],
                        // Whitespace
                        { include: "@whitespace" },
                        // Delimiters
                        [/[{}()\[\]]/, "@brackets"],
                        [/[<>](?!@symbols)/, "@brackets"],
                        // Operators
                        [/@symbols/, {
                            cases: {
                                "@operators": "operator",
                                "@default": ""
                            }
                        }],
                        // Numbers
                        [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
                        [/0[xX][0-9a-fA-F]+/, "number.hex"],
                        [/0[oO][0-7]+/, "number.octal"],
                        [/0[bB][01]+/, "number.binary"],
                        [/\d+/, "number"],
                        // Strings
                        [/"([^"\\]|\\.)*$/, "string.invalid"],
                        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
                        // Characters
                        [/'[^\\']'/, "string.char"],
                        [/(')(@escapes)(')/, ["string.char", "string.escape", "string.char"]],
                        // Delimiter
                        [/[;,.]/, "delimiter"],
                    ],
                    comment: [
                        [/[^/*]+/, "comment"],
                        [/\/\*/, "comment", "@push"],
                        ["\\*/", "comment", "@pop"],
                        [/[/*]/, "comment"]
                    ],
                    string: [
                        [/[^\\"]+/, "string"],
                        [/@escapes/, "string.escape"],
                        [/\\./, "string.escape.invalid"],
                        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
                    ],
                    whitespace: [
                        [/[ \t\r\n]+/, "white"],
                        [/\/\*/, "comment", "@comment"],
                        [/\/\/\/.*$/, "comment.doc"],
                        [/\/\/.*$/, "comment"],
                    ],
                }
            });

            // Joule dark theme (matching joule-lang.org)
            monaco.editor.defineTheme("joule-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { token: "keyword",          foreground: "F472B6", fontStyle: "bold" },
                    { token: "type.identifier",  foreground: "22D3EE" },
                    { token: "number",           foreground: "10B981" },
                    { token: "number.float",     foreground: "10B981" },
                    { token: "number.hex",       foreground: "10B981" },
                    { token: "number.octal",     foreground: "10B981" },
                    { token: "number.binary",    foreground: "10B981" },
                    { token: "string",           foreground: "A78BFA" },
                    { token: "string.char",      foreground: "A78BFA" },
                    { token: "string.escape",    foreground: "FBBF24" },
                    { token: "comment",          foreground: "64748B", fontStyle: "italic" },
                    { token: "comment.doc",      foreground: "94A3B8", fontStyle: "italic" },
                    { token: "annotation",       foreground: "FBBF24" },
                    { token: "macro",            foreground: "FBBF24" },
                    { token: "operator",         foreground: "94A3B8" },
                    { token: "delimiter",        foreground: "94A3B8" },
                    { token: "identifier",       foreground: "e2e8f0" },
                ],
                colors: {
                    "editor.background":              "#0f0f1a",
                    "editor.foreground":              "#e2e8f0",
                    "editor.lineHighlightBackground": "#1a1a2e",
                    "editor.selectionBackground":     "#FBBF2433",
                    "editorCursor.foreground":        "#FBBF24",
                    "editorLineNumber.foreground":    "#64748B",
                    "editorLineNumber.activeForeground": "#94A3B8",
                    "editor.inactiveSelectionBackground": "#6366F122",
                    "editorIndentGuide.background1":  "#1e1e3a",
                    "editorIndentGuide.activeBackground1": "#6366F144",
                    "editorGutter.background":        "#0a0a15",
                    "scrollbar.shadow":               "#00000000",
                    "scrollbarSlider.background":     "#6366F133",
                    "scrollbarSlider.hoverBackground":"#6366F155",
                    "scrollbarSlider.activeBackground":"#6366F177",
                }
            });

            // Create editor
            monacoEditor = monaco.editor.create(document.getElementById("monaco-container"), {
                value: EXAMPLES.helloWorld,
                language: "joule",
                theme: "joule-dark",
                fontSize: 14,
                lineHeight: 22,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                tabSize: 4,
                insertSpaces: true,
                automaticLayout: true,
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true },
                wordWrap: "off",
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
            });

            // Keyboard shortcuts
            monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
                doRun();
            });
            monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyB, function () {
                doCompile();
            });
            monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyE, function () {
                doAnalyze();
            });

            loadingBarFill.style.width = "30%";
            loadingStatus.textContent = "Editor ready, loading compiler...";
            callback();
        });
    }

    // ---------- WASM Initialization ----------

    async function initWasm() {
        try {
            loadingBarFill.style.width = "50%";
            loadingStatus.textContent = "Fetching WebAssembly module...";

            await init();

            loadingBarFill.style.width = "95%";
            loadingStatus.textContent = "Compiler ready";

            const version = getVersion();
            console.log("Joule Playground initialized:", version);

            loadingBarFill.style.width = "100%";
            wasmReady = true;

            btnCompile.disabled = false;
            btnRun.disabled = false;
            btnAnalyze.disabled = false;

            tabOutput.textContent = "Press Run to execute your Joule program.\n" +
                "Press Compile to see the generated C code.\n" +
                "Press Analyze to view the energy analysis.\n\n" +
                version + "\nRunning entirely in your browser via WebAssembly.";

            metricStatus.textContent = "Ready";
            metricStatus.className = "metric-value metric-status";

            setTimeout(function () {
                loadingOverlay.classList.add("hidden");
            }, 300);
        } catch (e) {
            loadingStatus.textContent = "Failed: " + e.message;
            loadingBarFill.style.background = "#EF4444";
            console.error("WASM init failed:", e);

            setTimeout(function () {
                loadingOverlay.classList.add("hidden");
                tabOutput.innerHTML = '<span class="output-error">Failed to load the Joule compiler.\n\n' +
                    escapeHtml(e.message) + '\n\nPlease try refreshing the page.</span>';
                metricStatus.textContent = "Error";
                metricStatus.className = "metric-value metric-status error";
            }, 2000);
        }
    }

    // ---------- Output Tabs ----------

    function switchTab(tabName) {
        document.querySelectorAll(".tab").forEach(function (t) {
            t.classList.toggle("active", t.dataset.tab === tabName);
        });
        document.querySelectorAll(".tab-content").forEach(function (c) {
            c.classList.toggle("active", c.id === "tab-" + tabName);
        });
    }

    function initTabs() {
        document.querySelectorAll(".tab").forEach(function (tab) {
            tab.addEventListener("click", function () {
                switchTab(this.dataset.tab);
            });
        });
    }

    // ---------- Status ----------

    function setStatus(text, cls) {
        statusEl.textContent = text;
        statusEl.className = "status" + (cls ? " " + cls : "");
    }

    function setStatusRunning(text) {
        statusEl.innerHTML = '<span class="spinner"></span>' + escapeHtml(text);
        statusEl.className = "status running";
    }

    // ---------- Compiler Calls ----------

    function setButtonsDisabled(disabled) {
        btnCompile.disabled = disabled;
        btnRun.disabled = disabled;
        btnAnalyze.disabled = disabled;
    }

    function getSource() {
        return monacoEditor ? monacoEditor.getValue() : "";
    }

    async function doCompile() {
        if (!wasmReady) return;
        const source = getSource();
        if (!source.trim()) {
            tabCompiled.textContent = "No source code to compile.";
            switchTab("compiled");
            return;
        }

        setButtonsDisabled(true);
        setStatusRunning("Compiling...");
        switchTab("compiled");
        metricStatus.textContent = "Compiling";
        metricStatus.className = "metric-value metric-status";

        try {
            await new Promise(function (resolve) { setTimeout(resolve, 10); });

            const startTime = performance.now();
            const resultJson = compileToC(source);
            const elapsed = performance.now() - startTime;
            const result = JSON.parse(resultJson);

            metricTime.textContent = elapsed.toFixed(0) + " ms";

            if (result.success) {
                tabCompiled.textContent = result.output || "(empty output)";
                setStatus("Compiled in " + elapsed.toFixed(0) + "ms", "success");
                metricStatus.textContent = "Success";
                metricStatus.className = "metric-value metric-status";
            } else {
                tabCompiled.innerHTML = formatErrors(result.errors || "Compilation failed");
                setStatus("Compilation failed", "error");
                metricStatus.textContent = "Failed";
                metricStatus.className = "metric-value metric-status error";
            }
        } catch (e) {
            tabCompiled.innerHTML = '<span class="output-error">' + escapeHtml("Error: " + e.message) + "</span>";
            setStatus("Error", "error");
            metricStatus.textContent = "Error";
            metricStatus.className = "metric-value metric-status error";
        } finally {
            setButtonsDisabled(false);
        }
    }

    async function doRun() {
        if (!wasmReady) return;
        const source = getSource();
        if (!source.trim()) {
            tabOutput.textContent = "No source code to run.";
            switchTab("output");
            return;
        }

        setButtonsDisabled(true);
        setStatusRunning("Compiling & Running...");
        switchTab("output");
        metricStatus.textContent = "Running";
        metricStatus.className = "metric-value metric-status";

        try {
            await new Promise(function (resolve) { setTimeout(resolve, 10); });

            const startTime = performance.now();
            const resultJson = compileToWasm(source);
            const compileTime = performance.now() - startTime;
            const result = JSON.parse(resultJson);

            if (result.compile_output) {
                tabCompiled.textContent = result.compile_output;
            }

            metricTime.textContent = compileTime.toFixed(0) + " ms";

            if (result.success) {
                // The stdout contains comma-separated WASM bytes
                try {
                    const wasmBytes = new Uint8Array(result.stdout.split(",").map(Number));
                    const runResult = await executeWasmModule(wasmBytes);

                    let output = runResult.stdout || "";
                    if (!output) {
                        output = "(program produced no output)";
                    }
                    tabOutput.textContent = output;

                    const totalTime = compileTime + (runResult.executionTime || 0);
                    metricTime.textContent = totalTime.toFixed(0) + " ms";
                    setStatus("Completed in " + totalTime.toFixed(0) + "ms", "success");
                    metricStatus.textContent = "Success";
                    metricStatus.className = "metric-value metric-status";
                } catch (runErr) {
                    tabOutput.innerHTML = '<span class="output-error">Runtime error: ' +
                        escapeHtml(runErr.message) + "</span>";
                    setStatus("Runtime error", "error");
                    metricStatus.textContent = "Runtime Error";
                    metricStatus.className = "metric-value metric-status error";
                }
            } else {
                let errorText = result.compile_errors || "";
                if (result.stderr) {
                    errorText += (errorText ? "\n\n" : "") + result.stderr;
                }
                tabOutput.innerHTML = formatErrors(errorText || "Compilation failed");
                setStatus("Failed", "error");
                metricStatus.textContent = "Failed";
                metricStatus.className = "metric-value metric-status error";
            }
        } catch (e) {
            tabOutput.innerHTML = '<span class="output-error">' + escapeHtml("Error: " + e.message) + "</span>";
            setStatus("Error", "error");
            metricStatus.textContent = "Error";
            metricStatus.className = "metric-value metric-status error";
        } finally {
            setButtonsDisabled(false);
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
                    const text = new TextDecoder("utf-8").decode(bytes);
                    stdout.push(text);
                },
                performance_now: function () {
                    return performance.now();
                },
                abort: function () {
                    throw new Error("Program aborted");
                },
            },
        };

        let instance;
        try {
            const module = await WebAssembly.compile(wasmBytes);
            instance = await WebAssembly.instantiate(module, importObject);
        } catch (e) {
            throw new Error("WASM instantiation failed: " + e.message);
        }

        try {
            if (instance.exports.main) {
                instance.exports.main();
            } else if (instance.exports._start) {
                instance.exports._start();
            } else if (instance.exports.joule_entry) {
                instance.exports.joule_entry();
            }
        } catch (e) {
            if (e.message !== "Program aborted") {
                throw e;
            }
        }

        return {
            stdout: stdout.join(""),
            executionTime: performance.now() - startTime,
        };
    }

    async function doAnalyze() {
        if (!wasmReady) return;
        const source = getSource();
        if (!source.trim()) {
            tabEnergy.textContent = "No source code to analyze.";
            switchTab("energy");
            return;
        }

        setButtonsDisabled(true);
        setStatusRunning("Analyzing...");
        switchTab("energy");
        metricStatus.textContent = "Analyzing";
        metricStatus.className = "metric-value metric-status";

        try {
            await new Promise(function (resolve) { setTimeout(resolve, 10); });

            const startTime = performance.now();
            const resultJson = analyzeEnergy(source);
            const elapsed = performance.now() - startTime;
            const result = JSON.parse(resultJson);

            metricTime.textContent = elapsed.toFixed(0) + " ms";

            if (result.success) {
                tabEnergy.innerHTML = formatAnalysis(result.analysis || "(no analysis)");
                setStatus("Analysis complete (" + elapsed.toFixed(0) + "ms)", "success");

                // Extract energy from report for metrics bar
                const energyMatch = result.analysis.match(/Estimated total:\s+([\d.]+)\s+mJ/);
                if (energyMatch) {
                    metricEnergy.textContent = energyMatch[1] + " mJ";
                }

                metricStatus.textContent = "Success";
                metricStatus.className = "metric-value metric-status";
            } else {
                tabEnergy.innerHTML = formatErrors(result.errors || "Analysis failed");
                setStatus("Analysis failed", "error");
                metricStatus.textContent = "Failed";
                metricStatus.className = "metric-value metric-status error";
            }
        } catch (e) {
            tabEnergy.innerHTML = '<span class="output-error">' + escapeHtml("Error: " + e.message) + "</span>";
            setStatus("Error", "error");
            metricStatus.textContent = "Error";
            metricStatus.className = "metric-value metric-status error";
        } finally {
            setButtonsDisabled(false);
        }
    }

    // ---------- Output Formatting ----------

    function escapeHtml(text) {
        var div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function formatErrors(text) {
        return escapeHtml(text)
            .replace(/^(.*error.*)/gim, '<span class="output-error">$1</span>')
            .replace(/^(.*warning.*)/gim, '<span class="output-warning">$1</span>')
            .replace(/^(.*note:.*)/gim, '<span class="output-info">$1</span>');
    }

    function formatAnalysis(text) {
        return escapeHtml(text)
            .replace(/^(===.*===)$/gm, '<span class="output-info">$1</span>')
            .replace(/^(---.*)$/gm, '<span class="output-info">$1</span>')
            .replace(/^(  ->.*)$/gm, '<span class="output-muted">$1</span>')
            .replace(/(Estimated total:\s+)([\d.]+\s+mJ)/, '$1<span class="output-success">$2</span>')
            .replace(/^(Note:.*)$/gm, '<span class="output-muted">$1</span>')
            .replace(/STATUS: OK/g, '<span class="output-success">STATUS: OK</span>')
            .replace(/STATUS: OVER BUDGET/g, '<span class="output-error">STATUS: OVER BUDGET</span>')
            .replace(/(Compute:.*?pJ)/g, '<span class="output-info">$1</span>')
            .replace(/(Memory:.*?pJ)/g, '<span class="output-info">$1</span>')
            .replace(/(I\/O:.*?pJ)/g, '<span class="output-info">$1</span>');
    }

    // ---------- Example Loading ----------

    function loadExample(name) {
        if (name && EXAMPLES[name] && monacoEditor) {
            monacoEditor.setValue(EXAMPLES[name]);
            monacoEditor.setScrollTop(0);
            monacoEditor.focus();
        }
    }

    // ---------- Resize Handle ----------

    function initResize() {
        let isResizing = false;
        let startX = 0;
        let startEditorWidth = 0;

        resizeHandle.addEventListener("mousedown", function (e) {
            isResizing = true;
            startX = e.clientX;
            startEditorWidth = editorPane.offsetWidth;
            resizeHandle.classList.add("active");
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
            e.preventDefault();
        });

        document.addEventListener("mousemove", function (e) {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const newWidth = startEditorWidth + dx;
            const totalWidth = editorPane.parentElement.offsetWidth;
            const minWidth = 250;
            const maxWidth = totalWidth - minWidth - resizeHandle.offsetWidth;
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                editorPane.style.flex = "none";
                editorPane.style.width = newWidth + "px";
                outputPane.style.flex = "1";
            }
        });

        document.addEventListener("mouseup", function () {
            if (isResizing) {
                isResizing = false;
                resizeHandle.classList.remove("active");
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            }
        });
    }

    // ---------- Initialization ----------

    function start() {
        initTabs();
        initResize();

        examplesSelect.addEventListener("change", function () {
            loadExample(this.value);
            this.value = "";
        });

        btnCompile.addEventListener("click", doCompile);
        btnRun.addEventListener("click", doRun);
        btnAnalyze.addEventListener("click", doAnalyze);

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
