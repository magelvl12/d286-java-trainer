// All problem content lives here. See README.md for the format of each field.
// j`...` keeps backslashes literal and trims the first and last newline, so Java code
// can be pasted between the backticks exactly as written.
const j = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n$/, '');
const SCANNER_MAIN = j`
import java.util.Scanner;

public class LabProgram {
   public static void main(String[] args) {
      Scanner scnr = new Scanner(System.in);

      @@0@@
   }
}`;
window.PROBLEMS = [];

// ---------------------------------------------------------------- Problem 1
{
  const sol = j`
System.out.println("H   H");
System.out.println("H   H");
System.out.println("HHHHH");
System.out.println("H   H");
System.out.println("H   H");`;
  const tpl = j`
public class LabProgram {
   public static void main(String[] args) {
      @@0@@
   }
}`;
  PROBLEMS.push({
    id: 1,
    title: 'H pattern',
    topic: 'println, exact spaces',
    statement: 'Output the pattern below, ending with a newline. Each line contains 5 characters including whitespace.',
    samples: [{ input: '', output: 'H   H\nH   H\nHHHHH\nH   H\nH   H\n' }],
    files: [{ name: 'LabProgram.java', code: tpl }],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'System.out.println("H   H");', say: 'Print `H`, three spaces, `H`, then press Enter. `println` = the typewriter **with** the Enter key.', py: 'print("H   H")' },
      { code: 'System.out.println("H   H");', say: 'Same row again. Count the spaces: exactly three, so the line is 5 characters wide.' },
      { code: 'System.out.println("HHHHH");', say: 'The crossbar: five H’s, no spaces.' },
      { code: 'System.out.println("H   H");\nSystem.out.println("H   H");', say: 'The bottom half mirrors the top. The last line is `println` too, so the output ends with a newline.' }
    ],
    python: {
      java: 'System.out.println("H   H");\nSystem.out.print("H   H");',
      py: 'print("H   H")\nprint("H   H", end="")',
      note: 'Python’s `print` adds the newline for you. That’s Java’s `println`. Java’s `print` is like Python’s `print(..., end="")`.'
    },
    analogy: '`print` vs `println` = a typewriter without and with the Enter key. Every row of the H needs Enter, so every line is `println`.',
    concepts: ['`println` adds the newline; `print` doesn’t.', 'Exact spaces matter: three between the H’s.', 'Every statement ends with `;`.'],
    mistakes: ['Forgot a `;` → `\';\' expected`.'],
    exercises: [
      {
        type: 'predict', q: 'What does this print?',
        code: j`
System.out.print("H   H");
System.out.print("HHHHH");`,
        choices: ['H   HHHHHH', 'H   H\nHHHHH\n', 'H   H HHHHH'], answer: 0,
        why: '`print` never presses Enter and Java never adds a space, so the second piece starts right where the first ended.',
        wrong: { 1: 'That needs `println` on both lines.', 2: 'Java never adds a space between prints on its own.' }
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
System.out.__0__("H   H");
System.out.println("H   H");
System.out.println("__1__");`,
        blanks: ['println', 'HHHHH'], bank: ['println', 'print', 'HHHHH', 'HHHH', 'H   H'],
        why: 'Every row needs its own line, so `println`. The middle row is the crossbar: five H’s.',
        wrong: { print: '`print` doesn’t press Enter, so the next row would continue on the same line.', HHHH: 'Only 4 characters. Each line must be 5.', 'H   H': 'That’s a side row. The third row is the crossbar.' }
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: j`
System.out.println("H   H");
System.out.println("H   H");
System.out.println("HHHHH")
System.out.println("H   H");
System.out.println("H   H");`,
        line: 2,
        fixes: ['Add `;` at the end of the line', 'Change `println` to `print`', 'Add a space after `HHHHH`'], fix: 0,
        errors: ["`';' expected`", '`cannot find symbol`', '`reached end of file while parsing`', 'No error, just wrong output'], error: 0,
        why: "Every statement ends with `;`. Java reports `';' expected` and points right after `(\"HHHHH\")`."
      },
      {
        type: 'pick', q: 'Which line prints a side row correctly (5 characters)? Spaces are shown as ·',
        ws: true,
        choices: ['System.out.println("H   H");', 'System.out.println("H  H");', 'System.out.println("H    H");', 'System.out.println(H   H);'], answer: 0,
        why: 'H + three spaces + H = 5 characters.',
        wrong: { 1: 'Two spaces makes the line only 4 characters wide.', 2: 'Four spaces makes it 6 characters wide.', 3: 'Text must be inside double quotes, otherwise Java thinks `H` is a variable → `cannot find symbol`.' }
      },
      {
        type: 'order', q: 'Put the whole program in order, braces included.',
        lines: ['public class LabProgram {', 'public static void main(String[] args) {', 'System.out.println("H   H");', 'System.out.println("H   H");', 'System.out.println("HHHHH");', 'System.out.println("H   H");', 'System.out.println("H   H");', '}', '}'],
        why: 'Class opens, then main opens, the five rows go inside main, then main closes and the class closes. Every `{` gets a matching `}`.'
      },
      {
        type: 'predict', q: 'Exactly what is printed? Watch the very end.',
        code: j`
System.out.println("H   H");
System.out.print("HHHHH");`,
        choices: ['H   H\nHHHHH', 'H   H\nHHHHH\n', 'H   HHHHHH\n'], answer: 0,
        why: 'The last line uses `print`, so there’s no final ⏎. “Ending with a newline” means the last output must be `println`.',
        wrong: { 1: 'That needs `println` on the last line too.', 2: 'The first line is `println`, so `HHHHH` starts on a new line.' }
      },
      {
        type: 'cold', q: 'Type the missing part from memory.',
        context: tpl.replace('@@0@@', '@@'), accept: [sol], rows: 6
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 2
{
  const sol = j`
starting_num = scnr.nextInt();
multiplier = scnr.nextInt();
int result1 = starting_num * multiplier;
int result2 = result1 * multiplier;
int result3 = result2 * multiplier;
System.out.println(result1 + " " + result2 + " " + result3);`;
  const tpl = j`
import java.util.Scanner;

public class LabProgram {
   public static void main(String[] args) {
      Scanner scnr = new Scanner(System.in);
      int starting_num;
      int multiplier;

      @@0@@
   }
}`;
  PROBLEMS.push({
    id: 2,
    title: 'Multiply three times',
    topic: 'nextInt, compounding, spaces',
    statement: 'Collect two integer inputs and assign them to `starting_num` and `multiplier`. Multiply `starting_num` by `multiplier` and output the result. Repeat two more times, each time multiplying the previous result by `multiplier`. Separate the three products with a space, ending with a newline.',
    samples: [{ input: '2\n5\n', output: '10 50 250\n' }],
    files: [{ name: 'LabProgram.java', code: tpl, note: 'Your template may or may not declare `starting_num` and `multiplier`. If it does, don’t re-type `int`.' }],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'starting_num = scnr.nextInt();', say: 'Grab the first whole number typed (2) and drop it in the `starting_num` box. No `int` in front: the template already built the box.', py: 'starting_num = int(input())' },
      { code: 'multiplier = scnr.nextInt();', say: 'Grab the next number (5).', py: 'multiplier = int(input())' },
      { code: 'int result1 = starting_num * multiplier;', say: '2 × 5 = 10. This is a brand-new box, so it needs `int`.' },
      { code: 'int result2 = result1 * multiplier;', say: 'Compounding: multiply the previous **result**, not the starting number. 10 × 5 = 50.' },
      { code: 'int result3 = result2 * multiplier;', say: '50 × 5 = 250.' },
      { code: 'System.out.println(result1 + " " + result2 + " " + result3);', say: 'Glue the values with `" "` (quote, space, quote) between them. `println` gives the final newline.', py: 'print(result1, result2, result3)' }
    ],
    trace: {
      cols: ['variable', 'value', 'how'],
      rows: [['starting_num', '2', 'first input'], ['multiplier', '5', 'second input'], ['result1', '10', '2 × 5'], ['result2', '50', '10 × 5'], ['result3', '250', '50 × 5']]
    },
    python: {
      java: 'int x = scnr.nextInt();\nSystem.out.println(a + " " + b);',
      py: 'x = int(input())\nprint(a, b)',
      note: 'Python’s `print(a, b)` puts a space between values for you. Java never adds spaces: you glue in `" "` yourself.'
    },
    analogy: 'Like compound interest: each step builds on the last result, so 2 → 10 → 50 → 250.',
    concepts: ['Compounding: each step uses the previous result (2 → 10 → 50 → 250).', 'Put `" "` between values.', '`println` at the end.'],
    mistakes: ['Used `""` (empty) instead of `" "` → `1050`.', 'Printed only two values.', 'Used `print` instead of `println`.', 'Confused why the first result is 10, not 2.'],
    exercises: [
      {
        type: 'predict', q: 'What does this print?',
        code: j`
int result1 = 10;
int result2 = 50;
System.out.println(result1 + "" + result2);`,
        choices: ['1050\n', '10 50\n', '60\n'], answer: 0,
        why: 'Empty quotes `""` add nothing between the numbers. They just switch `+` to gluing, so 10 and 50 stick together. You need `" "` (quote, space, quote).',
        wrong: { 1: 'For a space you need a real space inside the quotes: `" "`.', 2: 'Once a String joins in (left to right), `+` glues instead of adding.' }
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
int result1 = starting_num * multiplier;
int result2 = __0__ * multiplier;
int result3 = result2 * multiplier;
System.out.println(result1 + __1__ + result2 + " " + result3);`,
        blanks: ['result1', '" "'], bank: ['result1', 'starting_num', 'multiplier', '" "', '""'],
        why: 'Each step multiplies the previous result: 2 → 10 → 50 → 250. Between values you need a real space: `" "`.',
        wrong: { starting_num: 'That gives 2 × 5 = 10 again. Compounding means multiplying the previous result.', multiplier: '5 × 5 = 25. That’s not the next step.', '""': 'Empty quotes glue 10 and 50 together: `1050 250`.' }
      },
      {
        type: 'bug', q: 'This compiles and looks right, but the autograder fails it. Why?',
        code: sol.replace('System.out.println', 'System.out.print'),
        line: 5,
        fixes: ['Change `print` to `println`', 'Change `" "` to `""`', 'Add `int` before `starting_num`'], fix: 0,
        errors: ['Compile error: `cannot find symbol`', 'No error, but the output is missing the final newline', 'Runtime crash: `InputMismatchException`'], error: 1,
        why: 'The autograder compares character by character, including the final newline. “Ending with a newline” means the last output is `println`.'
      },
      {
        type: 'bug', q: 'The template already declares `int starting_num;` and `int multiplier;`. What breaks?',
        code: sol.replace('starting_num = scnr', 'int starting_num = scnr'),
        line: 0,
        fixes: ['Remove `int`: the template already declared `starting_num`', 'Change `nextInt` to `nextLine`', 'Rename it to `startingNum`'], fix: 0,
        errors: ['`variable starting_num is already defined in method main(String[])`', '`incompatible types`', 'No error'], error: 0,
        why: 'A variable can only be declared once. The template already has `int starting_num;`, so here you just assign: `starting_num = scnr.nextInt();`. (If your template doesn’t declare it, then you do need `int`.)'
      },
      {
        type: 'order', q: 'Put the lines in order.',
        lines: sol.split('\n'),
        why: 'Read both inputs first (in input order), then each result builds on the one before, then print once at the end.'
      },
      {
        type: 'pick', q: 'With input 2 then 5, what is `result2`?', plain: true,
        choices: ['50', '10', '25', '250'], answer: 0,
        why: '`result1` = 2 × 5 = 10, then `result2` = `result1` × 5 = 50.',
        wrong: { 1: '10 is `result1` (2 × 5).', 2: '25 would be `multiplier * multiplier`.', 3: '250 is `result3`.' }
      },
      {
        type: 'cold', q: 'Type the missing part from memory.',
        context: tpl.replace('@@0@@', '@@'),
        accept: [sol, sol.replace('starting_num = scnr', 'int starting_num = scnr').replace('multiplier = scnr', 'int multiplier = scnr')]
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 3
{
  const sol = j`
guests = scnr.nextInt();
tablesFilled = guests / tableSize;
System.out.println("Tables filled: " + tablesFilled);`;
  const tpl = j`
import java.util.Scanner;

public class LabProgram {
   public static void main(String[] args) {
      Scanner scnr = new Scanner(System.in);
      int tableSize=10, guests, tablesFilled;

      @@0@@
   }
}`;
  PROBLEMS.push({
    id: 3,
    title: 'Wedding tables',
    topic: 'integer division',
    statement: 'Each full table seats 10. Collect one integer input into `guests`. Using integer division, calculate the number of full tables. `tableSize` is declared and initialized; `guests` and `tablesFilled` are declared. Output ending with a newline.',
    samples: [{ input: '340\n', output: 'Tables filled: 34\n' }, { input: '349\n', output: 'Tables filled: 34\n' }],
    files: [{ name: 'LabProgram.java', code: tpl }],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'guests = scnr.nextInt();', say: 'Read the number of guests. No `int` in front: the template already declared `guests`.', py: 'guests = int(input())' },
      { code: 'tablesFilled = guests / tableSize;', say: 'Both are `int`, so `/` chops off the decimal: 349 / 10 = 34 (not 34.9, not 35).', py: 'tables_filled = guests // table_size' },
      { code: 'System.out.println("Tables filled: " + tablesFilled);', say: 'Label text with a space after the colon, then the number. `println` for the final newline.' }
    ],
    trace: {
      note: 'With input 349:',
      cols: ['variable', 'value', 'why'],
      rows: [['tableSize', '10', 'given'], ['guests', '349', 'input'], ['tablesFilled', '34', '349 / 10 = 34.9 → chopped to 34']]
    },
    python: {
      java: 'int tables = 349 / 10;     // 34\ndouble d = 349.0 / 10;    // 34.9',
      py: 'tables = 349 // 10   # 34\nd = 349 / 10         # 34.9',
      note: 'Java’s `/` on two ints works like Python’s `//`. Make one side a double (`349.0`) to keep the decimal.'
    },
    concepts: ['Integer division chops (349 / 10 = 34).', 'Don’t re-declare template variables.'],
    mistakes: ['Used `print` instead of `println`.', 'Re-typed `int guests` → “already defined”.', 'Typo `tabelsFilled` → “cannot find symbol”.'],
    exercises: [
      {
        type: 'predict', q: 'What does this print?',
        code: j`
int guests = 349;
int tableSize = 10;
System.out.println(guests / tableSize);`,
        choices: ['34\n', '34.9\n', '35\n'], answer: 0,
        why: 'Both are `int`, so `/` does integer division and chops off the decimal. It never rounds: 34.9 becomes 34.',
        wrong: { 1: 'You only get decimals if one side is a `double`, like `349.0 / 10`.', 2: 'Integer division chops; it doesn’t round up.' }
      },
      {
        type: 'predict', q: 'Type exactly what this prints (no need to type the newline).',
        code: 'System.out.println("Tables filled: " + 340 / 10);',
        typed: 'Tables filled: 34',
        why: '`/` happens before `+` (like in math), so 340 / 10 = 34 first, then it’s glued onto the text.',
        wrongTyped: 'Check the capital T, the colon, and the single space after it.'
      },
      {
        type: 'bug', q: 'The template already has `int tableSize=10, guests, tablesFilled;`. What breaks?',
        code: sol.replace('guests = scnr', 'int guests = scnr'),
        line: 0,
        fixes: ['Remove `int`: `guests` is already declared', 'Change `nextInt` to `nextLine`', 'Change `/` to `%`'], fix: 0,
        errors: ['`variable guests is already defined in method main(String[])`', '`cannot find symbol`', 'No error'], error: 0,
        why: 'The template declared `guests` already. Declaring it a second time is a compile error. Just assign: `guests = scnr.nextInt();`.'
      },
      {
        type: 'bug', q: 'Find the bug.',
        code: sol.replace('tablesFilled = guests', 'tabelsFilled = guests'),
        line: 1,
        fixes: ['Fix the spelling: `tablesFilled`', 'Add `int` in front', 'Change `/` to `%`'], fix: 0,
        errors: ['`cannot find symbol`', "`';' expected`", 'No error'], error: 0,
        why: 'Java has never heard of `tabelsFilled` (letters swapped), so it says `cannot find symbol`. Names must match exactly, capitals included.'
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
guests = scnr.nextInt();
tablesFilled = guests __0__ tableSize;
System.out.__1__("Tables filled: " + tablesFilled);`,
        blanks: ['/', 'println'], bank: ['/', '%', '*', 'println', 'print'],
        why: 'Integer division `/` counts the full tables. `println` gives the required final newline.',
        wrong: { '%': '`%` gives the remainder (the 9 leftover guests), not the number of full tables.', '*': 'That multiplies: 3490.', print: '`print` leaves off the final newline.' }
      },
      {
        type: 'pick', q: 'The template already has `int tableSize=10, guests, tablesFilled;`. Which line reads the guests correctly?',
        choices: ['guests = scnr.nextInt();', 'int guests = scnr.nextInt();', 'guests = scnr.nextLine();', 'guests = nextInt();'], answer: 0,
        why: 'Already declared, so just assign. `nextInt()` matches an `int` box.',
        wrong: { 1: 'Declaring it again → `variable guests is already defined`.', 2: '`nextLine()` gives a String, but `guests` is an int → incompatible types.', 3: 'You must say which Scanner: `scnr.nextInt()`. On its own it’s `cannot find symbol`.' }
      },
      {
        type: 'cold', q: 'Type the missing part from memory.',
        context: tpl.replace('@@0@@', '@@'), accept: [sol], rows: 4
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 4
{
  const sol = j`
String name = scnr.nextLine();
String age = scnr.nextLine();
String salary = scnr.nextLine();
System.out.println(name + " is " + age + " and makes $" + salary + ".");`;
  PROBLEMS.push({
    id: 4,
    title: 'Name, age, salary',
    topic: 'nextLine, gluing text',
    statement: 'Take a full name, age, and salary as inputs on separate lines. Output a formatted message ending with a newline.',
    samples: [{ input: 'Pat Ford\n35\n60,000\n', output: 'Pat Ford is 35 and makes $60,000.\n' }],
    files: [{ name: 'LabProgram.java', code: SCANNER_MAIN }],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'String name = scnr.nextLine();', say: '`nextLine()` reads the whole line, spaces included: `"Pat Ford"`. (`next()` would only get `"Pat"`.)', py: 'name = input()' },
      { code: 'String age = scnr.nextLine();', say: 'Read the age as a String too. You only print it, never do math with it, so `"35"` is fine.', py: 'age = input()' },
      { code: 'String salary = scnr.nextLine();', say: '`60,000` has a comma, so it can’t be an int. Read it as a String.', py: 'salary = input()' },
      { code: 'System.out.println(name + " is " + age + " and makes $" + salary + ".");', say: 'Glue the pieces. The spaces, the `$` and the final `.` are all inside quotes because Java adds nothing on its own.', py: 'print(name + " is " + age + " and makes $" + salary + ".")' }
    ],
    trace: {
      note: 'How the output gets glued together, piece by piece:',
      cols: ['piece', 'adds'],
      rows: [['name', 'Pat Ford'], ['" is "', '·is·'], ['age', '35'], ['" and makes $"', '·and·makes·$'], ['salary', '60,000'], ['"."', '.']]
    },
    python: {
      java: 'String name = scnr.nextLine();',
      py: 'name = input()',
      note: '`scnr.nextLine()` is Java’s `input()`: it reads one whole line as text.'
    },
    concepts: ['`nextLine()` reads the whole line including spaces.', 'The salary has a comma, so read it as a String.', '`$` and `.` are part of the string.'],
    mistakes: ['Used `scnr.nextString()` (doesn’t exist) → “cannot find symbol”.', '`int age = scnr.nextLine();` → “incompatible types: String cannot be converted to int”.'],
    exercises: [
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
String name = scnr.__0__();
__1__ age = scnr.nextLine();`,
        blanks: ['nextLine', 'String'], bank: ['nextLine', 'next', 'nextString', 'nextInt', 'String', 'int'],
        why: 'A full name has a space, so read the whole line. `nextLine()` always gives back a String, so the box must be `String`.',
        wrong: { next: '`next()` reads one word: you’d only get `Pat`.', nextString: 'There is no `nextString()` → `cannot find symbol`.', nextInt: '`Pat Ford` isn’t a number → `InputMismatchException`.', int: '`nextLine()` gives back a String, which can’t go in an `int` box.' }
      },
      {
        type: 'bug', q: 'Find the bug.',
        code: sol.replace('String age', 'int age'),
        line: 1,
        fixes: ['Change `int` to `String`', 'Change `nextLine` to `next`', 'Add `.toString()`'], fix: 0,
        errors: ['`incompatible types: String cannot be converted to int`', '`cannot find symbol`', '`InputMismatchException` at runtime'], error: 0,
        why: '`nextLine()` hands back a String. It doesn’t fit in an `int` box. Match the box to the grab.'
      },
      {
        type: 'bug', q: 'Find the bug.',
        code: sol.replace('String salary = scnr.nextLine()', 'String salary = scnr.nextString()'),
        line: 2,
        fixes: ['Change `nextString()` to `nextLine()`', 'Change `String` to `int`', 'Remove the `()`'], fix: 0,
        errors: ['`cannot find symbol`', '`incompatible types`', 'No error'], error: 0,
        why: 'Scanner has `next()`, `nextLine()`, `nextInt()` and `nextDouble()`, but no `nextString()`. An unknown method name is `cannot find symbol`.'
      },
      {
        type: 'predict', q: 'What does this print?',
        code: j`
String name = "Pat Ford";
String age = "35";
System.out.println(name + "is" + age);`,
        choices: ['Pat Fordis35\n', 'Pat Ford is 35\n', 'Pat Ford is35\n'], answer: 0,
        why: 'Java never adds spaces. They have to be inside the quotes: `" is "`.',
        wrong: { 1: 'That needs `" is "` with spaces inside the quotes.', 2: 'There’s no space before or after `is` in the quotes.' }
      },
      {
        type: 'pick', q: 'Which line prints exactly `Pat Ford is 35 and makes $60,000.`?',
        choices: [
          'System.out.println(name + " is " + age + " and makes $" + salary + ".");',
          'System.out.println(name + " is " + age + " and makes " + salary + ".");',
          'System.out.println(name + " is " + age + " and makes $" + salary);',
          'System.out.println(name + " is " + age + "and makes $" + salary + ".");'
        ], answer: 0,
        why: 'Every character of the output that isn’t a variable has to be inside quotes: the spaces, the `$`, and the final `.`.',
        wrong: { 1: 'Missing the `$`.', 2: 'Missing the final period.', 3: 'Missing the space before `and`: you’d get `35and`.' }
      },
      {
        type: 'order', q: 'Put the lines in order.',
        lines: sol.split('\n'),
        why: 'Read in the same order as the input (name, age, salary), then print.'
      },
      {
        type: 'cold', q: 'Type the missing part from memory.',
        context: SCANNER_MAIN.replace('@@0@@', '@@'), accept: [sol], rows: 5
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 5
{
  const sol = j`
int num1 = scnr.nextInt();
int num2 = scnr.nextInt();
int num3 = scnr.nextInt();
int sum = num1 + num2 + num3;

if (num1 < 0 || num2 < 0 || num3 < 0) {
   System.out.println("Invalid input!");
}
else if (sum % 3 == 0) {
   System.out.println("" + num1 + num2 + num3 + " is divisible by 3!");
}
else {
   System.out.println("" + num1 + num2 + num3 + " is not divisible by 3!");
}`;
  const chain = sol.split('\n').slice(5);
  PROBLEMS.push({
    id: 5,
    title: 'Divisible by 3',
    topic: 'if / else if, ||, %',
    statement: 'Collect three integer inputs representing the place values of a three-digit number. Determine whether the sum of the digits is divisible by 3. If any integer is negative, output `Invalid input!`. Output a message ending with a newline. Use `println()` for all print statements.',
    samples: [
      { input: '1\n5\n3\n', output: '153 is divisible by 3!\n' },
      { input: '1\n0\n4\n', output: '104 is not divisible by 3!\n' },
      { input: '1\n-5\n3\n', output: 'Invalid input!\n' }
    ],
    files: [{ name: 'LabProgram.java', code: SCANNER_MAIN }],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'int num1 = scnr.nextInt();\nint num2 = scnr.nextInt();\nint num3 = scnr.nextInt();', say: 'Three `nextInt()` calls, one per input line. Any names work: `hundreds`, `tens`, `ones` would be just as good.', py: 'num1 = int(input())\nnum2 = int(input())\nnum3 = int(input())' },
      { code: 'int sum = num1 + num2 + num3;', say: 'All numbers, so `+` adds: 1 + 5 + 3 = 9.' },
      { code: 'if (num1 < 0 || num2 < 0 || num3 < 0) {', say: '`||` means “or”. Check for negatives **first**, so bad input never reaches the divisibility test. No `;` before the `{`.', py: 'if num1 < 0 or num2 < 0 or num3 < 0:' },
      { code: '   System.out.println("Invalid input!");\n}', say: 'Exact text, `!` included. The `}` closes this branch.' },
      { code: 'else if (sum % 3 == 0) {', say: '`%` gives the remainder. Remainder 0 means it divides evenly: 9 % 3 = 0.', py: 'elif sum % 3 == 0:' },
      { code: '   System.out.println("" + num1 + num2 + num3 + " is divisible by 3!");\n}', say: 'The `""` at the front turns `+` into gluing from the start, so the digits come out as `153` instead of being added to 9.' },
      { code: 'else {\n   System.out.println("" + num1 + num2 + num3 + " is not divisible by 3!");\n}', say: 'Anything left over: not divisible. Same gluing trick.', py: 'else:' }
    ],
    trace: {
      cols: ['input', 'sum', 'sum % 3', 'branch', 'output'],
      rows: [['1 5 3', '9', '0', 'else if', '153 is divisible by 3!'], ['1 0 4', '5', '2', 'else', '104 is not divisible by 3!'], ['1 -5 3', '—', '—', 'if (negative)', 'Invalid input!']]
    },
    python: {
      java: 'if (a < 0 || b < 0) {\n   ...\n}\nelse if (s % 3 == 0) {\n   ...\n}\nelse {\n   ...\n}',
      py: 'if a < 0 or b < 0:\n    ...\nelif s % 3 == 0:\n    ...\nelse:\n    ...',
      note: '`||` = `or`, `else if` = `elif`. Java uses `( )` around the condition and `{ }` around the body instead of a colon and indentation.'
    },
    concepts: ['`||` = or.', '`%` = remainder.', 'Check for negatives first.', '`""` at the start makes Java glue the digits (“153”) instead of adding them (9).'],
    mistakes: ['`;` after `else if (...)` → “\'else\' without \'if\'”.', 'Printed `sum` (9) instead of the glued digits.', '`"Invalid input"` missing the `!`.', '`"Invalid number"`: wrong text.', 'Missing closing braces → “reached end of file while parsing”.', 'Was confused by the names hundreds/tens/ones (any names work).'],
    exercises: [
      {
        type: 'predict', q: 'What does this print?',
        code: j`
int num1 = 1;
int num2 = 5;
int num3 = 3;
System.out.println(num1 + num2 + num3 + " is divisible by 3!");`,
        choices: ['9 is divisible by 3!\n', '153 is divisible by 3!\n', '1 5 3 is divisible by 3!\n'], answer: 0,
        why: 'Left to right, 1 + 5 + 3 are all numbers, so they get added (9) before any text shows up. Start with `""` to glue instead: `"" + num1 + num2 + num3`.',
        wrong: { 1: 'That needs `""` at the very front.', 2: 'Java never adds spaces.' }
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
if (num1 < 0 __0__ num2 < 0 __1__ num3 < 0) {
   System.out.println("Invalid input!");
}
else if (sum __2__ 3 == 0) {`,
        blanks: ['||', '||', '%'], bank: ['||', '&&', '%', '/'],
        why: 'Any one negative is enough, so “or” (`||`). Divisible means the remainder (`%`) is 0.',
        wrong: { '&&': '`&&` means “and”: it would only say Invalid when all three are negative.', '/': '`/` divides. `sum / 3 == 0` is only true when sum is 0, 1 or 2.' }
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: chain.join('\n').replace('else if (sum % 3 == 0) {', 'else if (sum % 3 == 0); {'),
        line: 3,
        fixes: ['Remove the `;` after `(sum % 3 == 0)`', 'Add `;` after `else`', 'Change `else if` to `if`'], fix: 0,
        errors: ["`'else' without 'if'`", '`reached end of file while parsing`', 'No error'], error: 0,
        why: 'The `;` ends the else-if right there. The `{ ... }` after it becomes a loose block, so the next `else` has no `if` to belong to.'
      },
      {
        type: 'bug', q: 'This compiles but fails the negative test. Find the bug.',
        code: chain.join('\n').replace('"Invalid input!"', '"Invalid input"'),
        line: 1,
        fixes: ['Add the `!`: `"Invalid input!"`', 'Change `println` to `print`', 'Move the negative check last'], fix: 0,
        errors: ["`';' expected`", 'No error, but the output doesn’t match exactly', '`cannot find symbol`'], error: 1,
        why: 'Text inside quotes is never checked by the compiler. The autograder compares character by character, so a missing `!` fails.'
      },
      {
        type: 'order', q: 'Put the if / else if / else chain in order, braces included.',
        lines: chain,
        why: 'Negative check first, then the divisible test, then the catch-all `else`. Each branch closes with `}` before the next one starts.'
      },
      {
        type: 'predict', q: 'Using the full solution, what prints for this input?',
        code: sol, input: '1\n-5\n3\n',
        choices: ['Invalid input!\n', '1-53 is not divisible by 3!\n', 'Invalid input!'], answer: 0,
        why: '`-5 < 0` makes the first condition true, so only the first branch runs. That’s why the negative check comes first.',
        wrong: { 1: 'That’s what you’d get without the negative check first.', 2: '`println` always ends with a newline.' }
      },
      {
        type: 'predict', q: 'Using the full solution, what prints for this input?',
        code: sol, input: '1\n0\n4\n',
        choices: ['104 is not divisible by 3!\n', '5 is not divisible by 3!\n', '104 is divisible by 3!\n'], answer: 0,
        why: '1 + 0 + 4 = 5, and 5 % 3 = 2 (not 0), so the `else` branch runs. The `""` glues the digits into 104.',
        wrong: { 1: 'The `""` at the front glues the digits instead of adding them.', 2: '5 % 3 is 2, not 0.' }
      },
      {
        type: 'cold', q: 'Type the missing part from memory.',
        context: SCANNER_MAIN.replace('@@0@@', '@@'), accept: [sol], rows: 14
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 6
{
  const sol = j`
String name = scnr.nextLine();
String[] parts = name.split(" ");

if (parts.length == 3) {
   System.out.println(parts[2].charAt(0) + "., " + parts[0] + " " + parts[1].charAt(0) + ".");
}
else {
   System.out.println(parts[1].charAt(0) + "., " + parts[0]);
}`;
  const chain = sol.split('\n').slice(3);
  PROBLEMS.push({
    id: 6,
    title: 'Name initials',
    topic: 'split, arrays, charAt',
    statement: 'Collect a full name as one string input. Output `lastInitial., firstName middleInitial.` If no middle name, output `lastInitial., firstName`.',
    samples: [{ input: 'Pat Silly Doe\n', output: 'D., Pat S.\n' }, { input: 'Julia Clark\n', output: 'C., Julia\n' }],
    files: [{ name: 'LabProgram.java', code: SCANNER_MAIN }],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'String name = scnr.nextLine();', say: 'Read the whole name **once**: `"Pat Silly Doe"`.', py: 'name = input()' },
      { code: 'String[] parts = name.split(" ");', say: 'Chop it at every space into an array: `["Pat", "Silly", "Doe"]`. `String[]` means “array of Strings”.', py: 'parts = name.split(" ")' },
      { code: 'if (parts.length == 3) {', say: '`.length` counts the words. Arrays use `.length` with no parentheses.', py: 'if len(parts) == 3:' },
      { code: '   System.out.println(parts[2].charAt(0) + "., " + parts[0] + " " + parts[1].charAt(0) + ".");\n}', say: '`parts[2]` is `"Doe"`, and `.charAt(0)` is its first letter `D`. Then `"., "`, the first name, a space, the middle initial, and a period. `[ ]` picks from the array, `( )` calls a method.', py: 'print(parts[2][0] + "., " + parts[0] + " " + parts[1][0] + ".")' },
      { code: 'else {\n   System.out.println(parts[1].charAt(0) + "., " + parts[0]);\n}', say: 'Two words: the last name is `parts[1]`. No middle initial and no final period.', py: 'else:\n    print(parts[1][0] + "., " + parts[0])' }
    ],
    trace: {
      note: 'With input `Pat Silly Doe`:',
      cols: ['expression', 'value'],
      rows: [['parts', '["Pat", "Silly", "Doe"]'], ['parts.length', '3'], ['parts[0]', '"Pat"'], ['parts[1].charAt(0)', "'S'"], ['parts[2].charAt(0)', "'D'"], ['output', 'D., Pat S.']]
    },
    python: {
      java: 'String[] parts = name.split(" ");\nparts.length\nparts[2].charAt(0)',
      py: 'parts = name.split(" ")\nlen(parts)\nparts[2][0]',
      note: '`split` works the same. Python’s `len(x)` is `.length` on a Java array, and `word[0]` is `word.charAt(0)`.'
    },
    concepts: ['Read once with `nextLine()`, then `split(" ")` chops it into an array.', '`.length` counts the words.', '`[ ]` picks an array item, `( )` calls a method.', '`charAt(0)` = first letter (a char).'],
    mistakes: ['Read three separate `nextLine()`s.', '`scnr.split(...)` instead of `name.split(...)`.', '`if (parts % 3)` instead of `parts.length == 3`.', '`parts(2)` instead of `parts[2]`.', '`.char[0]` / `.char(0)` instead of `.charAt(0)`.', 'Used `-` instead of `=`.', 'Named two variables `name`.'],
    exercises: [
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
String name = scnr.nextLine();
String[] parts = __0__.split(" ");

if (parts.__1__ == 3) {
   System.out.println(parts[2].__2__ + "., " + parts[0] + " " + parts[1].charAt(0) + ".");
}`,
        blanks: ['name', 'length', 'charAt(0)'], bank: ['name', 'scnr', 'length', 'length()', 'charAt(0)', 'char(0)'],
        why: 'Split the String you read (`name`). Arrays count with `.length`. The first letter is `charAt(0)`.',
        wrong: { scnr: 'You split the String you read, not the Scanner. `scnr.split` → `cannot find symbol`.', 'length()': 'Arrays use `.length` with no parentheses. `length()` is for Strings.', 'char(0)': 'The method is called `charAt(0)`.' }
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: sol.split('\n').slice(0, 6).join('\n').replace('println(parts[2]', 'println(parts(2)'),
        line: 4,
        fixes: ['Use square brackets: `parts[2]`', 'Use `parts.get(2)`', 'Change `charAt(0)` to `charAt[0]`'], fix: 0,
        errors: ['`cannot find symbol`', '`ArrayIndexOutOfBoundsException`', 'No error'], error: 0,
        why: '`[ ]` picks from an array and `( )` calls a method. `parts(2)` makes Java look for a method named `parts`, which doesn’t exist → `cannot find symbol`.'
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: sol.split('\n').slice(0, 6).join('\n').replace('name.split', 'scnr.split'),
        line: 1,
        fixes: ['Split the String: `name.split(" ")`', 'Use `scnr.nextLine().split` twice', 'Change `String[]` to `String`'], fix: 0,
        errors: ['`cannot find symbol`', '`incompatible types`', 'No error'], error: 0,
        why: '`split` belongs to Strings, not to the Scanner. You already read the line into `name`, so split that.'
      },
      {
        type: 'predict', q: 'Using the full solution, what prints for this input?',
        code: sol, input: 'Julia Clark\n',
        choices: ['C., Julia\n', 'C., Julia.\n', 'J., Clark\n'], answer: 0,
        why: 'Two words means the `else` branch: last initial `C`, then `"., "`, then the first name. This branch has no final period.',
        wrong: { 1: 'Only the three-word branch ends with a period.', 2: 'The last name comes first: `parts[1]` is `Clark`.' }
      },
      {
        type: 'pick', q: 'Which gets the first letter of the last name in `Pat Silly Doe`?',
        choices: ['parts[2].charAt(0)', 'parts[2].char(0)', 'parts.charAt(2)', 'parts[3].charAt(0)'], answer: 0,
        why: 'Pick the third word with `parts[2]` (indexes start at 0), then its first letter with `.charAt(0)`.',
        wrong: { 1: 'There’s no method called `char`. It’s `charAt`.', 2: '`parts` is an array, not a String. Pick the word first: `parts[2]`.', 3: 'Indexes start at 0, so the third word is `parts[2]`. `parts[3]` → `ArrayIndexOutOfBoundsException`.' }
      },
      {
        type: 'order', q: 'Put the if / else in order, braces included.',
        lines: chain,
        why: 'Three-word case first, closed with `}`, then the `else` for two words.'
      },
      {
        type: 'predict', q: 'Using the full solution, what prints for this input?',
        code: sol, input: 'Pat Silly Doe\n',
        choices: ['D., Pat S.\n', 'D., Pat S\n', 'D. Pat S.\n'], answer: 0,
        why: 'Last initial, `"., "` (period, comma, space), first name, space, middle initial, period.',
        wrong: { 1: 'The three-word version ends with `"."`.', 2: 'There’s a comma after `D.`.' }
      },
      {
        type: 'cold', q: 'Type the missing part from memory.',
        context: SCANNER_MAIN.replace('@@0@@', '@@'), accept: [sol], rows: 10
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 7
{
  const sol = j`
int sum = 0;
int num = scnr.nextInt();
int smallest = num;

while (num >= 0) {
   sum = sum + num;
   if (num < smallest) {
      smallest = num;
   }
   num = scnr.nextInt();
}

System.out.println("Smallest: " + smallest);
System.out.println("Sum: " + sum);`;
  const loop = sol.split('\n').slice(4, 11);
  PROBLEMS.push({
    id: 7,
    title: 'Smallest and sum',
    topic: 'while loop, sentinel',
    statement: 'Collect any number of non-negative integers and calculate their sum. A negative integer ends input and is not part of the sum. Output the smallest non-negative value and the sum, ending with a newline.',
    samples: [{ input: '15\n20\n0\n3\n-1\n', output: 'Smallest: 0\nSum: 38\n' }],
    files: [{ name: 'LabProgram.java', code: SCANNER_MAIN }],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'int sum = 0;', say: 'Start the running total at 0.', py: 'total = 0' },
      { code: 'int num = scnr.nextInt();\nint smallest = num;', say: 'Read the **first** number before the loop. The first number is the smallest so far.', py: 'num = int(input())\nsmallest = num' },
      { code: 'while (num >= 0) {', say: '`while` is for when you don’t know the count. Keep going as long as the number is non-negative (0 counts).', py: 'while num >= 0:' },
      { code: '   sum = sum + num;', say: 'Add this number to the running total.' },
      { code: '   if (num < smallest) {\n      smallest = num;\n   }', say: 'Found a new smallest? Remember it.' },
      { code: '   num = scnr.nextInt();\n}', say: 'Read the next number at the **bottom** of the loop. Forget this and the loop never ends.', py: '    num = int(input())' },
      { code: 'System.out.println("Smallest: " + smallest);\nSystem.out.println("Sum: " + sum);', say: 'After the loop. Ask “once or every lap?” The answer prints once, so it goes below the closing `}`.' }
    ],
    trace: {
      cols: ['num', 'sum', 'smallest'],
      rows: [['15', '15', '15'], ['20', '35', '15'], ['0', '35', '0'], ['3', '38', '0'], ['-1', 'stop', '']]
    },
    python: {
      java: 'int num = scnr.nextInt();\nwhile (num >= 0) {\n   ...\n   num = scnr.nextInt();\n}',
      py: 'num = int(input())\nwhile num >= 0:\n    ...\n    num = int(input())',
      note: 'Same shape in both: read once before the loop, read again at the bottom of the loop.'
    },
    analogy: 'A sentinel is a stop sign in the input. The loop keeps reading until it sees the stop sign (a negative number), and the stop sign itself is never counted.',
    concepts: ['Read the first number before the loop.', '`while` when you don’t know the count.', 'Read the next number at the bottom of the loop (forget it = infinite loop).', 'Prints go after the loop (“once or every lap?”).'],
    mistakes: ['Brace placement.', 'Prints inside the loop.'],
    exercises: [
      {
        type: 'order', q: 'Put the loop in order, braces included.',
        lines: loop,
        why: 'Loop header, add, check smallest (its own `{ }`), read the next number, then close the loop. The read must be the last thing inside the loop.'
      },
      {
        type: 'bug', q: 'This compiles but gives the wrong answer for the sample input. Find the bug.',
        code: sol.replace('while (num >= 0)', 'while (num > 0)'),
        line: 4,
        fixes: ['Change `>` to `>=`', 'Change `<` to `<=`', 'Start `sum` at 1'], fix: 0,
        errors: ['No error, but it prints `Smallest: 15` and `Sum: 35`', 'Infinite loop', '`cannot find symbol`'], error: 0,
        why: 'Zero is non-negative, so it has to count. With `> 0` the loop stops at the 0 and never sees the 3: sum = 15 + 20 = 35, smallest = 15.'
      },
      {
        type: 'bug', q: 'The output repeats. Tap one of the broken lines.',
        code: j`
int sum = 0;
int num = scnr.nextInt();
int smallest = num;

while (num >= 0) {
   sum = sum + num;
   if (num < smallest) {
      smallest = num;
   }
   num = scnr.nextInt();
   System.out.println("Smallest: " + smallest);
   System.out.println("Sum: " + sum);
}`,
        line: [10, 11],
        fixes: ['Move both `println` lines below the loop’s closing `}`', 'Change `while` to `if`', 'Delete `num = scnr.nextInt();`'], fix: 0,
        errors: ['No error, but it prints Smallest and Sum on every lap', '`reached end of file while parsing`', "`';' expected`"], error: 0,
        why: 'Ask “once or every lap?” The totals should print once, after the loop is finished, so they go after the closing `}`.'
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
while (num __0__ 0) {
   sum = sum + num;
   if (num __1__ smallest) {
      smallest = num;
   }
   num = scnr.__2__();
}`,
        blanks: ['>=', ['<', '<='], 'nextInt'], bank: ['>=', '>', '<', '<=', 'nextInt', 'nextLine'],
        why: 'Keep looping while the number is non-negative (`>= 0`). A smaller number replaces `smallest`. Read the next int at the bottom.',
        wrong: { '0:>': '`> 0` stops at 0, but 0 is non-negative and must count.', '0:<': 'That would loop only on negative numbers.', '1:>': '`>` would track the largest instead.', '1:>=': '`>=` would track the largest instead.', nextLine: '`nextLine()` gives a String, but `num` is an int.' }
      },
      {
        type: 'predict', q: 'Using the full solution, what prints for this input?',
        code: sol, input: '15\n20\n0\n3\n-1\n',
        choices: ['Smallest: 0\nSum: 38\n', 'Smallest: -1\nSum: 37\n', 'Smallest: 15\nSum: 35\n'], answer: 0,
        why: '15 + 20 + 0 + 3 = 38, and the smallest is 0. The -1 only stops the loop.',
        wrong: { 1: 'The negative number ends input and is never added or compared.', 2: 'That’s what `while (num > 0)` would give.' }
      },
      {
        type: 'pick', q: 'You don’t know how many numbers come before the negative one. Which loop fits?', plain: true,
        choices: ['`while (num >= 0) {`', '`for (int i = 0; i < 5; i++) {`', '`if (num >= 0) {`'], answer: 0,
        why: '`while` when you don’t know the count; `for` when you do.',
        wrong: { 1: '`for` is for when you know the count ahead of time.', 2: '`if` runs once. It doesn’t repeat.' }
      },
      {
        type: 'pick', q: 'After the loop handles the 0 (the third number), what are `sum` and `smallest`?', plain: true,
        choices: ['sum = 35, smallest = 0', 'sum = 35, smallest = 15', 'sum = 38, smallest = 0', 'sum = 0, smallest = 0'], answer: 0,
        why: 'From the trace: 15 + 20 + 0 = 35, and 0 is smaller than 15, so `smallest` becomes 0.',
        wrong: { 1: '0 < 15, so `smallest` is updated to 0 on that lap.', 2: 'The 3 hasn’t been added yet. That’s the next lap.', 3: '`sum` keeps the running total. It isn’t reset.' }
      },
      {
        type: 'cold', q: 'Type the missing part from memory.',
        context: SCANNER_MAIN.replace('@@0@@', '@@'), accept: [sol], rows: 14
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 8
{
  const sol = j`
double[] nums = new double[3];
nums[0] = scnr.nextDouble();
nums[1] = scnr.nextDouble();
nums[2] = scnr.nextDouble();

double average = (nums[0] + nums[1] + nums[2]) / 3;

System.out.println("Array items: " + nums[0] + ", " + nums[1] + ", " + nums[2]);
System.out.println("Average: " + average);`;
  PROBLEMS.push({
    id: 8,
    title: 'Array average',
    topic: 'arrays, nextDouble',
    statement: 'Create an array to hold three doubles. Collect the three values as input and store them in the array. Calculate the average. Output the array values and average, ending with a newline.',
    samples: [{ input: '10.0 10.5 11.0\n', output: 'Array items: 10.0, 10.5, 11.0\nAverage: 10.5\n' }],
    files: [{ name: 'LabProgram.java', code: SCANNER_MAIN }],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'double[] nums = new double[3];', say: 'Build an array with 3 slots for doubles. `double[]` means “array of doubles”. Here the 3 is a **count**.', py: 'nums = [0.0] * 3' },
      { code: 'nums[0] = scnr.nextDouble();\nnums[1] = scnr.nextDouble();\nnums[2] = scnr.nextDouble();', say: 'Fill the slots. Inside `[ ]` the number is now a **position**, starting at 0, so the last slot is 2. `nextDouble()` takes nothing in its parentheses.', py: 'nums[0] = float(input())' },
      { code: 'double average = (nums[0] + nums[1] + nums[2]) / 3;', say: 'Parentheses first, so all three are added before dividing. Without them only `nums[2]` would be divided by 3.' },
      { code: 'System.out.println("Array items: " + nums[0] + ", " + nums[1] + ", " + nums[2]);', say: 'Glue `", "` (comma, space) between the values. Doubles always print with a decimal point: `10.0`.' },
      { code: 'System.out.println("Average: " + average);', say: 'Second line, `println` for the final newline.' }
    ],
    trace: {
      cols: ['expression', 'value'],
      rows: [['nums[0]', '10.0'], ['nums[1]', '10.5'], ['nums[2]', '11.0'], ['nums[0] + nums[1] + nums[2]', '31.5'], ['average', '31.5 / 3 = 10.5']]
    },
    python: {
      java: 'double[] nums = new double[3];\nnums[0] = 10.0;',
      py: 'nums = [0.0] * 3\nnums[0] = 10.0',
      note: 'A Java array is like a Python list with a fixed size and a single type. You can’t append to it; you fill the slots you built.'
    },
    analogy: 'An egg carton. `new double[3]` buys a carton with 3 cups. The cups are labeled 0, 1, 2, so `nums[2]` is the last cup.',
    concepts: ['`double[]` = array of doubles.', '`new double[3]` builds 3 slots.', 'The 3 in `new double[3]` is a count, but `nums[0]` is a position, so the indexes are 0, 1, 2.', 'Parentheses before `/ 3`.', '`", "` between values.'],
    mistakes: ['Capitalized `Double`.', 'Wrong label `"Array is: "`.', 'No `", "` separators → `10.010.511.0`.', 'Thought the 3 went in `nextDouble(3)`.'],
    exercises: [
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
double[] nums = new double[__0__];
nums[0] = scnr.nextDouble();
nums[1] = scnr.nextDouble();
nums[__1__] = scnr.nextDouble();`,
        blanks: ['3', '2'], bank: ['3', '2', '1', '0'],
        why: 'In `new double[3]` the number is a count: 3 slots. In `nums[2]` it’s a position: the third slot, because counting starts at 0.',
        wrong: { '0:2': '`new double[2]` builds only 2 slots. This number is a count.', '1:3': 'Positions go 0, 1, 2. `nums[3]` would be a 4th slot that doesn’t exist → `ArrayIndexOutOfBoundsException`.' }
      },
      {
        type: 'predict', q: 'What does this print?',
        code: j`
double[] nums = new double[3];
nums[0] = 10.0;
nums[1] = 10.5;
nums[2] = 11.0;
System.out.println("Array items: " + nums[0] + nums[1] + nums[2]);`,
        choices: ['Array items: 10.010.511.0\n', 'Array items: 10.0, 10.5, 11.0\n', 'Array items: 31.5\n'], answer: 0,
        why: 'After the text, every `+` glues. Without `", "` in between, the numbers run together.',
        wrong: { 1: 'That needs `+ ", " +` between each value.', 2: 'The text came first, so `+` glues instead of adding.' }
      },
      {
        type: 'pick', q: 'Which line calculates the average correctly?',
        choices: [
          'double average = (nums[0] + nums[1] + nums[2]) / 3;',
          'double average = nums[0] + nums[1] + nums[2] / 3;',
          'double average = (nums[0] + nums[1] + nums[2]) / 2;',
          'int average = (nums[0] + nums[1] + nums[2]) / 3;'
        ], answer: 0,
        why: 'Add all three inside parentheses, then divide by how many there are.',
        wrong: { 1: 'Division happens before addition, so only `nums[2]` gets divided by 3.', 2: 'There are 3 values, so divide by 3.', 3: 'The sum is a double. It won’t fit in an `int` box → `incompatible types: possible lossy conversion from double to int`.' }
      },
      {
        type: 'bug', q: 'This compiles but fails the test. Find the bug.',
        code: sol.replace('"Array items: "', '"Array is: "'),
        line: 7,
        fixes: ['Change the label to `"Array items: "`', 'Change `println` to `print`', 'Add `.0` to each value'], fix: 0,
        errors: ['No error, but the output doesn’t match', '`cannot find symbol`', "`';' expected`"], error: 0,
        why: 'The compiler never checks text inside quotes. Copy output labels exactly from the instructions.'
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: sol.split('\n').slice(0, 4).join('\n').replace('nums[0] = scnr.nextDouble();', 'nums[0] = scnr.nextDouble(3);'),
        line: 1,
        fixes: ['Remove the 3: `scnr.nextDouble()`', 'Change it to `nextDouble[3]`', 'Change it to `nextInt(3)`'], fix: 0,
        errors: ['Won’t compile: `nextDouble()` takes nothing in its parentheses', 'Reads 3 numbers at once', 'No error'], error: 0,
        why: 'The 3 belongs in `new double[3]` (how many slots). Each `nextDouble()` reads one number and takes nothing in its parentheses.'
      },
      {
        type: 'order', q: 'Put the lines in order.',
        lines: sol.split('\n').filter(Boolean),
        why: 'Build the array, fill slots 0, 1, 2 in input order, calculate, then print both lines.'
      },
      {
        type: 'pick', q: 'In `new double[3]`, what does the 3 mean?', plain: true,
        choices: ['How many slots (a count)', 'The last index', 'The first value', 'Which slot to fill'], answer: 0,
        why: 'In `new double[3]` it’s a count: 3 slots. In `nums[2]` the number is a position. That’s why the slots are 0, 1, 2.',
        wrong: { 1: 'The last index is 2 (one less than the count).', 2: 'New array slots start out as 0.0. The 3 is not a value.', 3: 'That’s the number in `nums[...]` when you use the array, not when you build it.' }
      },
      {
        type: 'predict', q: 'Using the full solution, what prints for this input?',
        code: sol, input: '10.0 10.5 11.0\n',
        choices: ['Array items: 10.0, 10.5, 11.0\nAverage: 10.5\n', 'Array items: 10.0, 10.5, 11.0\nAverage: 10.5', 'Array items: 10, 10.5, 11\nAverage: 10.5\n'], answer: 0,
        why: 'Doubles always print with a decimal point (`10.0`, not `10`), and both lines use `println`.',
        wrong: { 1: 'The last line is `println`, so the output ends with a newline.', 2: 'Doubles print with at least one decimal place: `10.0`.' }
      },
      {
        type: 'cold', q: 'Type the missing part from memory.',
        context: SCANNER_MAIN.replace('@@0@@', '@@'), accept: [sol], rows: 10
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 9
{
  const sol = j`
public static boolean showResults(Random rand) {
   int num = rand.nextInt(2);
   if (num == 1) {
      return true;
   }
   else {
      return false;
   }
}

// inside main:
int times = scnr.nextInt();
for (int i = 0; i < times; i++) {
   System.out.println(showResults(rand));
}`;
  const method = sol.split('\n').slice(0, 9).join('\n');
  const mainPart = sol.split('\n').slice(11).join('\n');
  const tpl = j`
import java.util.Scanner;
import java.util.Random;

public class LabProgram {

   @@0@@

   public static void main(String[] args) {
      Scanner scnr = new Scanner(System.in);
      Random rand = new Random(2);

      @@1@@
   }
}`;
  PROBLEMS.push({
    id: 9,
    title: 'showResults with Random',
    topic: 'methods, Random, for loop',
    statement: 'Define a method named `showResults` with one parameter referencing a Random object `rand`. It generates a random integer 0 or 1 using `rand`. If 1, return true; if 0, return false. In `main()`, `rand` already has a seed of 2. Collect one integer (> 0). Use a loop to call `showResults()` that many times. Output each returned Boolean on its own line, ending with a newline.',
    samples: [{ input: '3\n', output: 'true\nfalse\ntrue\n' }],
    files: [{ name: 'LabProgram.java', code: tpl }],
    verifyTemplate: true,
    fill: [method, mainPart],
    solution: sol,
    steps: [
      { code: 'public static boolean showResults(Random rand) {', say: 'The header: `public static` + return type `boolean` (it hands back true/false) + the name + the parameter. `Random rand` is a mailbox slot: main drops its Random object in.', py: 'def show_results(rand):' },
      { code: '   int num = rand.nextInt(2);', say: '`nextInt(2)` gives 0 or 1. The upper bound (2) is never included.', py: '    num = rand.randint(0, 1)' },
      { code: '   if (num == 1) {\n      return true;\n   }\n   else {\n      return false;\n   }\n}', say: '`==` compares. 1 → hand back `true`, otherwise `false`. `return` ends the method right there.' },
      { code: 'int times = scnr.nextInt();', say: 'In main: how many times to call it.', py: 'times = int(input())' },
      { code: 'for (int i = 0; i < times; i++) {', say: 'Three parts separated by **semicolons**: start `i` at 0; keep going while `i < times`; add 1 each lap. `i` is a counter the loop makes for itself. Use `for` when you know the count.', py: 'for i in range(times):' },
      { code: '   System.out.println(showResults(rand));\n}', say: 'Call the method (passing `rand` in) and print what it hands back, one per line.', py: '    print(show_results(rand))' }
    ],
    trace: {
      note: 'With input 3 and seed 2:',
      cols: ['i', 'i < times?', 'showResults(rand)', 'printed'],
      rows: [['0', 'yes', 'true', 'true'], ['1', 'yes', 'false', 'false'], ['2', 'yes', 'true', 'true'], ['3', 'no', '—', '(loop ends)']]
    },
    python: {
      java: 'public static boolean showResults(Random rand) {\n   ...\n}',
      py: 'def show_results(rand):\n    ...',
      note: 'Java headers state the return type (`boolean`) and each parameter’s type (`Random rand`). Java prints booleans lowercase (`true`), Python capitalizes (`True`).'
    },
    analogy: 'A seed is like shuffling a deck exactly the same way every time. `new Random(2)` always deals the same sequence, which is why the expected output is always true, false, true.',
    concepts: ['Method header anatomy: `public static` + return type `boolean` + name + parameters.', '`import java.util.Random;`', '`nextInt(2)` returns 0 or 1 (upper bound excluded).', 'A seed makes the output repeatable.', '`for` loop parts are separated by semicolons; `i` is a counter the loop makes itself.', '`for` when you know the count, `while` when you don’t.'],
    mistakes: ['Thought `||` could separate for-loop parts.', 'Asked where `showResults` comes from (you write it).', 'Thought `nextInt(2)` gave 1 or 2.'],
    exercises: [
      {
        type: 'header', q: 'Which header is correct for `showResults`?',
        choices: ['public static boolean showResults(Random rand) {', 'public static void showResults(Random rand) {', 'public static boolean showResults(rand) {', 'public static boolean showResults(Random rand);'], answer: 0,
        why: 'It hands back true/false, so `boolean`. The parameter needs its type: `Random rand`. Headers open `{`.',
        wrong: { 1: '`void` means it hands back nothing, but this method must return true or false.', 2: 'Each parameter needs its type: `Random rand`.', 3: 'Method headers never end in `;`. They open `{ }`.' }
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
int times = scnr.nextInt();
for (int i = 0__0__ i < times__1__ i++) {
   System.out.println(showResults(rand));
}`,
        blanks: [';', ';'], bank: [';', '||', ',', '&&'],
        why: 'The three parts of a `for` are separated by semicolons: start; keep-going test; step.',
        wrong: { '||': '`||` means “or”. It doesn’t separate the parts of a `for`.', ',': 'Commas don’t separate the parts of a `for` loop. Semicolons do.', '&&': '`&&` means “and”, not a separator.' }
      },
      {
        type: 'pick', q: 'What can `rand.nextInt(2)` give back?', plain: true,
        choices: ['0 or 1', '1 or 2', '0, 1 or 2', 'Any whole number'], answer: 0,
        why: '`nextInt(n)` gives 0 up to n − 1. For 1–6 you’d write `rand.nextInt(6) + 1`.',
        wrong: { 1: 'It starts at 0, and the upper bound (2) is never included.', 2: 'The 2 itself is excluded.', 3: 'The 2 caps it: 0 up to 1.' }
      },
      {
        type: 'predict', q: 'Using the full solution with seed 2, what prints for this input?',
        code: sol, input: '3\n',
        choices: ['true\nfalse\ntrue\n', 'true false true\n', '1\n0\n1\n'], answer: 0,
        why: 'Three calls, each printed with its own `println`. Seed 2 always gives this sequence.',
        wrong: { 1: 'Each call has its own `println`, so each value goes on its own line.', 2: 'The method returns a boolean, and booleans print as `true` or `false`.' }
      },
      {
        type: 'order', q: 'Put the method in order, braces included.',
        lines: method.split('\n'),
        why: 'Header, get the random number, then if/else with a `return` in each branch, then close the method.'
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: mainPart.replace('for (int i = 0; i < times; i++)', 'for (int i = 0 || i < times || i++)'),
        line: 1,
        fixes: ['Use semicolons: `for (int i = 0; i < times; i++)`', 'Use commas instead', 'Change `for` to `while`'], fix: 0,
        errors: ['Won’t compile: the three parts of a `for` need `;` between them', 'It runs only once', 'No error'], error: 0,
        why: '`||` means “or” inside a condition. A `for` header is three separate parts, and only `;` separates them.'
      },
      {
        type: 'pick', q: 'You know you’ll call `showResults()` exactly `times` times. Which loop fits best?', plain: true,
        choices: ['`for`, because you know the count', '`while`, because you don’t know the count', '`if`, because it only needs to run once'], answer: 0,
        why: '`for` when you know how many times; `while` when you’re waiting for something (like a negative number).',
        wrong: { 1: 'Here you do know the count: it’s `times`.', 2: '`if` never repeats.' }
      },
      {
        type: 'cold', q: 'Type the whole `showResults` method from memory.',
        accept: [method, j`
public static boolean showResults(Random rand) {
   return rand.nextInt(2) == 1;
}`],
        why: 'The short version `return rand.nextInt(2) == 1;` is also accepted. It does the same thing.', rows: 9
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 10
{
  const sol = j`
String name;
int age;

name = scnr.next();
age = scnr.nextInt();
customer1.setName(name);
customer1.setAge(age);

name = scnr.next();
age = scnr.nextInt();
customer2.setName(name);
customer2.setAge(age);

System.out.println("Customer that is older:");   // given
if (customer1.getAge() > customer2.getAge()) {
   customer1.printInfo();
}
else {
   customer2.printInfo();
}`;
  const lines = sol.split('\n');
  const reads = lines.slice(0, 12).join('\n');
  const compare = lines.slice(14).join('\n');
  const tpl = j`
import java.util.Scanner;

public class CustomerAge {
   public static void main(String[] args) {
      Scanner scnr = new Scanner(System.in);
      Customer customer1 = new Customer();
      Customer customer2 = new Customer();

      @@0@@

      System.out.println("Customer that is older:");
      @@1@@
   }
}`;
  PROBLEMS.push({
    id: 10,
    title: 'Customer age',
    topic: 'using an existing class',
    statement: 'An existing class `Customer` is in `Customer.java`. In `main()` of `CustomerAge.java`, accept one string and one integer for each customer’s name and age. Use the existing `customer1` and `customer2` variables to set name and age with `setName()` and `setAge()`. Determine the older customer with `getAge()`. Output the older customer’s info with `printInfo()`, ending with a newline.',
    samples: [{ input: 'Jane\n25\nJohn\n29\n', output: 'Customer that is older:\nName: John\nAge: 29\n' }],
    files: [
      { name: 'CustomerAge.java', code: tpl, placeholder: '// TODO', note: 'The real template has TODO comments for each step.' },
      { name: 'Customer.java', summary: 'Given, don’t change it.\n\n- private fields `name` and `age`\n- `getName()`, `setName(String name)`, `getAge()`, `setAge(int age)`, using `this.`\n- `printInfo()` prints `Name: ...` and `Age: ...` on two lines' }
    ],
    fill: [reads, compare],
    solution: sol,
    steps: [
      { code: 'String name;\nint age;', say: 'Two empty boxes used as a pass-through tray. You reuse them for both customers.' },
      { code: 'name = scnr.next();\nage = scnr.nextInt();', say: 'One word, then a whole number, in the same order as the input. Reading the age first would crash (`InputMismatchException`).', py: 'name = input()\nage = int(input())' },
      { code: 'customer1.setName(name);\ncustomer1.setAge(age);', say: '`object.method(value)`: hand the value to the setter, which puts it into the object’s locked safe. No `=` here.', py: 'customer1.set_name(name)\ncustomer1.set_age(age)' },
      { code: 'name = scnr.next();\nage = scnr.nextInt();\ncustomer2.setName(name);\ncustomer2.setAge(age);', say: 'Same tray, refilled for the second customer.' },
      { code: 'if (customer1.getAge() > customer2.getAge()) {', say: 'The getter reads the age back out. Methods always need `()`, even when empty.', py: 'if customer1.get_age() > customer2.get_age():' },
      { code: '   customer1.printInfo();\n}\nelse {\n   customer2.printInfo();\n}', say: '`printInfo()` is a homemade method in `Customer.java`, not built into Java. It prints the `Name:` and `Age:` lines for you.' }
    ],
    trace: {
      cols: ['step', 'name', 'age', 'effect'],
      rows: [['read 1', 'Jane', '25', 'customer1 = Jane, 25'], ['read 2', 'John', '29', 'customer2 = John, 29'], ['compare', '', '', '25 > 29 is false'], ['else', '', '', 'customer2.printInfo()']]
    },
    python: {
      java: 'customer1.setName(name);\nif (customer1.getAge() > customer2.getAge()) {',
      py: 'customer1.set_name(name)\nif customer1.get_age() > customer2.get_age():',
      note: 'Calling a method on an object looks the same in both: object, dot, method name, parentheses.'
    },
    analogy: '`Customer` is a blueprint; `customer1` and `customer2` are two houses built from it. Their `name` and `age` are locked safes: `setName` puts a value in, `getAge` reads one out.',
    concepts: ['`Customer` is a type you can use like String.', '`object.method(value)`, with no `=`.', 'name/age are a pass-through tray reused for both customers.', 'Read order must match input order.', 'Methods always need `()`.', '`printInfo` is a homemade method, not built in.'],
    mistakes: ['`customer1 = scnr.next();` → “String cannot be converted to Customer”.', '`customer1.setName(age)` → “int cannot be converted to String”.', '`customer2.getAge` without `()`.', '`getInfo()` instead of `printInfo()`.', 'Read age before name → `InputMismatchException` at runtime.'],
    exercises: [
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: lines.slice(0, 7).join('\n').replace('customer1.setName(name);', 'customer1 = scnr.next();'),
        line: 5,
        fixes: ['Use the setter: `customer1.setName(name);`', 'Change it to `customer1 = name;`', 'Declare `String customer1;`'], fix: 0,
        errors: ['`incompatible types: String cannot be converted to Customer`', '`cannot find symbol`', 'No error'], error: 0,
        why: '`customer1` is a whole Customer object (the house), not a String. You put the name **into** it with the setter.'
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: lines.slice(0, 7).join('\n').replace('customer1.setName(name);', 'customer1.setName(age);'),
        line: 5,
        fixes: ['Pass the name: `customer1.setName(name);`', 'Change `int age` to `String age`', 'Use `customer1.setAge(name);`'], fix: 0,
        errors: ['`incompatible types: int cannot be converted to String`', '`cannot find symbol`', 'No error'], error: 0,
        why: '`setName` takes a String. `age` is an int, so it doesn’t fit the slot.'
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: compare.replace('customer1.getAge()', 'customer1.getAge'),
        line: 0,
        fixes: ['Add parentheses: `customer1.getAge()`', 'Change `>` to `>=`', 'Use `customer1.age`'], fix: 0,
        errors: ['`cannot find symbol`', "`';' expected`", 'No error'], error: 0,
        why: 'Without `()` Java looks for a variable named `getAge`, and there isn’t one. Methods always need `()`.'
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
customer1.__0__(name);
customer1.setAge(age);

if (customer1.__1__ > customer2.getAge()) {
   customer1.__2__;
}
else {
   customer2.printInfo();
}`,
        blanks: ['setName', 'getAge()', 'printInfo()'], bank: ['setName', 'getName', 'getAge()', 'getAge', 'printInfo()', 'getInfo()'],
        why: 'Setters put values in, getters read them out, and `printInfo()` prints. Every method call has `()`.',
        wrong: { getName: '`getName` reads the name out. Here you’re putting it in.', getAge: 'Methods always need `()`. Without them it’s `cannot find symbol`.', 'getInfo()': 'The method in `Customer.java` is `printInfo()`. Copy method names exactly.' }
      },
      {
        type: 'pick', q: 'The input starts with `Jane`. What happens if your first read is `age = scnr.nextInt();`?', plain: true,
        choices: ['It crashes while running: `InputMismatchException`', 'It won’t compile', '`age` becomes 0', 'It skips Jane and reads 25'], answer: 0,
        why: '`nextInt()` finds `Jane`, which isn’t a number, and the program crashes at runtime. Read in the exact order of the input.',
        wrong: { 1: 'The code is valid Java. The problem only shows up when it runs.', 2: 'Scanner doesn’t substitute 0. It throws an exception.', 3: 'Scanner never skips input on its own.' }
      },
      {
        type: 'order', q: 'Put the comparison in order, braces included.',
        lines: compare.split('\n'),
        why: 'Compare with the getters, print customer1 if it’s older, otherwise customer2.'
      },
      {
        type: 'predict', q: 'Using the full solution, what prints for this input?',
        code: sol, input: 'Jane\n25\nJohn\n29\n',
        choices: ['Customer that is older:\nName: John\nAge: 29\n', 'Customer that is older:\nName: Jane\nAge: 25\n', 'Name: John\nAge: 29\n'], answer: 0,
        why: '25 > 29 is false, so the `else` runs and prints customer2: John, 29. The heading line comes first.',
        wrong: { 1: '25 > 29 is false, so it’s the `else` branch (customer2).', 2: 'The heading line is printed first. It’s given in the template.' }
      },
      {
        type: 'cold', q: 'Type the comparison from memory.',
        context: 'System.out.println("Customer that is older:");\n@@', accept: [compare], rows: 6
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 11
{
  const sol = j`
public class Debt {
    private double debtRatio;

    private void calculateDR(double totalDebt, double totalAssets) {
        debtRatio = totalDebt / totalAssets;
    }

    public double getDR() {
        return debtRatio;
    }

    public void setDR(double totalDebt, double totalAssets) {
        calculateDR(totalDebt, totalAssets);
    }
}`;
  PROBLEMS.push({
    id: 11,
    title: 'Debt ratio',
    topic: 'building a class, private helper',
    statement: 'Debt ratio = Total Debt / Total Assets. `DebtMeasure.java` (given) reads `totalDebt` and `totalAssets`, passes them to the Debt object’s `setDR()`, and prints using `getDR()`. Write the `Debt` class in `Debt.java`:\n\n- `debtRatio`: private field of type double\n- `calculateDR`: a private helper method with two double parameters `totalDebt` and `totalAssets`; calculates the ratio and assigns it to `debtRatio`. Signature: `private void calculateDR(double totalDebt, double totalAssets)`\n- `getDR`: public accessor returning `debtRatio`\n- `setDR`: public mutator that passes `totalDebt` and `totalAssets` to the Debt class',
    samples: [{ input: '250000\n300000\n', output: "The Company's total debt is in the amount of $250,000.00, and total assets are in the amount of $300,000.00, which gives a debt ratio of 0.83.\n" }],
    files: [
      { name: 'Debt.java', code: '@@0@@', placeholder: '// Write the Debt class here.' },
      {
        name: 'DebtMeasure.java', summary: 'Given. Its main reads `totalDebt` and `totalAssets`, creates `debt1`, then:',
        snippet: j`
debt1.setDR(totalDebt, totalAssets);
System.out.printf("...%,.2f...%,.2f...%.2f.\n", totalDebt, totalAssets, debt1.getDR());`
      }
    ],
    fill: [sol],
    solution: sol,
    steps: [
      { code: 'public class Debt {', say: 'The blueprint. The class name matches the file name: `Debt.java`.', py: 'class Debt:' },
      { code: '    private double debtRatio;', say: 'A field: a box inside the class but outside every method. `private` = locked safe; only Debt’s own methods can touch it.' },
      { code: '    private void calculateDR(double totalDebt, double totalAssets) {\n        debtRatio = totalDebt / totalAssets;\n    }', say: 'The private helper. Copy the given signature exactly. `void` because nobody uses a result from it: it stores the answer in the field.', py: '    def _calculate_dr(self, total_debt, total_assets):\n        self.debt_ratio = total_debt / total_assets' },
      { code: '    public double getDR() {\n        return debtRatio;\n    }', say: 'The accessor (getter). main prints its result, so it returns a `double`. Empty `()`.' },
      { code: '    public void setDR(double totalDebt, double totalAssets) {\n        calculateDR(totalDebt, totalAssets);\n    }', say: 'The mutator (setter). main calls this on its own line, so `void`. It passes both values to the helper. Inside the class you call your own method by name, with no `debt1.` in front.' },
      { code: '}', say: 'Close the class. A missing `}` gives `reached end of file while parsing`.' }
    ],
    trace: {
      note: 'With input 250000 and 300000:',
      cols: ['call', 'what happens'],
      rows: [['debt1.setDR(250000.0, 300000.0)', 'calls calculateDR(250000.0, 300000.0)'], ['calculateDR(...)', 'debtRatio = 250000.0 / 300000.0 = 0.8333…'], ['debt1.getDR()', 'returns 0.8333…'], ['printf %.2f', 'prints 0.83'], ['printf %,.2f', 'prints 250,000.00 and 300,000.00']]
    },
    python: {
      java: 'private void calculateDR(double totalDebt, double totalAssets) {\n    debtRatio = totalDebt / totalAssets;\n}',
      py: 'def _calculate_dr(self, total_debt, total_assets):\n    self.debt_ratio = total_debt / total_assets',
      note: 'Python has no real `private`; a leading `_` is just a hint. Java enforces `private`. Inside a Java method you use the field directly, without `self.`.'
    },
    analogy: 'Private helper = the cook in the kitchen. Setter = the waiter. main (the customer) only talks to the waiter (`setDR`), and the waiter passes the order to the cook (`calculateDR`).',
    concepts: ['Field = a box inside the class but outside the methods.', '“Private helper” means another method in the class calls it (usually the setter).', 'Inside the class, call your own methods without `debt1.`.', 'Return type rule: if main uses the result (prints, compares, stores) it returns a type; if the call stands alone on its line it’s `void`.', 'printf `%.2f` = 2 decimal places, `%,.2f` adds commas, and printf needs `\\n` for a newline.'],
    mistakes: ['`pricate` typo: two errors from one typo (“<identifier> expected” and “cannot find symbol: class pricate”).', '`double` instead of `void` on calculateDR.', 'Method headers ending in `;` (`public getDR();`).', 'Missing return type.', 'Missing `}` → “reached end of file while parsing”.', 'Didn’t know setDR should call calculateDR.'],
    exercises: [
      {
        type: 'header', q: 'Which header is correct for `calculateDR`?',
        choices: ['private void calculateDR(double totalDebt, double totalAssets) {', 'private double calculateDR(double totalDebt, double totalAssets) {', 'private void calculateDR(double totalDebt, double totalAssets);', 'private void calculateDR(totalDebt, totalAssets) {'], answer: 0,
        why: 'Copy the given signature and add `{`. It stores the result in the field, so it hands nothing back: `void`.',
        wrong: { 1: 'Nothing uses a result from it: its call stands alone inside `setDR`. And the exam gives you the signature with `void`, so copy it exactly.', 2: 'Method headers never end in `;`.', 3: 'Each parameter needs its type: `double totalDebt`.' }
      },
      {
        type: 'header', q: 'Which header is correct for `getDR`?',
        choices: ['public double getDR() {', 'public getDR() {', 'public void getDR() {', 'public double getDR();'], answer: 0,
        why: 'main prints the result, so it returns the box’s type, `double`. Getters have empty `()`.',
        wrong: { 1: 'Missing the return type. Every method header needs one → `invalid method declaration; return type required`.', 2: 'main prints the result, so it must return a `double`, not `void`.', 3: 'Headers never end in `;`.' }
      },
      {
        type: 'fill', q: 'Fill in the blank.',
        code: j`
public void setDR(double totalDebt, double totalAssets) {
    __0__(totalDebt, totalAssets);
}`,
        blanks: ['calculateDR'], bank: ['calculateDR', 'debt1.calculateDR', 'getDR', 'return calculateDR'],
        why: 'The setter passes the order to the private helper. Inside the class you call your own methods by name.',
        wrong: { 'debt1.calculateDR': '`debt1` only exists in main. Inside the class, call your own methods by name.', getDR: '`getDR` reads the ratio. It doesn’t calculate it.', 'return calculateDR': '`setDR` is `void` and `calculateDR` returns nothing, so there’s nothing to return.' }
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: sol.replace('private double debtRatio', 'pricate double debtRatio'),
        line: 1,
        fixes: ['Fix the typo: `private`', 'Add `;` at the end', 'Remove `double`'], fix: 0,
        errors: ['`<identifier> expected` (plus `cannot find symbol: class pricate`)', '`reached end of file while parsing`', 'No error'], error: 0,
        why: 'One typo, two errors. Java doesn’t know the word `pricate`, gets confused, and reports both. Fix the first error first; the others often vanish.'
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: sol.replace('public double getDR() {', 'public double getDR(); {'),
        line: 7,
        fixes: ['Remove the `;` after `getDR()`', 'Change `double` to `void`', 'Add `static`'], fix: 0,
        errors: ['Won’t compile: a header followed by `;` has no body', 'No error', '`InputMismatchException`'], error: 0,
        why: 'Method headers never end in `;`. The `;` cuts the header off from its `{ }` body.'
      },
      {
        type: 'order', q: 'Put the class in order, braces included.',
        lines: sol.split('\n').filter(Boolean),
        why: 'Class opens, field first, then each method with its own `{ }`, then the class closes. This order matches the instructions.'
      },
      {
        type: 'pick', q: 'In the given printf, what does `%,.2f` turn 250000.0 into?', plain: true,
        choices: ['250,000.00', '250000.00', '250,000', '0.83'], answer: 0,
        why: '`.2f` means 2 decimal places, and the `,` adds thousands commas. That’s the `$250,000.00` in the expected output.',
        wrong: { 1: 'The `,` in `%,.2f` adds the commas.', 2: '`.2f` always shows 2 decimal places.', 3: '0.83 is the ratio, printed by the plain `%.2f`.' }
      },
      {
        type: 'cold', q: 'Type the whole Debt class from memory.',
        accept: [sol], rows: 15
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 12
{
  const sol = j`
public class Pet {
   private String name;
   private String type;
   private int age;

   public Pet() {
      name = "unknown";
      type = "unknown";
      age = 0;
   }

   public Pet(String name, String type, int age) {
      this.name = name;
      this.type = type;
      this.age = age;
   }

   public String getName() { return name; }
   public String getType() { return type; }
   public int getAge() { return age; }

   public void setName(String name) { this.name = name; }
   public void setType(String type) { this.type = type; }
   public void setAge(int age) { this.age = age; }
}`;
  const lines = sol.split('\n');
  const body = lines.slice(1, -1).map(l => l.replace(/^   /, '')).join('\n');
  const ctors = lines.slice(5, 16).map(l => l.trim()).filter(Boolean);
  PROBLEMS.push({
    id: 12,
    title: 'Pet class',
    topic: 'constructors, this',
    statement: 'Write `Pet.java` with:\n\n- Fields: `name` (String), `type` (String), `age` (int)\n- No-arg constructor `Pet()`: assigns "unknown" to name, "unknown" to type, 0 to age\n- Overloaded constructor with two String parameters (name, type) and one int (age), assigning them to the fields\n- Mutators `setName`, `setType`, `setAge`; accessors `getName`, `getType`, `getAge`',
    samples: [{ input: 'Max\nBulldog\n3\nLeo\nBoston-Terrier\n6\n', output: 'Name: unknown\nType: unknown\nAge: 0\n\nName: Max\nType: Bulldog\nAge: 3\n\nName: Leo\nType: Boston-Terrier\nAge: 6\n' }],
    files: [
      { name: 'Pet.java', code: 'public class Pet {\n   @@0@@\n}', placeholder: '// TODO: fields, constructors, getters and setters' },
      { name: 'PetInfo.java', summary: 'Given. `Pet pet1 = new Pet();`, then it reads and builds `pet2` and `pet3` with `new Pet(name, type, age)`, then prints all three with the getters.' }
    ],
    fill: [body],
    solution: sol,
    steps: [
      { code: '   private String name;\n   private String type;\n   private int age;', say: 'Three locked safes that every Pet gets.' },
      { code: '   public Pet() {\n      name = "unknown";\n      type = "unknown";\n      age = 0;\n   }', say: 'The no-arg constructor: same name as the class, **no return type** (not even `void`), empty `()`. It runs on `new Pet()` and fills in defaults: the “house pizza”.', py: 'def __init__(self):\n    self.name = "unknown"' },
      { code: '   public Pet(String name, String type, int age) {\n      this.name = name;\n      this.type = type;\n      this.age = age;\n   }', say: 'The overloaded constructor: same name, different parentheses. It fills the fields from inputs: the “custom order”. `this.name` is the object’s own box; plain `name` is the value handed in.', py: 'def __init__(self, name, type, age):\n    self.name = name' },
      { code: '   public String getName() { return name; }\n   public String getType() { return type; }\n   public int getAge() { return age; }', say: 'Getters: empty `()`, and the return type matches the box (`String` or `int`).' },
      { code: '   public void setName(String name) { this.name = name; }\n   public void setType(String type) { this.type = type; }\n   public void setAge(int age) { this.age = age; }', say: 'Setters: `void`, take a value in, store it with `this.`.' }
    ],
    trace: {
      cols: ['call', 'name', 'type', 'age'],
      rows: [['new Pet()', 'unknown', 'unknown', '0'], ['new Pet("Max", "Bulldog", 3)', 'Max', 'Bulldog', '3'], ['new Pet("Leo", "Boston-Terrier", 6)', 'Leo', 'Boston-Terrier', '6']]
    },
    python: {
      java: 'public Pet(String name, String type, int age) {\n   this.name = name;\n}',
      py: 'def __init__(self, name, type, age):\n    self.name = name',
      note: '`this` is Java’s `self`. Java can have two constructors with the same name (overloading); Python would use default arguments instead.'
    },
    analogy: 'Class = blueprint, object = house, `new` = build a house. The no-arg constructor is the house pizza (defaults); the overloaded one is a custom order.',
    concepts: ['Constructor = same name as the class, no return type (not even void), runs on `new`.', 'No-arg = empty parentheses, fills defaults (“house pizza”).', 'Overloaded = same name, different parentheses, fills from inputs (“custom order”).', 'Don’t re-declare `String name` inside the constructor (that makes a temporary box).', '`this.name` = the object’s own box; plain `name` = the value handed in. `this` is a reserved word.', 'Getters: empty `()`, return type matches the box. Setters: `void`, take a value in.', 'Overloading ≠ overriding.'],
    mistakes: ['Confused no-arg vs overloaded.', 'Thought setters were the overloaded constructors.'],
    exercises: [
      {
        type: 'header', q: 'Which is a correct no-arg constructor header?',
        choices: ['public Pet() {', 'public void Pet() {', 'public pet() {', 'public Pet();'], answer: 0,
        why: 'Constructors use the class name exactly, have no return type, and open `{`.',
        wrong: { 1: 'Adding `void` turns it into a regular method, not a constructor. Constructors have no return type.', 2: 'It must match the class name exactly, capital P.', 3: 'Headers never end in `;`.' }
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
public Pet(String name, String type, int age) {
   __0__.name = name;
   this.type = type;
   this.age = age;
}

public __1__ getAge() { return age; }
public __2__ setAge(int age) { this.age = age; }`,
        blanks: ['this', 'int', 'void'], bank: ['this', 'self', 'int', 'void', 'String', 'Pet'],
        why: '`this.name` is the object’s own box. A getter returns the box’s type (`int`). A setter returns nothing (`void`).',
        wrong: { self: 'That’s Python. Java uses `this`.', '1:void': 'A getter hands back the value, so its type is `int`.', '1:String': '`age` is an int box, so the getter returns `int`.', '2:int': 'Setters store a value and hand nothing back: `void`.', Pet: 'Only constructors use the class name, and they have no return type.' }
      },
      {
        type: 'bug', q: 'This compiles, but `pet1` prints the wrong name. Find the bug.',
        code: j`
public Pet() {
   String name = "unknown";
   type = "unknown";
   age = 0;
}`,
        line: 1,
        fixes: ['Remove `String`: assign the field with `name = "unknown";`', 'Add `void` to the header', 'Change `"unknown"` to `unknown`'], fix: 0,
        errors: ['No error, but `pet1` prints `Name: null`', '`variable name is already defined`', '`cannot find symbol`'], error: 0,
        why: 'Writing `String name` makes a brand-new temporary box inside the constructor. It disappears when the constructor ends, and the real field stays empty (`null`).'
      },
      {
        type: 'bug', q: 'This compiles, but `pet2` prints the wrong name. Find the bug.',
        code: j`
public Pet(String name, String type, int age) {
   name = name;
   this.type = type;
   this.age = age;
}`,
        line: 1,
        fixes: ['Use `this.name = name;`', 'Rename the class', 'Add `String` in front'], fix: 0,
        errors: ['No error, but `pet2` prints `Name: null`', '`cannot find symbol`', '`variable name is already defined`'], error: 0,
        why: 'Inside the constructor, plain `name` means the parameter. `name = name` copies the parameter into itself, so the field never gets set. `this.name` is the object’s own box.'
      },
      {
        type: 'pick', q: '`new Pet("Max", "Bulldog", 3)` runs which code?', plain: true,
        choices: ['The overloaded constructor', 'The no-arg constructor', 'The setters', 'The getters'], answer: 0,
        why: 'Three values in the parentheses match the constructor with `(String name, String type, int age)`.',
        wrong: { 1: 'The no-arg one only runs for `new Pet()` with empty parentheses.', 2: 'Setters are regular methods you call later, like `pet2.setName("Max")`. They aren’t constructors.', 3: 'Getters only read values out.' }
      },
      {
        type: 'predict', q: 'What does this print?',
        code: j`
Pet pet1 = new Pet();
System.out.println("Name: " + pet1.getName());
System.out.println("Age: " + pet1.getAge());`,
        choices: ['Name: unknown\nAge: 0\n', 'Name: null\nAge: 0\n', 'Name: \nAge: \n'], answer: 0,
        why: 'Empty parentheses run the no-arg constructor, which fills in `"unknown"` and `0`.',
        wrong: { 1: 'The no-arg constructor sets the name to `"unknown"`, so it isn’t null.', 2: 'The constructor already filled the fields with defaults.' }
      },
      {
        type: 'order', q: 'Put both constructors in order, braces included.',
        lines: ctors,
        why: 'The no-arg constructor (defaults) comes first in the instructions, then the overloaded one. Each has its own `{ }`.'
      },
      {
        type: 'cold', q: 'Type the inside of the Pet class from memory.',
        context: 'public class Pet {\n   @@\n}', accept: [body], rows: 18
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 13
{
  const sol = j`
public class MallardDuck extends Duck {
    @Override
    public String getBehavior() {
        return "flies";
    }
}

public class RubberDuck extends Duck {
    @Override
    public String getBehavior() {
        return "squeaks";
    }
}`;
  const mallard = sol.split('\n').slice(0, 6).join('\n');
  const rubber = sol.split('\n').slice(7).join('\n');
  PROBLEMS.push({
    id: 13,
    title: 'Ducks',
    topic: 'inheritance, overriding',
    statement: '`MallardDuck` and `RubberDuck` extend `Duck`. In each, define an overridden `getBehavior` method. RubberDuck returns "squeaks"; MallardDuck returns "flies".',
    note: 'Heads up: the problem’s first sentence lists these in swapped order. Go by the bullets and the sample output.',
    samples: [{ input: 'Mallard Austin\nRubber Squeaker\n', output: 'Duck Information:\nAustin the Mallard duck flies!\nSqueaker the Rubber duck squeaks!\n' }],
    files: [
      { name: 'MallardDuck.java', code: '@@0@@', placeholder: '// Write this class.' },
      { name: 'RubberDuck.java', code: '@@1@@', placeholder: '// Write this class.' },
      { name: 'Duck.java', summary: 'Given and locked (the parent). Private `name`, `behavior`, `type`, with getters and setters. Its `getBehavior()` returns `behavior`, which is never set, so it’s `null`.' },
      { name: 'DuckInfo.java', summary: 'Given. Its main reads each duck’s type and name and prints the `Duck Information:` lines.' }
    ],
    fill: [mallard, rubber],
    solution: sol,
    steps: [
      { code: 'public class MallardDuck extends Duck {', say: '`extends` = the child inherits everything Duck has (fields, getters, setters).', py: 'class MallardDuck(Duck):' },
      { code: '    @Override', say: 'Optional label that asks Java to check you’re really replacing a parent method. A misspelled name becomes a compile error instead of a silent bug.' },
      { code: '    public String getBehavior() {', say: 'Copy the parent’s header exactly: same `public`, same return type, same name, same empty `()`.', py: '    def get_behavior(self):' },
      { code: '        return "flies";\n    }\n}', say: 'The new body. Without this override, Duck’s version returns `behavior`, which was never set, so the output would say `null`.', py: '        return "flies"' },
      { code: 'public class RubberDuck extends Duck {\n    @Override\n    public String getBehavior() {\n        return "squeaks";\n    }\n}', say: 'Same shape for the rubber duck, returning `"squeaks"`. Each class goes in its own file.' }
    ],
    python: {
      java: 'public class RubberDuck extends Duck {\n    @Override\n    public String getBehavior() {\n        return "squeaks";\n    }\n}',
      py: 'class RubberDuck(Duck):\n    def get_behavior(self):\n        return "squeaks"',
      note: '`extends Duck` is Python’s `(Duck)` after the class name. Overriding works the same way: define a method with the same name in the child.'
    },
    analogy: 'Duck is the family recipe. `extends` copies the whole recipe; overriding rewrites one step (`getBehavior`) for this child.',
    concepts: ['`extends` = the child inherits everything from the parent (like Python’s `class RubberDuck(Duck)`).', 'Overriding = the child rewrites a parent method with the exact same header.', 'Without it the output says “null”.', '`@Override` is optional but catches misspellings.', 'It must stay public (an override can’t be more restricted than the parent).'],
    mistakes: ['While testing, didn’t press Enter after the last input line, so the program kept waiting and the second line never printed (not a code bug).'],
    exercises: [
      {
        type: 'header', q: 'Which header correctly overrides Duck’s `getBehavior`?',
        choices: ['public String getBehavior() {', 'private String getBehavior() {', 'public void getBehavior() {', 'public String getbehavior() {'], answer: 0,
        why: 'An override copies the parent’s header exactly: `public`, `String`, same name, empty `()`.',
        wrong: { 1: 'An override can’t be more restricted than the parent. Duck’s is `public`, so yours must be too.', 2: 'The parent returns a String, so the override must too.', 3: 'Lowercase `b` is a different name. It doesn’t override anything and the output still says `null`. (`@Override` would catch this.)' }
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
public class RubberDuck __0__ Duck {
    @Override
    public String getBehavior() {
        return "__1__";
    }
}`,
        blanks: ['extends', 'squeaks'], bank: ['extends', 'implements', 'inherits', 'squeaks', 'flies'],
        why: 'Classes inherit with `extends`. Rubber ducks squeak; mallards fly.',
        wrong: { implements: '`implements` is for interfaces. A class inherits from a class with `extends`.', inherits: 'Not a Java keyword. Use `extends`.', flies: 'Flying is the Mallard. Rubber ducks squeak.' }
      },
      {
        type: 'predict', q: 'Suppose MallardDuck has **no** `getBehavior` override. What would Austin’s line print?',
        code: j`
// name = "Austin", type = "Mallard", behavior was never set
System.out.println(name + " the " + type + " duck " + behavior + "!");`,
        choices: ['Austin the Mallard duck null!\n', 'Austin the Mallard duck !\n', 'Austin the Mallard duck flies!\n'], answer: 0,
        why: 'Duck’s own `getBehavior()` returns the `behavior` field, which nobody set, so it’s `null`. Gluing `null` into a String prints the word `null`.',
        wrong: { 1: 'An unset String is `null`, not empty, and it prints as the word `null`.', 2: '“flies” only comes from the override you write.' }
      },
      {
        type: 'pick', q: 'Which duck returns `"flies"`?', plain: true,
        choices: ['MallardDuck', 'RubberDuck'], answer: 0,
        why: 'Go by the bullets and the sample output: Mallard flies, Rubber squeaks. The problem’s first sentence lists them swapped.',
        wrong: { 1: 'Rubber ducks squeak. The swapped first sentence is a trap.' }
      },
      {
        type: 'order', q: 'Put RubberDuck in order, braces included.',
        lines: rubber.split('\n'),
        why: 'Class header with `extends`, then `@Override` right above the method header, the return, and two closing braces.'
      },
      {
        type: 'pick', q: 'While testing, only the first line printed and the program seems stuck. What’s most likely?', plain: true,
        choices: ['It’s still waiting for input: press Enter after the last line', 'The override is wrong', 'Java crashed', 'The file name is wrong'], answer: 0,
        why: 'A program that seems to stop early is often just waiting for the next input. Not a code bug.',
        wrong: { 1: 'A wrong override would still finish and print, just with the wrong word (or `null`).', 2: 'A crash prints an exception message.', 3: 'A wrong file name stops it from compiling at all.' }
      },
      {
        type: 'cold', q: 'Type the RubberDuck class from memory.',
        accept: [rubber, rubber.replace('    @Override\n', '')],
        why: '`@Override` is optional, so the version without it is accepted too. Keeping it is a good habit.', rows: 6
      }
    ]
  });
}

// ---------------------------------------------------------------- Problem 14
{
  const sol = j`
private ArrayList<Grocery> groceryList = new ArrayList<Grocery>();

public ArrayList<Grocery> getGroceryList() {
   return groceryList;
}

public void addGrocery(Grocery grocery) {
   groceryList.add(grocery);
}`;
  const parts = sol.split('\n\n');
  const tpl = j`
import java.util.ArrayList;

public class Customer {
   // ... id and name fields (given) ...
   @@0@@

   // ... id and name getters and setters (given) ...

   @@1@@

   @@2@@
}`;
  PROBLEMS.push({
    id: 14,
    title: 'Grocery ArrayList',
    topic: 'ArrayList, add',
    statement: 'In the `Customer` class of `Customer.java`:\n\n- Create a `Grocery` ArrayList\n- `getGroceryList` returns it. Signature: `public ArrayList<Grocery> getGroceryList()`\n- `addGrocery` adds a Grocery object to the list via its parameter. Signature: `public void addGrocery(Grocery grocery)`',
    samples: [{ input: 'John\nEggs\n5.99\n12\ny\nOatmeal\n8.99\n1\nn\n', output: 'John has the following items:\n\nItem: Eggs\nPrice: 5.99\nQuantity: 12\n\nItem: Oatmeal\nPrice: 8.99\nQuantity: 1\n\nTotal: 14.98\n' }],
    files: [
      { name: 'Customer.java', code: tpl, placeholder: '// TODO', note: 'Abbreviated: the given id/name code is shown as comments.' },
      { name: 'Grocery.java', summary: 'Given. Fields item, price, quantity, a constructor, getters and setters.' },
      { name: 'CustomerInfo.java', summary: 'Given. main with a do-while loop that builds Grocery objects and calls `addGrocery`, then a for-each loop that prints them using `getGroceryList()`.' }
    ],
    fill: parts,
    solution: sol,
    steps: [
      { code: 'private ArrayList<Grocery> groceryList = new ArrayList<Grocery>();', say: '`ArrayList<Grocery>` is a growable list that holds Grocery objects (like a Python list). The **type** of thing inside goes in `< >`. `private`, like every field.', py: 'self.grocery_list = []' },
      { code: 'public ArrayList<Grocery> getGroceryList() {\n   return groceryList;\n}', say: 'Copy the given signature, add `{ }`, return the list. Watch the camelCase: method `getGroceryList`, field `groceryList`.', py: 'def get_grocery_list(self):\n    return self.grocery_list' },
      { code: 'public void addGrocery(Grocery grocery) {\n   groceryList.add(grocery);\n}', say: '`void`: it only adds and hands nothing back. `.add()` is Python’s `append`. `Grocery grocery` is type-then-name, like `int age`. No `static` on object methods.', py: 'def add_grocery(self, grocery):\n    self.grocery_list.append(grocery)' }
    ],
    python: {
      java: 'ArrayList<Grocery> list = new ArrayList<Grocery>();\nlist.add(item);',
      py: 'items = []\nitems.append(item)',
      note: 'A Java list has to say what type it holds, and primitives use their wrapper: `ArrayList<Integer>`, not `<int>`. It needs `import java.util.ArrayList;`.'
    },
    analogy: 'An ArrayList is a shopping cart that grows as you add things. `ArrayList<Grocery>` is a cart that only takes Grocery objects.',
    concepts: ['`ArrayList<Type>` = a growable list (Python list).', 'Angle brackets hold the type of thing inside (Grocery objects, not names).', '`.add()` = Python’s `append`.', '`ArrayList<Integer>`, not `<int>`.', 'Needs `import java.util.ArrayList;`.', 'Type-then-name pattern (`Grocery grocery`, like `int age`).', 'camelCase: method `getGroceryList` vs field `groceryList`.', 'No `static` on object methods.'],
    mistakes: ['Made the field public.', '`addGrocery` as `public ArrayList<Grocery>` with `return groceryList.add(grocery)` (should be `void`, no return).', 'Put the variable name inside `< >` instead of the type name.'],
    exercises: [
      {
        type: 'header', q: 'Which header is correct for `addGrocery`?',
        choices: ['public void addGrocery(Grocery grocery) {', 'public ArrayList<Grocery> addGrocery(Grocery grocery) {', 'public static void addGrocery(Grocery grocery) {', 'public void addGrocery(grocery) {'], answer: 0,
        why: 'Copy the given signature exactly and add `{`. It only adds, so `void`.',
        wrong: { 1: 'It only adds; nothing uses a result from it. The given signature says `void`.', 2: 'No `static` on object methods. Each Customer has its own list.', 3: 'The parameter needs its type: `Grocery grocery`.' }
      },
      {
        type: 'fill', q: 'Fill in the blanks.',
        code: j`
private ArrayList<__0__> groceryList = new ArrayList<Grocery>();

public ArrayList<Grocery> getGroceryList() {
   return __1__;
}

public void addGrocery(Grocery grocery) {
   groceryList.__2__(grocery);
}`,
        blanks: ['Grocery', 'groceryList', 'add'], bank: ['Grocery', 'grocery', 'groceryList', 'getGroceryList', 'add', 'append'],
        why: 'The type goes in `< >`, the getter returns the field, and ArrayList adds with `.add()`.',
        wrong: { grocery: 'Inside `< >` goes the **type** (`Grocery`, capital G), not a variable name.', getGroceryList: 'Return the field `groceryList`, not the method’s own name.', append: 'That’s Python. Java’s ArrayList uses `.add()`.' }
      },
      {
        type: 'bug', q: 'This won’t compile. Find the bug.',
        code: j`
public void addGrocery(Grocery grocery) {
   return groceryList.add(grocery);
}`,
        line: 1,
        fixes: ['Drop `return`: just `groceryList.add(grocery);`', 'Add `static`', 'Change `grocery` to `Grocery`'], fix: 0,
        errors: ['`incompatible types: unexpected return value`', '`cannot find symbol`', 'No error'], error: 0,
        why: 'A `void` method hands nothing back, so it can’t `return` a value. Keep the signature exactly as given and just add the item.'
      },
      {
        type: 'pick', q: 'Which line makes a list of whole numbers?',
        choices: ['ArrayList<Integer> nums = new ArrayList<Integer>();', 'ArrayList<int> nums = new ArrayList<int>();', 'ArrayList nums<Integer> = new ArrayList();', 'int[] nums = new ArrayList<Integer>();'], answer: 0,
        why: '`< >` holds a class type, so whole numbers use the wrapper `Integer`.',
        wrong: { 1: '`< >` can’t hold primitives like `int`. Use the wrapper `Integer`.', 2: 'The type goes right after `ArrayList`: `ArrayList<Integer> nums`.', 3: 'An array (`int[]`) and an ArrayList are different types.' }
      },
      {
        type: 'order', q: 'Put the three TODOs in order: the field, then getGroceryList, then addGrocery.',
        lines: sol.split('\n').filter(Boolean),
        why: 'Field first, then each method with its own `{ }`.'
      },
      {
        type: 'pick', q: 'Python’s `my_list.append(x)` in Java is…', plain: true,
        choices: ['`myList.add(x);`', '`myList.append(x);`', '`myList.push(x);`', '`myList += x;`'], answer: 0,
        why: 'ArrayList adds items with `.add()`.',
        wrong: { 1: '`append` is Python. Java’s ArrayList has no `append` → `cannot find symbol`.', 2: '`push` is JavaScript.', 3: '`+=` doesn’t work on lists in Java.' }
      },
      {
        type: 'bug', q: 'This compiles, but it doesn’t follow the instructions. Find the problem.',
        code: parts[0].replace('private', 'public'),
        line: 0,
        fixes: ['Make the field `private`', 'Remove `new ArrayList<Grocery>()`', 'Change `Grocery` to `grocery`'], fix: 0,
        errors: ['No compile error, but fields should be private (access goes through the getter)', '`cannot find symbol`', '`incompatible types`'], error: 0,
        why: 'Fields are locked safes. Other classes reach the list through `getGroceryList()` and `addGrocery()`, not directly.'
      },
      {
        type: 'cold', q: 'Type all three TODOs from memory.',
        accept: [sol, sol.replace('new ArrayList<Grocery>()', 'new ArrayList<>()')],
        why: '`new ArrayList<>()` (empty angle brackets) is also accepted. Java fills in the type for you.', rows: 9
      }
    ]
  });
}
