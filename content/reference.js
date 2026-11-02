// Weird Rules, Error Decoder and Instruction Decoder content. Uses j`...` from problems.js.
window.REFERENCE = {
  rules: [
    {
      title: 'Gluing vs adding, left to right',
      text: 'Java reads `+` left to right. Number + number adds. As soon as a String is involved, `+` glues. You only need `""` first when two or more numbers lead and you want them glued.',
      code: j`
System.out.println("Sum: " + 4 + 6);    // Sum: 46
System.out.println(4 + 6 + " total");   // 10 total
System.out.println("" + 1 + 5 + 3);     // 153`,
      quiz: {
        type: 'predict', q: 'What does this print?',
        code: 'System.out.println("Total: " + 2 + 3);',
        choices: ['Total: 23\n', 'Total: 5\n', 'Total: 2 3\n'], answer: 0,
        why: 'The String comes first, so every `+` after it glues: "Total: " + 2 → "Total: 2", then + 3 → "Total: 23".',
        wrong: { 1: 'To add first, use parentheses: `"Total: " + (2 + 3)`.', 2: 'Java never adds spaces.' }
      }
    },
    {
      title: 'Integer division chops',
      text: 'int / int throws away the decimal. It never rounds. Make one side a double to keep the decimal.',
      code: j`
System.out.println(9 / 4);     // 2
System.out.println(9.0 / 4);   // 2.25`,
      quiz: {
        type: 'predict', q: 'What does this print?',
        code: 'System.out.println(7 / 2);',
        choices: ['3\n', '3.5\n', '4\n'], answer: 0,
        why: 'Both are ints, so the .5 is chopped off.',
        wrong: { 1: 'Only if one side were a double, like `7.0 / 2`.', 2: 'Integer division chops; it never rounds up.' }
      }
    },
    {
      title: 'Remainder sign follows the left number',
      text: '`-3 % 2` is `-1`, not `1`. So test for even with `% 2 == 0`, never odd with `% 2 == 1`.',
      code: j`
System.out.println(-3 % 2);   // -1
System.out.println(3 % 2);    // 1`,
      quiz: {
        type: 'pick', q: 'Which test works for every even number, including negatives?',
        choices: ['n % 2 == 0', 'n % 2 == 1', 'n / 2 == 0'], answer: 0,
        why: 'Even numbers always leave remainder 0, negative or not.',
        wrong: { 1: 'That checks for odd, and it misses negative odds: `-3 % 2` is `-1`.', 2: '`/` divides. `n / 2 == 0` is only true for -1, 0 and 1.' }
      }
    },
    {
      title: 'Java never adds spaces',
      text: 'Every space in the output must be inside quotes.',
      code: 'System.out.println("Hi" + "There");   // HiThere',
      quiz: {
        type: 'predict', q: 'What does this print?',
        code: j`
String first = "Pat";
String last = "Ford";
System.out.println(first + last);`,
        choices: ['PatFord\n', 'Pat Ford\n', 'Pat, Ford\n'], answer: 0,
        why: 'Nothing goes between the two Strings unless you glue it in: `first + " " + last`.',
        wrong: { 1: 'You need `+ " " +` for that space.', 2: 'Java adds nothing, not even a comma.' }
      }
    },
    {
      title: '`println` = `print` + Enter',
      text: '“Ending with a newline” means the last output must be `println` (or `printf` with `\\n`).',
      code: j`
System.out.print("A");
System.out.println("B");   // AB then Enter`,
      quiz: {
        type: 'predict', q: 'Exactly what is printed?',
        code: j`
System.out.print("A");
System.out.println("B");
System.out.print("C");`,
        choices: ['AB\nC', 'A\nB\nC\n', 'ABC\n'], answer: 0,
        why: '`print` stays on the line, `println` presses Enter after B, and the final `print` leaves no newline.',
        wrong: { 1: 'Only the `println` adds a newline.', 2: 'The `println` after B moves C to a new line, and `print("C")` adds no final newline.' }
      }
    },
    {
      title: '`next()` vs `nextLine()`',
      text: '`next()` reads one word. `nextLine()` reads the whole line. `nextString()` doesn’t exist.',
      code: j`
// input: Pat Ford
String a = scnr.next();       // "Pat"
String b = scnr.nextLine();   // the rest of the line`,
      quiz: {
        type: 'pick', q: 'The input line is `Pat Ford`. Which reads all of it?',
        choices: ['scnr.nextLine()', 'scnr.next()', 'scnr.nextString()'], answer: 0,
        why: '`nextLine()` reads up to the Enter, spaces included.',
        wrong: { 1: '`next()` stops at the first space: just `Pat`.', 2: 'There is no `nextString()` → `cannot find symbol`.' }
      }
    },
    {
      title: 'The `nextInt()` then `nextLine()` trap',
      text: '`nextInt()` reads the number but leaves the Enter behind. A `nextLine()` right after reads that leftover Enter and returns an empty String. Add an extra `scnr.nextLine();` to eat it, or use `next()` for one-word names.',
      code: j`
int age = scnr.nextInt();
scnr.nextLine();               // eat the leftover Enter
String name = scnr.nextLine();`,
      quiz: {
        type: 'pick', q: 'Input is `35`, then `Pat Ford` on the next line. After `int age = scnr.nextInt();`, what does `scnr.nextLine()` return?', plain: true,
        choices: ['An empty String (the leftover Enter)', '`"Pat Ford"`', '`"35"`'], answer: 0,
        why: '`nextInt()` stopped right before the Enter. `nextLine()` reads up to that Enter, which is nothing.',
        wrong: { 1: 'You’d need one extra `scnr.nextLine();` first to eat the leftover Enter.', 2: '35 was already read by `nextInt()`.' }
      }
    },
    {
      title: 'Indexes start at 0',
      text: 'The last index is length − 1. In `new double[3]` the 3 is a count; in `nums[2]` the 2 is a position.',
      code: j`
double[] nums = new double[3];   // slots 0, 1, 2
nums[2] = 11.0;                  // the last slot`,
      quiz: {
        type: 'pick', q: 'An array is made with `new int[5]`. What’s the last index?', plain: true,
        choices: ['4', '5', '6', '0'], answer: 0,
        why: '5 slots numbered 0, 1, 2, 3, 4.',
        wrong: { 1: '`[5]` would be a 6th slot → `ArrayIndexOutOfBoundsException`.', 2: 'There are only 5 slots.', 3: '0 is the first index.' }
      }
    },
    {
      title: '`rand.nextInt(n)` gives 0 to n − 1',
      text: 'The upper bound is never included. For 1–6, use `rand.nextInt(6) + 1`.',
      code: j`
rand.nextInt(2);       // 0 or 1
rand.nextInt(6) + 1;   // 1 to 6`,
      quiz: {
        type: 'pick', q: 'Which gives a dice roll from 1 to 6?',
        choices: ['rand.nextInt(6) + 1', 'rand.nextInt(6)', 'rand.nextInt(7)', 'rand.nextInt(5) + 1'], answer: 0,
        why: '`nextInt(6)` gives 0–5; adding 1 shifts it to 1–6.',
        wrong: { 1: 'That gives 0 to 5.', 2: 'That gives 0 to 6.', 3: 'That gives 1 to 5.' }
      }
    },
    {
      title: '`=` assigns, `==` compares',
      text: '`=` puts a value in a box. `==` asks “are these equal?” for numbers. Strings compare with `.equals()`.',
      code: j`
int x = 5;                 // assign
if (x == 5) { }            // compare numbers
if (word.equals("yes")) { } // compare Strings`,
      quiz: {
        type: 'pick', q: 'How do you check whether the String `answer` is "yes"?',
        choices: ['answer.equals("yes")', 'answer == "yes"', 'answer = "yes"'], answer: 0,
        why: 'Strings compare their text with `.equals()`.',
        wrong: { 1: '`==` on Strings checks whether they’re the same object, not the same text. It can fail even when the text matches.', 2: '`=` assigns. It doesn’t compare.' }
      }
    },
    {
      title: 'Two chars added become a number',
      text: 'A `char` is secretly a number. `char + char` adds the numbers. `char + String` glues.',
      code: j`
System.out.println('D' + 'P');   // 148
System.out.println('D' + ".");   // D.`,
      quiz: {
        type: 'pick', q: 'In Problem 6, why does `parts[2].charAt(0) + "., "` work?', plain: true,
        choices: ['`"., "` is a String, so `+` glues', 'charAt always returns a String', 'Java converts chars to text automatically'], answer: 0,
        why: 'char + String glues. If both sides were chars, like `\'D\' + \'.\'`, you’d get a number.',
        wrong: { 1: '`charAt` returns a `char`, not a String.', 2: 'Not with `+` between two chars. Then they add as numbers.' }
      }
    },
    {
      title: 'No `;` between `if (...)` and `{`',
      text: 'Same for `for (...)` and `while (...)`. The `;` ends the statement right there and cuts off the block.',
      code: j`
if (x > 0) {      // right
if (x > 0); {     // wrong`,
      quiz: {
        type: 'pick', q: 'Which line is correct?',
        choices: ['if (x > 0) {', 'if (x > 0); {', 'if x > 0 {'], answer: 0,
        why: 'Condition in parentheses, then straight into `{`.',
        wrong: { 1: 'The `;` ends the if right there, and the block runs no matter what (or you get `\'else\' without \'if\'`).', 2: 'Java needs parentheses around the condition.' }
      }
    },
    {
      title: 'Method headers never end in `;`',
      text: 'A header opens `{ }`. A `;` after it cuts the header off from its body.',
      code: j`
public double getDR() {    // right
public double getDR();     // wrong`,
      quiz: {
        type: 'header', q: 'Which header is correct?',
        choices: ['public int getAge() {', 'public int getAge();', 'public int getAge() ;{'], answer: 0,
        why: 'Headers go straight into `{`.',
        wrong: { 1: 'Ends in `;`, so it has no body.', 2: 'The `;` still cuts the header off.' }
      }
    },
    {
      title: 'Methods always need `()`',
      text: 'Even when nothing goes inside: `getAge()`, `next()`, `printInfo()`.',
      code: j`
customer1.getAge()    // right
customer1.getAge      // cannot find symbol`,
      quiz: {
        type: 'pick', q: 'Which calls the getter correctly?',
        choices: ['customer1.getAge()', 'customer1.getAge', 'customer1.getAge[]'], answer: 0,
        why: 'Method calls always have `()`.',
        wrong: { 1: 'Without `()` Java looks for a variable named `getAge` → `cannot find symbol`.', 2: '`[ ]` is for arrays.' }
      }
    },
    {
      title: 'Read inputs in the exact order of the sample input',
      text: 'Scanner reads top to bottom. If the input is a name then an age, read `next()` then `nextInt()`.',
      quiz: {
        type: 'pick', q: 'The input is `Jane` then `25`. Which read order is right?', plain: true,
        choices: ['`next()` then `nextInt()`', '`nextInt()` then `next()`'], answer: 0,
        why: 'Match the input: the word comes first.',
        wrong: { 1: '`nextInt()` would hit `Jane` first → `InputMismatchException` at runtime.' }
      }
    },
    {
      title: 'The return type rule',
      text: 'If main uses the result (prints it, compares it, stores it), the method returns a type. If the call stands alone on its line, it’s `void`. Setters are `void`; getters return the box’s type.',
      code: j`
debt1.setDR(a, b);                    // stands alone → void
System.out.println(debt1.getDR());    // result used → double`,
      quiz: {
        type: 'pick', q: 'main has `debt1.setDR(a, b);` alone on its line. What return type does `setDR` have?', plain: true,
        choices: ['`void`', '`double`', '`int`', '`boolean`'], answer: 0,
        why: 'Nothing uses a result from the call, so it returns nothing.',
        wrong: { 1: 'Only if main used the result, like printing it.', 2: 'Only if main used the result.', 3: 'Only if main used the result, like in an `if`.' }
      }
    },
    {
      title: 'Constructors: class name, no return type',
      text: 'Not even `void`. With `void` it becomes a regular method.',
      code: j`
public Pet() { ... }         // constructor
public void Pet() { ... }    // NOT a constructor`,
      quiz: {
        type: 'header', q: 'Which is a constructor for `class Dog`?',
        choices: ['public Dog() {', 'public void Dog() {', 'public dog() {'], answer: 0,
        why: 'Exact class name, no return type.',
        wrong: { 1: '`void` makes it a regular method.', 2: 'Must match the class name exactly, capital D.' }
      }
    },
    {
      title: '`this.x = x`',
      text: 'When the parameter has the same name as the field, `this.x` is the object’s box and plain `x` is the value handed in. `this` is a reserved word.',
      code: j`
public void setAge(int age) {
   this.age = age;
}`,
      quiz: {
        type: 'pick', q: 'Inside `setAge(int age)`, which line stores the value in the field?',
        choices: ['this.age = age;', 'age = age;', 'age = this;'], answer: 0,
        why: '`this.age` is the field; `age` is the parameter.',
        wrong: { 1: 'Both sides mean the parameter, so the field never changes.', 2: '`this` is the whole object, not a number.' }
      }
    },
    {
      title: 'Brace habit',
      text: 'Type `{` and `}` together, then fill in the middle. A missing `}` gives `reached end of file while parsing`.',
      quiz: {
        type: 'pick', q: 'What does `reached end of file while parsing` usually mean?', plain: true,
        choices: ['A `}` is missing', 'A `;` is missing', 'A name is misspelled'], answer: 0,
        why: 'Java hit the end of the file while still waiting for a closing brace.',
        wrong: { 1: 'That’s `\';\' expected`.', 2: 'That’s `cannot find symbol`.' }
      }
    },
    {
      title: 'Stuck? It may be waiting for input',
      text: 'If a program seems to stop early when you’re testing, it may still be waiting for input. Press Enter after the last line.',
      quiz: {
        type: 'pick', q: 'You typed your test input and nothing more prints. What do you try first?', plain: true,
        choices: ['Press Enter after the last input line', 'Rewrite the loop', 'Restart the computer'], answer: 0,
        why: 'Scanner waits until it sees the Enter at the end of the line.',
        wrong: { 1: 'Check the input first. It’s often not a code bug.', 2: 'The program is just waiting for you.' }
      }
    },
    {
      title: '`[ ]` picks from an array, `( )` calls a method',
      text: '`parts[0]` is the first item. `charAt(0)` is a method call.',
      code: 'parts[2].charAt(0)   // array item, then method',
      quiz: {
        type: 'pick', q: 'Which gets the first item of the array `parts`?',
        choices: ['parts[0]', 'parts(0)', 'parts{0}'], answer: 0,
        why: 'Square brackets pick from an array.',
        wrong: { 1: 'Parentheses call a method → `cannot find symbol`.', 2: 'Curly braces are for blocks.' }
      }
    },
    {
      title: 'Copy exact output strings and signatures',
      text: 'The autograder compares character by character. Copy text and method headers straight from the instructions.',
      quiz: {
        type: 'pick', q: 'The instructions say to output `Invalid input!`. Which line is right?',
        choices: ['System.out.println("Invalid input!");', 'System.out.println("Invalid Input!");', 'System.out.println("Invalid input");', 'System.out.println("invalid input!");'], answer: 0,
        why: 'Same capitals, same words, same punctuation.',
        wrong: { 1: 'Capital I in Input doesn’t match.', 2: 'Missing the `!`.', 3: 'Lowercase i doesn’t match.' }
      }
    }
  ],

  errors: [
    { msg: "';' expected", meaning: 'A statement wasn’t ended.', fix: 'Add `;` at the end of the line Java points to (or the line just before it).', example: 'System.out.println("HHHHH")', seen: 'Problem 1.' },
    { msg: 'cannot find symbol', meaning: 'Java doesn’t know that name: a typo, a variable that was never declared, a wrong method name, or a missing `()`.', fix: 'Check spelling and capitals, declare it, or add `()`.', example: 'tabelsFilled = guests / tableSize;\nscnr.nextString();\ncustomer2.getAge', seen: 'Problems 3, 4, 6 and 10.' },
    { msg: 'variable guests is already defined in method main(String[])', meaning: 'The same variable was declared twice.', fix: 'Drop the second `int` / `String`. Just assign: `guests = scnr.nextInt();`.', example: 'int guests = scnr.nextInt();   // template already declared guests', seen: 'Problems 2 and 3.' },
    { msg: 'incompatible types: String cannot be converted to int', meaning: 'The value doesn’t fit the box (or the method parameter).', fix: 'Match the grab to the box (`nextInt()` → int, `nextLine()` → String), or pass the right argument.', example: 'int age = scnr.nextLine();\ncustomer1 = scnr.next();\ncustomer1.setName(age);', seen: 'Problems 4 and 10.' },
    { msg: "'else' without 'if'", meaning: 'Usually a `;` right after `if (...)` or `else if (...)`.', fix: 'Remove the `;` before the `{`.', example: 'else if (sum % 3 == 0); {', seen: 'Problem 5.' },
    { msg: 'reached end of file while parsing', meaning: 'A `}` is missing.', fix: 'Count your braces. Every `{` needs a `}`.', seen: 'Problems 5 and 11.' },
    { msg: '<identifier> expected', meaning: 'Java got confused by a word it doesn’t know, often a typo like `pricate`. One typo can cause several errors.', fix: 'Fix the first error first; the others often vanish.', example: 'pricate double debtRatio;', seen: 'Problem 11.' },
    { msg: 'class X is public, should be declared in a file named X.java', meaning: 'The class name doesn’t match the file name.', fix: 'Rename the class (or file) so they match exactly, capitals included.', example: '// in Debt.java\npublic class debt {' },
    { msg: 'InputMismatchException (runtime)', meaning: 'The program read the wrong type, like `nextInt()` on the word "Jane". It compiles fine and crashes while running.', fix: 'Fix the read order or the read type to match the input.', example: 'age = scnr.nextInt();   // but the input starts with Jane', seen: 'Problem 10.' },
    { msg: 'ArrayIndexOutOfBoundsException (runtime)', meaning: 'You used an index that’s too big (or negative).', fix: 'The last index is length − 1.', example: 'double[] nums = new double[3];\nnums[3] = 1.0;   // only 0, 1, 2 exist' },
    { msg: 'Infinite loop / frozen', meaning: 'The loop variable never changes, or the program is waiting for input.', fix: 'Read the next value at the bottom of the loop, or press Enter after your test input.', example: 'while (num >= 0) {\n   sum = sum + num;\n   // missing: num = scnr.nextInt();\n}', seen: 'Problems 7 and 13.' }
  ],

  errorKinds: [
    { name: 'Syntax error (won’t compile)', text: 'Java can’t read the code: missing `;`, missing `}`, misspelled names, wrong types. You get an error message before anything runs.' },
    { name: 'Runtime error (crashes while running)', text: 'It compiles, then crashes on certain input: `InputMismatchException`, `ArrayIndexOutOfBoundsException`.' },
    { name: 'Logic error (runs, wrong output)', text: 'No message at all, but the output is wrong: `print` instead of `println`, a missing space, `>` instead of `>=`. The autograder catches these, so compare your output character by character.' }
  ],

  decoder: [
    { says: 'private field of type double named x', write: 'private double x;' },
    { says: 'use the method signature ...', write: 'private void calculateDR(double totalDebt, double totalAssets) {\n\n}', note: 'Copy it exactly, then add `{ }`.' },
    { says: 'assign the result to x', write: 'x = ...;' },
    { says: 'accessor / returns x', write: 'public Type getX() { return x; }' },
    { says: 'mutator / sets x', write: 'public void setX(Type x) { this.x = x; }' },
    { says: 'private helper method', write: 'private void helper(...) { ... }\n\npublic void setX(...) {\n   helper(...);\n}', note: 'Another method in the class calls it, usually the setter.' },
    { says: 'no-argument constructor', write: 'public ClassName() {\n   // defaults\n}' },
    { says: 'overloaded constructor', write: 'public ClassName(Type a, Type b) {\n   this.a = a;\n   this.b = b;\n}' },
    { says: 'overridden method', write: '@Override\npublic String getBehavior() {\n   return "...";\n}', note: 'Copy the parent’s header exactly in the child; change only the body.' },
    { says: 'extends', write: 'public class Child extends Parent {\n\n}' },
    { says: 'ending with a newline', write: 'System.out.println(...);', note: 'The last output is `println` (or `printf` with `\\n`).' }
  ]
};
