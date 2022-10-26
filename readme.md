# JScrates

JScrates is a Rust library of various containers and algorithms. These
are containers I created to solve various problems in certain projects, and
I decided it'd be best to put all of them into a separate repository rather
than copying files over from different modules.

## Vector

Pretty much a JavaScript array, but includes additional methods. All of the
methods below that allow passing an index to perform the operation (denoted
by the letters `i`, `j`, and `k`), will throw an error if the index is out
of bounds.

| Methods              | Description                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _v_.`empty()`        | Returns `true` if the array is empty, `false` otherwise                                                                                                        |
| _v_.`.front()`       | Returns the first element in the array                                                                                                                         |
| _v_.`back()`         | Returns the last element in the array                                                                                                                          |
| _v_.`push()`         | Adds an element to the end                                                                                                                                     |
| _v_.`pop()`          | Deletes the last element                                                                                                                                       |
| _v_.`assign(e, i)`   | Assigns the element `e` at the index `i`                                                                                                                       |
| _v_.`clone()`        | Returns a copy of the vector                                                                                                                                   |
| _v_.`dedupe()`       | Removes all of the vector's duplicates _in place_                                                                                                              |
| _v_.`deduped()`      | Returns a new vector with the calling vector's data, no duplicates                                                                                             |
| _v_.`clear()`        | Sets all existing elements in the vector to `0`                                                                                                                |
| _v_.`swap(i, j)`     | Swaps the contents at index `i` with the contents at index `j`                                                                                                 |
| _v_.`erase(i)`       | Sets the element at index `i` to 0                                                                                                                             |
| _v_.`length()`       | Returns the current vector's length                                                                                                                            |
| _v_.`validIndex(n)`  | Returns true if `n` is a valid index, false otherwise                                                                                                          |
| _v_.`reverse()`      | Reverses the array elements _in place_.                                                                                                                        |
| _v_.`reversed()`     | Returns a new vector, with the data of the calling vector reversed                                                                                             |
| _v_.`at(i)`          | Returns the element at `i`                                                                                                                                     |
| _v_.`insertAt(e, i)` | Inserts an element `e` at the index `i`                                                                                                                        |
| _v_.`rotateLeft()`   | Left-rotates the array elements _in place_.                                                                                                                    |
| _v_.`rotatedLeft()`  | Returns a new vector, with the data of the calling vector rotated left.                                                                                        |
| _v_.`rotateRight()`  | Right-rotates the array elements _in place_.                                                                                                                   |
| _v_.`rotatedLeft()`  | Returns a new vector, with the data of the calling vector rotated right.                                                                                       |
| _v_.`print()`        | Prints the vector's array to the console                                                                                                                       |
| _v_.`log()`          | Prints more detailed information to the console                                                                                                                |
| _v_.`begin(f)`       | Executes the callback function `f` on each element in the array, starting from the first                                                                       |
| _v_.`end(f)`         | Executes the callback function `f` on each element in the array, starting from the last                                                                        |
| _v_.`rbegin(f)`      | Executes the callback function `f` on each element in the array, starting from the last, then to the first, then the second, ..., ending at the second to last |
| _v_.`rend(f)`        | Executes the callback function `f` on each element in the array, starting from the first, then to the last, then the second to last, ..., ending at the second |
| _v_.`slice(i,j)`     | Returns a slice of the vector from `i` to `j`                                                                                                                  |

## LinkedList

The `LinkedList` class implements a singly-linked list. Below, the variable 𝐿 corresponds to a `LinkedList` instance.

| Benefits                                         | Costs                                                                              |
| ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Constant time insertion at the list's head       | Larger memory consumption compared to `Vector` and native JavaScript arrays        |
| Efficient rearrangements of elements in the list | Slower access to arbitrary items compared to `Vector` and native JavaScript arrays |

| Method/Property  | Description                                                                                                     | Time Complexity (best) | Time Complexity (average) | Time Complexity (worst) | Remark                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------- | ----------------------- | -------------------------------------------------------- |
| `𝐿.len()`        | Returns the list's length                                                                                       | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                          |
| `𝐿.push(𝑉)`      | Inserts the value `𝑉` at the end of the list                                                                    | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                          |
| `𝐿.behead()`     | Removes the first element in the list                                                                           | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                          |
| `𝐿.prepend(𝑉)`   | Inserts `𝑉` at the head of the list                                                                             | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                          |
| `𝐿.first = 𝑉`    | Sets first element's value to `𝑉`                                                                               | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                          |
| `𝐿.first`        | Returns first list element's value (`null` if the list is empty)                                                | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                          |
| `𝐿.last = 𝑉`     | Sets the last element's value to `𝑉`                                                                            | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                          |
| `𝐿.last`         | Returns the last element's value to `𝑉` (`null` if the list is empty)                                           | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                          |
| `𝐿.pop()`        | Removes the last element in the list                                                                            | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires traversing to the list's second to last element |
| `𝐿.search(𝑉)`    | Returns the value `𝑉` in the list, otherwise `null`                                                             | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Employs sequential search                                |
| `𝐿.insert(𝑉, 𝑖)` | Inserts the value `𝑉` at index `𝑖`                                                                              | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires traversal                                       |
| `𝐿.remove(𝑖)`    | Removes the value `𝑉` at index `𝑖` (deleted element is returned)                                                | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires traversal                                       |
| `𝐿.reverse(𝑖)`   | Mutates the list, where the list is reversed.                                                                   | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires traversal                                       |
| `𝐿.reversed(𝑖)`  | Returns a new list with `𝐿`'s list reversed. `𝐿` is not mutated.                                                | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires traversal                                       |
| `𝐿.arrayed()`    | Returns each element's value in an array.                                                                       | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires traversal                                       |
| `𝐿.kreverse(𝑛)`  | Returns the list mutated, where every 𝑛 elements are reversed. If 𝑛 is 0, 1, or the length, no mutation occurs. | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Employs recursion                                        |

## Circuit

A `Circuit` is a singly-linked circular list.

<!-- | Method/Property | Description                                            | -->
<!-- | --------------- | ------------------------------------------------------ | -->
<!-- | `push(𝑉)`       | Inserts `𝑉` after the last inserted element            | -->
<!-- | `pop(𝑉)`        | Removes the last inserted element                      | -->
<!-- | `cursor()`      | Returns the current position in the list               | -->
<!-- | `next()`        | Returns the value after the last inserted element      | -->
<!-- | `prev()`        | Returns the value before the last inserted element     | -->
<!-- | `len()`         | Returns the number of elements in list                 | -->
<!-- | `isEmpty()`     | Returns `true` if the list is empty, `false` otherwise | -->
<!-- | `arrayed()`     | Returns the list's elements as an array                | -->

<!-- ### Cost-Benefit Analysis -->

<!-- | Costs                                                 | Benefits                                                            | -->
<!-- | ----------------------------------------------------- | ------------------------------------------------------------------- | -->
<!-- | Looping is more challenging; there's no set endpoint. | Traversal can commence at any node, given that there is no endpoint | -->
<!-- |                                                       | Covers and eases many round-robin scheduling problems               | -->

## Bitset

A `Bitset` is an array consisting of only ones and zeros. Below, the variable 𝐵 denotes an instance of `Bitset`. The bitset class operates on a single unsigned 32-bit integer array in JavaScript, and the methods below operate with bitwise operators. This leads to two benefits: (1) Operations on bitsets are fairly quick, and (2) memory consumption is low. This is because the methods operate on the individual bits of the integer array. Thus, given an integer array of size 20, there are 640 available indices.

The caveats: Data representation is limited. Bitsets only take 1s and 0s, and certain array operations (particularly those that require handling array arguments) will still take linear time.

Note that the `push()` method requires an extension of the integer array (similar to a "pushback" in other libraries) after certain thresholds. The threshold depends on the last time the array was extended and requires copying over the elements of the previous integer array to the new array. The complexity analyses below result from an amortized analysis.

| Constructor            | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `bitset(size?:number)` | Optional size parameter that sets the bitset's size. Defaults to 10. |

| Method            | Description                                                                                    | Time Complexity (best) | Time Complexity (average) | Time Complexity (worst) | Remark                                          |
| ----------------- | ---------------------------------------------------------------------------------------------- | ---------------------- | ------------------------- | ----------------------- | ----------------------------------------------- |
| `𝐵.getBit(𝑖)`     | Returns the bit at index 𝑖.                                                                    | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                 |
| `𝐵.setBit(𝑖)`     | Sets the bit at index 𝑖 to 1.                                                                  | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                 |
| `𝐵.clearBit(𝑖)`   | Sets the bit at index 𝑖 to 0.                                                                  | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                 |
| `𝐵.toggle(i)`     | Toggles the bit at index 𝑖 (1 to 0, or 0 to 1).                                                | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                 |
| `𝐵.reset()`       | Sets all of 𝐵's bits to zero                                                                   | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                 |
| `𝐵.push(𝑏)`       | Inserts 𝑏 at the end of the bitset. If 𝑏 is 1, 1 inserted, otherwise, 0.                       | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                 |
| `𝐵.pop()`         | Removes the last bit in 𝐵                                                                      | ${\Omega(1)}$          | ${\Theta(1)}$             | ${O(1)}$                |                                                 |
| `𝐵.arrayed()`     | Returns the bitset as a native JavaScript array                                                | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires iterating over the whole integer array |
| `𝐵.uInt()`        | Returns the current bitset as an unsigned integer                                              | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires iterating over the whole integer array |
| `𝐵.shove(𝑏[])`    | Pushes the elements of `𝑏[]` (an array of 1s and 0s) into the bitset.                          | ${\Omega(1)}$          | ${\Theta(n)}$             | ${\Omega(n)}$           | Requires iterating over the user input          |
| `𝐵.or(bits: 𝐶)`   | Applies bitwise `or` on 𝐵 with 𝐶. 𝐶 must be an array of 1s and 0s or an instance of `Bitset`   | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires iterating over the user input          |
| `𝐵.and(bits: 𝐶)`  | Applies bitwise `and` on 𝐵 with 𝐶. 𝐶 must be an array of 1s and 0s or an instance of `Bitset`  | ${\Omega(1)}$          | ${\Theta(n)}$             | ${\Omega(n)}$           | Requires iterating over the user input          |
| `𝐵.not()`         | Applies bitwise `not` on 𝐵                                                                     | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires iterating over the integer array       |
| `𝐵.xor(bits: 𝐶)`  | Applies bitwise `xor` on 𝐵 with 𝐶. 𝐶 must be an array of 1s and 0s or an instance of `Bitset`  | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires iterating over the integer array       |
| `𝐵.nor(bits: 𝐶)`  | Applies bitwise `nor` on 𝐵 with 𝐶. 𝐶 must be an array of 1s and 0s or an instance of `Bitset`  | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires iterating over the integer array       |
| `𝐵.nand(bits: 𝐶)` | Applies bitwise `nand` on 𝐵 with 𝐶. 𝐶 must be an array of 1s and 0s or an instance of `Bitset` | ${\Omega(1)}$          | ${\Theta(n)}$             | ${O(n)}$                | Requires iterating over the integer array       |

| Property   | Description                              |
| ---------- | ---------------------------------------- |
| `𝐵.length` | Returns the current length of the bitset |

| Utility Functions | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `𝐵.print()`       | Prints the current state of the bitset to the console |

## Sorters

The `Sort` class consists of static methods. Only the following inputs can

| Method         | Time Complexity (best) | Time Complexity (average) | Time Complexity (worst) |
| -------------- | ---------------------- | ------------------------- | ----------------------- |
| `selection()`  | ${n^2}$                | ${n^2}$                   | ${n^2}$                 |
| `bubble()`     | ${n}$                  | ${n^2}$                   | ${n^2}$                 |
<!-- | `cube()`       | ${n}$                  | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `quick()`      | ${n \lg n}$            | ${n \lg n}$               | ${n^2}$                 | -->
<!-- | `merge()`      | ${n \lg n}$            | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `intro()`      | ${n \lg n}$            | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `heap()`       | ${n \lg n}$            | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `insertion()`  | ${n}$                  | ${n^2}$                   | ${n^2}$                 | -->
<!-- | `block()`      | ${n}$                  | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `shell()`      | ${n \lg n}$            | ${n^{4/3}}$               | ${n^{3/2}}$             | -->
<!-- | `exchange()`   | ${n^2}$                | ${n^2}$                   | ${n^2}$                 | -->
<!-- | `tree()`       | ${n \lg n}$            | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `cycle()`      | ${n^2}$                | ${n^2}$                   | ${n^2}$                 | -->
<!-- | `library()`    | ${n \lg n}$            | ${n \lg n}$               | ${n^2}$                 | -->
<!-- | `patience()`   | ${n}$                  | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `smooth()`     | ${n}$                  | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `strand()`     | ${n}$                  | ${n^2}$                   | ${n^2}$                 | -->
<!-- | `tournament()` | ${n \lg n}$            | ${n \lg n}$               | ${n \lg n}$             | -->
<!-- | `cocktail()`   | ${n}$                  | ${n^2}$                   | ${n^2}$                 | -->
<!-- | `comb()`       | ${n \lg n}$            | ${n^2}$                   | ${n^2}$                 | -->
<!-- | `gnome()`      | ${n}$                  | ${n^2}$                   | ${n^2}$                 | -->
<!-- | `oddEven()`    | ${n}$                  | ${n^2}$                   | ${n^2}$                 | -->

The following sort methods only work with the `Sequence` container:

<!-- | Method         | Time Complexity (best) | Time Complexity (average) | Time Complexity (worst)                   | -->
<!-- | -------------- | ---------------------- | ------------------------- | ----------------------------------------- | -->
<!-- | `pigeonhole()` | indeterminate          | ${n + 2^k}$               | ${n + 2^k}$                               | -->
<!-- | `bucketSort()` | indeterminate          | ${n + k}$                 | ${n(2^k)}$                                | -->
<!-- | `counting()`   | indeterminate          | ${n + r}$                 | ${n + r}$                                 | -->
<!-- | `radixLSD()`   | ${n}$                  | ${n \cdot \dfrac{k}{d}}$  | ${n \cdot \dfrac{k}{d}}$                  | -->
<!-- | `radixMSD()`   | indeterminate          | ${n \cdot \dfrac{k}{d}}$  | ${n \cdot \dfrac{k}{d}}$                  | -->
<!-- | `spread()`     | ${n}$                  | ${n \cdot \dfrac{k}{d}}$  | ${n \cdot \left(\dfrac{k}{s} + d\right)}$ | -->
<!-- | `burst()`      | indeterminate          | ${n \cdot \dfrac{k}{d}}$  | ${n \cdot \dfrac{k}{d}}$                  | -->
<!-- | `flash()`      | ${n}$                  | ${n+r}$                   | ${n^2}$                                   | -->
<!-- | `postman()`    | indeterminate          | ${n \cdot \dfrac{k}{d}}$  | ${n \cdot \dfrac{k}{d}}$                  | -->

## Maths

The `Maths` module provides the following static methods. The `Maths` module is namespaced under `Maths`. Thus, all of the methods below are called with the syntax:

```c
Maths.𝑚𝑒𝑡ℎ𝑜𝑑
```

Or, if a property:

```c
Maths.𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦
```

| Method                                | Description                                                                                                                                               | Benchmarked |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `min(array: number[])`                | Returns the smallest element of the arguments passed.                                                                                                     | ✔︎           |
| `max(array: number[])`                | Returns the largest element of the arguments passed                                                                                                       | ✔︎           |
| `mode(array:number[])`                | Returns the most common element of the arguments passed                                                                                                   |             |
| `count(f(a,b)=>boolean)`              | Returns the number of elements that result in the function `f(a,b)` evaluating to `true`, where `a` is an element and `b` is an element immediately after |             |
| `pairSum(array:number[], sum:number)` | Returns the first pair of elements in the array that add up to `sum`                                                                                      |             |
| `belt(array:number[])`                | Returns the largest band of consecutive integers                                                                                                          |             |
| `integer(n: number)`                  | Returns `true` if `n` is an integer, false otherwise                                                                                                      |             |
| `intDiv(a:number, b:number)`          | Returns the integer division of `a` and `b`.                                                                                                              |             |
| `isOdd(n:number)`                     | Returns true if `n` is odd, false otherwise.                                                                                                              |             |
| `isEven(n:number)`                    | Returns true if `n` is even, false otherwise.                                                                                                             |             |
| `subset(A: any[], B: any[])`          | Returns `true` if `A ⊂ B`, `false` otherwise.                                                                                                             |             |
| `combinations(array: number[])`       | Returns a new array comprising all the possible combinations of `array`'s elements.                                                                       |             |
| `permutations(array: number[])`       | Returns a new array comprising all the possible permutations of `array`'s elements.                                                                       |             |
