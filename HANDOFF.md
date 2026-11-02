# Handoff: D286 Java Trainer (mobile study app)

## 0. First steps for Claude Code

1. Create a new project folder on this Mac mini: `~/Projects/d286-java-trainer` (create `~/Projects` if it doesn't exist). Work only inside that folder.
2. Copy this handoff file into the folder as `HANDOFF.md` so it stays with the project.
3. Initialize a git repo in the folder.
4. Before building, briefly confirm the plan with me (stack, how I'll open it on my phone). Ask before creating any GitHub repo, deploying, or publishing anything.

## 1. Who this is for

I'm Josh, a WGU software development student preparing for **D286 Java Fundamentals**. I'm a Java beginner with a little Python. The exam is 14 hands-on coding problems, about 4 hours, autograded on **exact character-for-character output**. Every problem gives a template (imports, class, main, Scanner already set up), and I write only the missing part.

How I learn best (build the app around this):
- I need to **see code**, not read paragraphs about it. Side-by-side code + plain-English explanation.
- **Python comparisons** help a lot (`input()` vs `Scanner`, `append` vs `.add`, `def` vs method headers).
- **Line-by-line traces** with real values (a table showing each variable changing).
- **Concrete analogies** that have worked for me: class = blueprint, object = house; `new` = build a house; private field = locked safe, setter puts in, getter reads out; `print` vs `println` = typewriter without/with Enter; parameter = mailbox slot that drops a value into the permanent box; private helper = cook in the kitchen, setter = waiter who passes the order.
- I like seeing the **whole solution first**, then breaking it down, then typing it back from memory.
- I study a lot on my **phone**, so mobile is the primary target.

## 2. What to build

A mobile-first study web app I can use on my iPhone, offline, with no login.

**Stack (suggested, confirm with me):** a single static site (HTML/CSS/vanilla JS or a light framework), installable as a PWA (manifest + service worker, works offline), progress saved in `localStorage`. No backend. All content lives in one data file (e.g. `problems.js` / `problems.json`) so I can edit it easily. Propose an easy way to get it on my phone (GitHub Pages is fine, but ask first).

**Design:** dark theme, large tap targets, monospace code blocks with syntax highlighting, readable at phone width. "Side by side" on desktop = two columns; on phone = stacked panels or a swipe/toggle between **Code** and **Explanation**. Code blocks must scroll horizontally, never wrap mid-token.

### Screens

1. **Home:** list of the 14 problems with status (not started / learning / passed cold) and a "weakest problems" shortcut.
2. **Problem page** with tabs:
   - **Problem:** exact problem statement, sample input, expected output (show newlines/spaces visibly, e.g. `⏎` and `·` toggle).
   - **Template:** what the exam gives me; highlight the part I must write.
   - **Walkthrough:** the solution shown line by line. Each line paired with a plain-English explanation (side by side). Include a Python comparison where useful and a trace table with the sample input.
   - **Practice:** the exercises below.
3. **Weird Rules:** the Java gotcha cheat sheet (section 5), each with a tiny tap-to-reveal quiz.
4. **Error Decoder:** common compiler/runtime messages → what they actually mean → the fix (section 6).
5. **Instruction Decoder:** exam wording → Java (section 7).
6. **Progress:** per-problem attempts, accuracy, last practiced, and a "cold redo due" list (problems I haven't passed cold in 24+ hours).

### Exercise types (all must work well with thumbs, no heavy typing)

- **Fill the blank:** solution with 1 to 4 tokens removed; tap a chip from a word bank to fill (e.g. `||`, `%`, `println`, `charAt(0)`, `void`, `this`).
- **Line order (Parsons):** solution lines shuffled; drag or tap to arrange. Include braces as separate lines so I practice brace placement.
- **Predict the output:** show a snippet, I pick or type the exact output. Compare exactly, including spaces.
- **Bug hunt:** a solution with one of my real mistakes planted (see each problem's "Josh's mistakes"). Tap the broken line, then pick the fix and the error message it would cause.
- **Match the header:** pick the correct method header (return type, parameters, public/private, static or not).
- **Type it cold (optional):** a text box to type the missing part from memory. No Java runs on the phone, so check it by normalizing whitespace and comparing to accepted solutions, and show a diff. Make clear this is a self-check, not a real compiler.

Give each problem at least 6 exercises mixing these types. After a wrong answer, always show **the correct answer plus why**, and why my pick was wrong. Allow Next, Previous, and Exit with score at any time; offer "retake missed only."

### Spaced practice

Track each problem as Learning → Passed with help → Passed cold. Surface problems for a cold redo the next day. Weight practice toward problems and rules I miss most.

## 3. Content accuracy rules

- All 14 solutions below were **run and verified** against the sample inputs. Do not "improve" them in ways that change output.
- Expected outputs must match exactly, including spaces, `$`, periods, and the final newline.
- Where a problem statement is marked "(verify)", it's reconstructed from notes; keep it but flag it in the UI with a small "check wording in zyBooks" note.
- If you write any Java to generate or check content, actually run it (`java File.java` works for single files) rather than guessing output.

## 4. The 14 problems

Each problem: statement → given template → verified solution → key concepts → Josh's real mistakes (use these for bug-hunt exercises).

---

### Problem 1: H pattern
**Statement:** Output the pattern below, ending with a newline. Each line contains 5 characters including whitespace.
```
H   H
H   H
HHHHH
H   H
H   H
```
**Template:** `public class LabProgram { public static void main(String[] args) { /* Type your code here. */ } }`
**Solution:**
```java
System.out.println("H   H");
System.out.println("H   H");
System.out.println("HHHHH");
System.out.println("H   H");
System.out.println("H   H");
```
**Concepts:** println adds the newline; exact spaces (three between the H's).
**Josh's mistakes:** forgot a `;` → `';' expected`.

---

### Problem 2: Multiply three times
**Statement:** Collect two integer inputs and assign them to `starting_num` and `multiplier`. Multiply `starting_num` by `multiplier` and output the result. Repeat two more times, each time multiplying the previous result by `multiplier`. Separate the three products with a space, ending with a newline.
Input `2` `5` → Output `10 50 250`
**Template:** imports Scanner, creates `scnr`; may declare `int starting_num; int multiplier;` (if declared, don't re-type `int`).
**Solution:**
```java
starting_num = scnr.nextInt();
multiplier = scnr.nextInt();
int result1 = starting_num * multiplier;
int result2 = result1 * multiplier;
int result3 = result2 * multiplier;
System.out.println(result1 + " " + result2 + " " + result3);
```
**Concepts:** compounding (each step uses the previous result: 2→10→50→250); `" "` between values; println at the end.
**Josh's mistakes:** used `""` (empty) instead of `" "` → `1050`; only two values; used `print` instead of `println`; confused why result is 10, not 2.

---

### Problem 3: Wedding tables
**Statement:** Each full table seats 10. Collect one integer input into `guests`. Using integer division, calculate the number of full tables. `tableSize` is declared and initialized; `guests` and `tablesFilled` are declared. Output ending with a newline.
Input `340` → `Tables filled: 34`; input `349` → `Tables filled: 34`
**Template:** `int tableSize=10, guests, tablesFilled;` already present.
**Solution:**
```java
guests = scnr.nextInt();
tablesFilled = guests / tableSize;
System.out.println("Tables filled: " + tablesFilled);
```
**Concepts:** integer division chops (349/10 = 34); don't re-declare template variables.
**Josh's mistakes:** `print` instead of `println`; re-typed `int guests` → "already defined"; typo `tabelsFilled` → "cannot find symbol".

---

### Problem 4: Name, age, salary
**Statement:** Take a full name, age, and salary as inputs on separate lines. Output a formatted message ending with a newline.
Input:
```
Pat Ford
35
60,000
```
Output: `Pat Ford is 35 and makes $60,000.`
**Solution:**
```java
String name = scnr.nextLine();
String age = scnr.nextLine();
String salary = scnr.nextLine();
System.out.println(name + " is " + age + " and makes $" + salary + ".");
```
**Concepts:** `nextLine()` reads the whole line including spaces; salary has a comma so read it as a String; `$` and `.` are part of the string.
**Josh's mistakes:** used `scnr.nextString()` (doesn't exist) → "cannot find symbol"; `int age = scnr.nextLine();` → "incompatible types: String cannot be converted to int".

---

### Problem 5: Divisible by 3
**Statement:** Collect three integer inputs representing the place values of a three-digit number. Determine whether the sum of the digits is divisible by 3. If any integer is negative, output `Invalid input!`. Output a message ending with a newline. Use `println()` for all print statements.
Inputs `1 5 3` → `153 is divisible by 3!`; `1 0 4` → `104 is not divisible by 3!`; `1 -5 3` → `Invalid input!` (each input on its own line)
**Solution:**
```java
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
}
```
**Concepts:** `||` = or; `%` remainder; negative check first; `""` at the start makes Java glue digits ("153") instead of adding them (9).
**Josh's mistakes:** `;` after `else if (...)` → "'else' without 'if'"; printed `sum` (9) instead of glued digits; `"Invalid input"` missing `!`; `"Invalid number"` wrong text; missing closing braces → "reached end of file while parsing". Was confused by the names hundreds/tens/ones (any names work).

---

### Problem 6: Name initials
**Statement:** Collect a full name as one string input. Output `lastInitial., firstName middleInitial.` If no middle name, output `lastInitial., firstName`.
`Pat Silly Doe` → `D., Pat S.`; `Julia Clark` → `C., Julia`
**Solution:**
```java
String name = scnr.nextLine();
String[] parts = name.split(" ");

if (parts.length == 3) {
   System.out.println(parts[2].charAt(0) + "., " + parts[0] + " " + parts[1].charAt(0) + ".");
}
else {
   System.out.println(parts[1].charAt(0) + "., " + parts[0]);
}
```
**Concepts:** read once with `nextLine()`, then `split(" ")` chops into an array; `.length` counts words; `[ ]` picks an array item, `( )` calls a method; `charAt(0)` = first letter (a char).
**Josh's mistakes:** read three separate `nextLine()`s; `scnr.split(...)` instead of `name.split(...)`; `if (parts % 3)` instead of `parts.length == 3`; `parts(2)` instead of `parts[2]`; `.char[0]` / `.char(0)` instead of `.charAt(0)`; used `-` instead of `=`; named two variables `name`.

---

### Problem 7: Smallest and sum (sentinel loop)
**Statement:** Collect any number of non-negative integers and calculate their sum. A negative integer ends input and is not part of the sum. Output the smallest non-negative value and the sum, ending with a newline.
Input `15 20 0 3 -1` (each on its own line) →
```
Smallest: 0
Sum: 38
```
**Solution:**
```java
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
System.out.println("Sum: " + sum);
```
**Concepts:** read the first number before the loop; `while` when you don't know the count; read the next number at the bottom of the loop (forgetting it = infinite loop); prints go after the loop ("once or every lap?").
**Trace (use in walkthrough):**
```
num   sum   smallest
15     15     15
20     35     15
 0     35      0
 3     38      0
-1     stop
```
**Josh's mistakes:** brace placement; prints inside the loop.

---

### Problem 8: Array average
**Statement:** Create an array to hold three doubles. Collect the three values as input and store them in the array. Calculate the average. Output the array values and average, ending with a newline.
Input `10.0 10.5 11.0` →
```
Array items: 10.0, 10.5, 11.0
Average: 10.5
```
**Solution:**
```java
double[] nums = new double[3];
nums[0] = scnr.nextDouble();
nums[1] = scnr.nextDouble();
nums[2] = scnr.nextDouble();

double average = (nums[0] + nums[1] + nums[2]) / 3;

System.out.println("Array items: " + nums[0] + ", " + nums[1] + ", " + nums[2]);
System.out.println("Average: " + average);
```
**Concepts:** `double[]` = array of doubles; `new double[3]` builds 3 slots; the 3 in `new double[3]` is a count, but `nums[0]` is a position, so indexes are 0, 1, 2; parentheses before `/ 3`; `", "` between values.
**Josh's mistakes:** capitalized `Double`; wrong label `"Array is: "`; no `", "` separators → `10.010.511.0`; thought the 3 went in `nextDouble(3)`.

---

### Problem 9: showResults with Random
**Statement:** Define a method named `showResults` with one parameter referencing a Random object `rand`. It generates a random integer 0 or 1 using `rand`. If 1, return true; if 0, return false. In `main()`, `rand` already has a seed of 2. Collect one integer (> 0). Use a loop to call `showResults()` that many times. Output each returned Boolean on its own line, ending with a newline.
Input `3` (seed 2) →
```
true
false
true
```
**Template (verify):** imports Scanner and Random; a spot to define the method above main; main has `Scanner scnr` and `Random rand = new Random(2);`.
**Solution:**
```java
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
}
```
**Concepts:** method header anatomy (`public static` + return type `boolean` + name + parameters); `import java.util.Random;`; `nextInt(2)` returns 0 or 1 (upper bound excluded); seed makes output repeatable (same shuffle every time); `for` loop parts separated by semicolons, `i` is a counter the loop makes itself; use `for` when you know the count, `while` when you don't.
**Josh's mistakes / questions:** thought `||` could separate for-loop parts; asked where `showResults` comes from (you write it); thought `nextInt(2)` gave 1 or 2.

---

### Problem 10: Customer age (using an existing class)
**Statement:** An existing class `Customer` is in `Customer.java`. In `main()` of `CustomerAge.java`, accept one string and one integer for each customer's name and age. Use the existing `customer1` and `customer2` variables to set name and age with `setName()` and `setAge()`. Determine the older customer with `getAge()`. Output the older customer's info with `printInfo()`, ending with a newline.
Input `Jane 25 John 29` (each on its own line) →
```
Customer that is older:
Name: John
Age: 29
```
**Given Customer.java:** private `name`, `age`; `getName`, `setName(String name)`, `getAge`, `setAge(int age)` using `this.`; `printInfo()` prints `Name: ...` and `Age: ...`.
**Given CustomerAge.java template:** creates `customer1`, `customer2`; TODO comments for each step; `System.out.println("Customer that is older:");` is already written.
**Solution (fill the TODOs):**
```java
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
}
```
**Concepts:** `Customer` is a type you can use like String; `object.method(value)` (no `=`); name/age are a pass-through tray reused for both customers; read order must match input order; methods always need `()`; printInfo is a homemade method, not built-in.
**Josh's mistakes:** `customer1 = scnr.next();` → "String cannot be converted to Customer"; `customer1.setName(age)` → "int cannot be converted to String"; `customer2.getAge` without `()`; `getInfo()` instead of `printInfo()`; read age before name → `InputMismatchException` at runtime.

---

### Problem 11: Debt ratio (building a class)
**Statement:** Debt ratio = Total Debt / Total Assets. `DebtMeasure.java` (given) reads `totalDebt` and `totalAssets`, passes them to the Debt object's `setDR()`, and prints using `getDR()`. Write the `Debt` class in `Debt.java`:
- `debtRatio`: private field of type double
- `calculateDR`: a private helper method with two double parameters `totalDebt` and `totalAssets`; calculates the ratio and assigns it to `debtRatio`. Signature: `private void calculateDR(double totalDebt, double totalAssets)`
- `getDR`: public accessor returning `debtRatio`
- `setDR`: public mutator that passes `totalDebt` and `totalAssets` to the Debt class

Input `250000` `300000` →
`The Company's total debt is in the amount of $250,000.00, and total assets are in the amount of $300,000.00, which gives a debt ratio of 0.83.`
**Given main:** `debt1.setDR(totalDebt, totalAssets);` then `System.out.printf("...%,.2f...%,.2f...%.2f.\n", totalDebt, totalAssets, debt1.getDR());`
**Solution:**
```java
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
}
```
**Concepts:** field = box inside the class but outside methods; "private helper" means another method in the class calls it (usually the setter); inside the class, call your own methods without `debt1.`; return type rule: if main uses the result (prints, compares, stores) it returns a type; if the call stands alone on its line it's `void`; printf `%.2f` = 2 decimal places, `%,.2f` adds commas; printf needs `\n` for a newline.
**Josh's mistakes:** `pricate` typo (two errors from one typo: "<identifier> expected" and "cannot find symbol: class pricate"); `double` instead of `void` on calculateDR; method headers ending in `;` (`public getDR();`); missing return type; missing `}` → "reached end of file while parsing"; didn't know setDR should call calculateDR.

---

### Problem 12: Pet class (constructors)
**Statement:** Write `Pet.java` with:
- Fields: `name` (String), `type` (String), `age` (int)
- No-arg constructor `Pet()`: assigns "unknown" to name, "unknown" to type, 0 to age
- Overloaded constructor with two String parameters (name, type) and one int (age), assigning them to the fields
- Mutators `setName`, `setType`, `setAge`; accessors `getName`, `getType`, `getAge`

Input `Max Bulldog 3 Leo Boston-Terrier 6` (each on its own line) →
```
Name: unknown
Type: unknown
Age: 0

Name: Max
Type: Bulldog
Age: 3

Name: Leo
Type: Boston-Terrier
Age: 6
```
**Given main (PetInfo.java):** `Pet pet1 = new Pet();`, then reads and builds `pet2` and `pet3` with `new Pet(name, type, age)`, then prints all three with getters.
**Template:** `public class Pet { }` with TODOs: fields, no-arg constructor, overloaded constructor, getters and setters.
**Solution:**
```java
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
}
```
**Concepts:** constructor = same name as the class, no return type (not even void), runs on `new`; no-arg = empty parentheses, fills defaults ("house pizza"); overloaded = same name, different parentheses, fills from inputs ("custom order"); don't re-declare `String name` inside the constructor (would make a temporary box); `this.name` = the object's own box vs plain `name` = the value handed in; `this` is a reserved word that can't be renamed; getters: empty `()`, return type matches the box; setters: `void`, take a value in; overloading ≠ overriding.
**Josh's questions:** confused no-arg vs overloaded; thought setters were the overloaded constructors.

---

### Problem 13: Ducks (inheritance and overriding)
**Statement:** `MallardDuck` and `RubberDuck` extend `Duck`. In each, define an overridden `getBehavior` method. RubberDuck returns "squeaks"; MallardDuck returns "flies". **Note:** the problem's first sentence lists these in swapped order. Go by the bullets and sample output.
Input `Mallard Austin` / `Rubber Squeaker` →
```
Duck Information:
Austin the Mallard duck flies!
Squeaker the Rubber duck squeaks!
```
**Files:** `Duck.java` (locked parent: private name, behavior, type; getters/setters; `getBehavior()` returns `behavior`, which is never set → null), `DuckInfo.java` (given main), `MallardDuck.java` and `RubberDuck.java` (you write these).
**Solution:**
```java
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
}
```
**Concepts:** `extends` = child inherits everything from the parent (like Python's `class RubberDuck(Duck)`); overriding = child rewrites a parent method with the exact same header; without it the output says "null"; `@Override` is optional but catches misspellings; must stay public (an override can't be more restricted than the parent).
**Josh's mistakes:** while testing, didn't press Enter after the last input line, so the program kept waiting and the second line never printed (not a code bug).

---

### Problem 14: Grocery ArrayList
**Statement:** In the `Customer` class of `Customer.java`:
- Create a `Grocery` ArrayList
- `getGroceryList` returns it. Signature: `public ArrayList<Grocery> getGroceryList()`
- `addGrocery` adds a Grocery object to the list via its parameter. Signature: `public void addGrocery(Grocery grocery)`

Input:
```
John
Eggs
5.99
12
y
Oatmeal
8.99
1
n
```
Output:
```
John has the following items:

Item: Eggs
Price: 5.99
Quantity: 12

Item: Oatmeal
Price: 8.99
Quantity: 1

Total: 14.98
```
**Given:** `CustomerInfo.java` (main with a do-while loop and for-each printing), `Grocery.java` (item, price, quantity, constructor, getters/setters), `Customer.java` with `import java.util.ArrayList;`, id/name fields and getters/setters, and three TODOs.
**Solution (the three TODOs):**
```java
private ArrayList<Grocery> groceryList = new ArrayList<Grocery>();

public ArrayList<Grocery> getGroceryList() {
   return groceryList;
}

public void addGrocery(Grocery grocery) {
   groceryList.add(grocery);
}
```
**Concepts:** `ArrayList<Type>` = growable list (Python list); angle brackets hold the type of thing inside (Grocery objects, not names); `.add()` = Python's `append`; `ArrayList<Integer>` not `<int>`; needs `import java.util.ArrayList;`; type-then-name pattern (`Grocery grocery` like `int age`); camelCase: method `getGroceryList` vs field `groceryList`; no `static` on object methods.
**Josh's mistakes:** made the field public; `addGrocery` as `public ArrayList<Grocery>` with `return groceryList.add(grocery)` (should be `void`, no return); put the type name inside `< >` vs the variable name.

## 5. Weird Rules cheat sheet (each becomes a card + mini quiz)

1. Gluing vs adding, left to right: `"Sum: " + 4 + 6` → `Sum: 46`; `4 + 6 + " total"` → `10 total`; `"" + 1 + 5 + 3` → `153`. Need `""` first only when two or more numbers lead and you want them glued.
2. Integer division chops: `9 / 4` → 2; `9.0 / 4` → 2.25.
3. Remainder sign follows the left number: `-3 % 2` → -1, so test `% 2 == 0`, never `== 1`.
4. Java never adds spaces: `"Hi" + "There"` → `HiThere`.
5. `println` = `print` + Enter. "Ending with a newline" means the last output must be `println` (or printf with `\n`).
6. `next()` = one word, `nextLine()` = whole line, `nextString()` doesn't exist.
7. The `nextInt()` then `nextLine()` trap: nextInt leaves the Enter behind; add `scnr.nextLine();` to eat it, or use `next()` for one-word names.
8. Indexes start at 0; last index = length − 1. In `new double[3]` the 3 is a count; in `nums[2]` it's a position.
9. `rand.nextInt(n)` → 0 to n−1; for 1–6 use `rand.nextInt(6) + 1`.
10. `=` assigns, `==` compares (Strings use `.equals()`).
11. Two chars added become a number: `'D' + 'P'` → 148; `'D' + "."` → `"D."`.
12. Never put `;` between `if (...)`/`for (...)`/`while (...)` and `{`.
13. Method headers never end in `;`; they open `{ }`.
14. Methods always need `()`, even empty: `getAge()`, `next()`.
15. Read inputs in the exact order of the sample input.
16. Return type rule: result used by main → return a type; call stands alone → `void`. Setters void, getters return the box's type.
17. Constructors: class name, no return type.
18. `this.x = x` when the parameter has the same name as the field. `this` is a reserved word.
19. Brace habit: type `{` and `}` together, then fill the middle.
20. If a program seems to stop early when testing, it may still be waiting for input (press Enter after the last line).
21. `[ ]` picks from an array, `( )` calls a method.
22. Copy exact output strings and method signatures from the instructions.

## 6. Error decoder

| Message | Meaning | Usual fix |
|---|---|---|
| `';' expected` | statement not ended | add `;` |
| `cannot find symbol` | Java doesn't know that name (typo, undeclared, wrong method name, missing `()`) | check spelling/caps, declare it, add `()` |
| `variable ... is already defined` | declared twice | drop the second `int`/`String` |
| `incompatible types: X cannot be converted to Y` | value doesn't fit the box | match grab to box (`nextInt`→int) or fix argument |
| `'else' without 'if'` | usually a `;` after `if (...)` | remove the `;` |
| `reached end of file while parsing` | missing `}` | count braces |
| `<identifier> expected` | Java confused by an unknown word (often a typo like `pricate`) | fix the first error first; others often vanish |
| `class X is public, should be declared in a file named X.java` | class name ≠ file name | rename to match |
| `InputMismatchException` (runtime) | read the wrong type (e.g. nextInt on "Jane") | fix read order/type |
| `ArrayIndexOutOfBoundsException` (runtime) | used index ≥ length | last index is length − 1 |
| Infinite loop / frozen | loop variable never changes, or waiting for input | read at bottom of loop / provide input |

Three error types to teach: syntax (won't compile), runtime (crashes while running), logic (runs but wrong output).

## 7. Instruction decoder (exam wording → Java)

| Exam says | Write |
|---|---|
| private field of type double named x | `private double x;` |
| use the method signature ... | copy it exactly, add `{ }` |
| assign the result to x | `x = ...;` |
| accessor / returns x | `public Type getX() { return x; }` |
| mutator / sets x | `public void setX(Type x) { this.x = x; }` |
| private helper method | called by another method in the class, usually the setter |
| no-argument constructor | `public ClassName() { defaults }` |
| overloaded constructor | `public ClassName(params) { this.a = a; ... }` |
| overridden method | copy the parent's header exactly in the child, change the body |
| extends | `public class Child extends Parent` |
| ending with a newline | last output is `println` |

## 8. Definition of done

- Runs offline on my iPhone (Safari, "Add to Home Screen").
- All 14 problems have: exact statement, template view, side-by-side line-by-line walkthrough, trace or Python comparison where useful, and at least 6 mixed exercises with explanations for every answer.
- Weird Rules, Error Decoder, Instruction Decoder, and Progress screens work.
- Progress persists between sessions; I can reset it.
- Every expected output shown in the app matches the verified outputs above, character for character.
- A short README explaining how to run it locally and how to update content.
