---
title: Large Number Multipliers
author: 
- Vishal Vijay Devadiga (CS21BTECH11061)
geometry: margin=1.5cm
documentclass: extarticle
fontsize: 12pt
header-includes:
    - \usepackage{setspace}
    - \onehalfspacing
---

# Table of Contents
- [Table of Contents](#table-of-contents)
- [Large Number Multipliers](#large-number-multipliers)
  - [Introduction](#introduction)
  - [Exact Multiplication](#exact-multiplication)
    - [Schoolbook Multiplication](#schoolbook-multiplication)
    - [Karatsuba Multiplication](#karatsuba-multiplication)
      - [Toom-Cook Multiplication](#toom-cook-multiplication)
    - [Strassen's Algorithm](#strassens-algorithm)
  - [Approximate Multiplication](#approximate-multiplication)
    - [Binary Logarithmic Multiplier](#binary-logarithmic-multiplier)
    - [RoBA Multiplier](#roba-multiplier)
      - [How is rounding done?](#how-is-rounding-done)
    - [Stuff done so far](#stuff-done-so-far)
  - [Extending RoBA Multiplier](#extending-roba-multiplier)
    - [Issues with this recursive approach](#issues-with-this-recursive-approach)
    - [Approach 1: Pipeline the recursive RoBA multiplier](#approach-1-pipeline-the-recursive-roba-multiplier)
      - [Only rounding down](#only-rounding-down)
      - [Rounding up and down](#rounding-up-and-down)
    - [Approach 2: Trying to calculate $A'\_r$ from $A$ rather than $A'$](#approach-2-trying-to-calculate-a_r-from-a-rather-than-a)
      - [Only rounding down](#only-rounding-down-1)
      - [Rounding up and down](#rounding-up-and-down-1)
      - [Approach 3: Approximating $A' \\times B'$ to $A'\_r \\times B'\_r$](#approach-3-approximating-a-times-b-to-a_r-times-b_r)
  - [Stats](#stats)
- [References](#references)

# Large Number Multipliers

## Introduction

Multiplication of large numbers is a fundamental operation in computer arithmetic and is used in various applications such as cryptography, signal processing, and scientific computing.

The reason for the importance of large number multiplication is that the size of the numbers involved in these applications is often too large to be represented using standard data types like integers or floating-point numbers. For example, in cryptography, large prime numbers are used for encryption and decryption, and the multiplication of these numbers is a key operation in the encryption and decryption algorithms.

When speaking about multiplication, there are different algorithms that can be used to multiply large numbers. Some are exact, while others are approximate. The choice of algorithm depends on the requirements of the application and the trade-offs between speed, accuracy, and resource usage.

## Exact Multiplication

Exact multiplication algorithms are designed to produce the exact result of the multiplication operation without any rounding or truncation errors. These algorithms are typically used in applications where the accuracy of the result is critical, such as cryptography and scientific computing.

Some of the exact multiplication algorithms include:

### Schoolbook Multiplication

Schoolbook multiplication is the most basic and straightforward algorithm for multiplying large numbers. It is based on the elementary school method of multiplying numbers digit by digit and adding the results. 

So, $c[i] = c[i] + a[j] * b[k]$ where $i = j + k$ and $c$ is the result of the multiplication.

The time complexity of schoolbook multiplication is $O(n*m)$, where $n$ and $m$ are the number of digits in the numbers $A$ and $B$, respectively. This algorithm is simple to implement and understand and is suitable for small to medium-sized numbers upto around 2000 digits. However, for very large numbers, schoolbook multiplication becomes inefficient due to its quadratic time complexity.

### Karatsuba Multiplication

Karatsuba multiplication is a divide-and-conquer algorithm that reduces the number of multiplication operations required to multiply two large numbers. It is based on the observation that the product of two numbers can be expressed as the sum of three products of smaller numbers.

So $C = A * B$ can be expressed as $C = A_1 * B_1 * 10^{2n} + (A_1 * B_0 + A_0 * B_1) * 10^n + A_0 * B_0$.

The term $(A_1 * B_0 + A_0 * B_1)$ can be calculated as $(A_1 + A_0) * (B_1 + B_0) - A_1 * B_1 - A_0 * B_0$. This reduces the number of multiplication operations required but increases the number of addition operations.

The time complexity of Karatsuba multiplication is $O(n^(log2(3)))$, which is approximately $O(n^1.585)$. This algorithm is more efficient than schoolbook multiplication for large numbers, as it reduces the number of multiplication operations required. However, it has a higher constant factor due to the additional additions involved.

#### Toom-Cook Multiplication

Toom-Cook multiplication is a generalization of Karatsuba multiplication that further reduces the number of multiplication operations required to multiply two large numbers. It is based on the observation that the product of two numbers can be expressed as the sum of several products of smaller numbers.

The time complexity of Toom-Cook multiplication is $O(n^(logk(2k-1)))$, where $k$ is the number of splits in the numbers $A$ and $B$. Tough to implement though as the number of splits increases.

### Strassen's Algorithm

Strassen's algorithm is another divide-and-conquer algorithm that reduces the number of multiplication operations required to multiply two large numbers. It is also called the Fast Fourier Transform (FFT) based multiplication algorithm or the Number Theoretic Transform (NTT) based multiplication algorithm depending on the implementation.

This algorithm relies on the concept of fields and polynomials to represent the numbers $A$ and $B$ as polynomials and then multiply them using FFT or NTT. The

Let $A = a_n * 2^n + a_{n-1} * 2^{n-1} + ... + a_0$ and $B = b_n * 2^n + b_{n-1} * 2^{n-1} + ... + b_0$ be the two numbers to be multiplied.

Then, $C = A * B$ can be expressed as $C = A(x) * B(x)$ where $A(x) = a_n * x^n + a_{n-1} * x^{n-1} + ... + a_0$ and $B(x) = b_n * x^n + b_{n-1} * x^{n-1} + ... + b_0$ are the polynomials representing the numbers $A$ and $B$.

Then, $C(x) = A(x) * B(x)$ 

There is a lot of info not covered here. Link to an video explaining FFT based multiplication: ![Link](https://www.youtube.com/watch?v=h7apO7q16V0)

## Approximate Multiplication

Approximate multiplication algorithms are designed to produce an approximate result of the multiplication operation with some error or loss of precision. These algorithms are typically used in applications where the accuracy of the result is not critical, such as signal processing and image processing.

Depending on whether the numbers are integers or floating-point numbers, different algorithms can be used for approximate multiplication.

For integers, approximate multiplication algorithms include:

### Binary Logarithmic Multiplier

Binary logarithmic multiplier is an approximate multiplication algorithm that uses logarithmic arithmetic to perform multiplication. It is based on the observation that the product of two numbers can be expressed as the sum of the logarithms of the numbers.

So, $C = A * B$ can be expressed as $\log_2(C) = \log_2(A) + \log_2(B)$.

Approximating the logarithms without lookup tables is a challenge. One way to approximate the logarithms is to assign $p.q$ where $p$ is the integer part and $q$ is the fractional part of the logarithm. For a number $T$, p is the number of bits $n$ in the number and q is equal to $T \mod 2^{n}$.

The time complexity of binary logarithmic multiplication is $O(n)$, where $n$ is the number of bits in the numbers $A$ and $B$. Conversion to and from logarithmic form is a challenge and requires additional operations.

### RoBA Multiplier

RoBA (Rounding Based) Approximate Multiplier is an approximate multiplication algorithm that ignores a term in the multiplication operation to avoid multiplication entirely and just use shift and add operations.

For a number $A$, $A_r$ is defined as $A$ rounded to the nearest power of 2. Then, $C = A * B$ can be written as $C = (A - A_r) * (B - B_r) + A_r * B + A * B_r - A_r * B_r$. The term $(A - A_r) * (B - B_r)$ is ignored to avoid multiplication.

![ROBA](roba_ori.png)

The time complexity of RoBA multiplication is $O(n)$, where $n$ is the number of bits in the numbers $A$ and $B$. 

Error for the RoBA multiplier is given by $E = \dfrac{(A - A_r) \times (B - B_r)}{A \times B}$. The max error is $\dfrac{100}{9}$% that is 11.11%. 

#### How is rounding done?

For a number $A$, where $A[i]$ is the $i^{th}$ bit of the number, the nearest power of 2 is calculated as follows:

$$ A_r[i] = (\neg {A[i]} . A[i-1] . A[i-2] + A[i] . \neg {A[i-1]} ) . \Pi_{j = i+1}^{n} \neg {A[j]} $$ 

### Stuff done so far

- Read multiple papers on large number multiplication algorithms.
- Read multiple papers on AMD Versal ACAP and algorithms that can be accelerated on it.
- Evaluated the feasibility of implementing KaraTsuba and Strassen's multiplication algorithms on AMD Versal ACAP.
- Read multiple papers on approximate multiplication algorithms and approximate computation in general.
- Evaluated the performance and errors of RoBA.
- Deduced that recursive RoBA multiplier is a area where research can be done.
- Evaluated the feasibility of designing/implementing recursive RoBA multiplier

## Extending RoBA Multiplier

The term $(A - A_r) * (B - B_r)$ can be approximated recursively using the RoBA multiplier. The term $(A - A_r) * (B - B_r)$ can be written as $(A - A_r) * (B - B_r) = (A - A_r) * (B - B_r)_r + (A - A_r)_r * (B - B_r)_r - (A - A_r)_r * (B - B_r)_r$.

Let 

- $(A - A_r) = A'$
- $(B - B_r) = B'$

Then $(A - A_r)_r = A'_r$ and $(B - B_r)_r = B'_r$.

Then, $(A - A_r) * (B - B_r) = A' * B'_r + A'_r * B' - A'_r * B'_r$.

### Issues with this recursive approach

- How to calculate $A'_r$ from $A$ and $A'$?
- How to pipeline the recursive RoBA multiplier?
- In the case of nearest power of 2 being greater than the number, how to handle the case? This causes the sign problem in $A-A_r$.

### Approach 1: Pipeline the recursive RoBA multiplier

#### Only rounding down

Suppose we only round down the numbers, that is $A_r \leq A$ always. Then, $A - A_r = A \oplus A_r$ where $\oplus$ is the bitwise XOR operation.

Rounding down means the error for one iteration is increased, that is, error $E = \dfrac{A \oplus A_r \times B \oplus B_r}{A \times B}$. The max error occurs when $A = 2^k - 1$ for some $k$. Thus, max error is $\dfrac{100}{4}$% that is 25%.

This can be pipelined as shown below:

![Pipeline](extend_roba_down.png)

Here, $A' = A \oplus A_r$ and $B' = B \oplus B_r$. This can be directly fed to the rounder as it will always be positive. The result is sent to an accumulator which will add the result to the previous result. The result after all the iterations is negative or positive depending on the sign of the original numbers. 

Doing recursively will lower the error rate to $\dfrac{1}{4^k} \times 100 \%$ where $k$ is the number of iterations.

#### Rounding up and down

Suppose we round up and down the numbers, then we need a subraction operation to calculate $A - A_r$.

![Pipeline](extend_roba_uptoo.png)

Here, $A' = A - A_r$ and $B' = B - B_r$. This must be sent to the sign detector as the result can be negative. The result of that iteration is negative or positive depending on the sign of the numbers of that iteration. This result is sent to the accumulator which will add the result to the previous result.

Doing recursively will lower the error rate to $\dfrac{1}{9^k} \times 100 \%$ where $k$ is the number of iterations.

### Approach 2: Trying to calculate $A'_r$ from $A$ rather than $A'$

This is a tough problem as the when the nearest power of 2 is greater than the number, some bits flip, and some bits remain the same. However when the nearest power of 2 is less than the number, only the highest significant bit flips to 0, and the rest remain the same.

#### Only rounding down

Suppose we only round down the numbers, that is $A_r \leq A$ always. Then, $A - A_r = A \oplus A_r$ where $\oplus$ is the bitwise XOR operation.

Then $A'_r$ can be calculated as:

$$ A'_r[i] = (A[i] . \neg {A[i-1]}) . \Pi_{j = i+1}^{n} \neg {A[j]} \oplus A_r[j]$$ 

Let $A^{i}_x = A^{1}_r \oplus A^{2}_r \oplus \dots A^{i}_r$ where $A^{i}_r$ is the $i^{th}$ iteration rounded down number.  

Then to find the rounded down number of iteration $i$, we can use the following formula:

$$ A^{i}_r[i] = (A[i] . \neg {A[i-1]}) . \Pi_{j = i+1}^{n} \neg {A[j]} \oplus A^{i-1}_x[j]$$

#### Rounding up and down

Not sure how

#### Approach 3: Approximating $A' \times B'$ to $A'_r \times B'_r$

So, error in this case would be $E = \dfrac{A' \times B' - A'_r \times B'_r}{A \times B}$.
Max error in this case is around $\dfrac{7}{121} \times 100 \%$ that is around 5.78% when $A = B = 10110000 \dots$  

## Stats

For 32 bit numbers:

| Method       | Signed Inputs | Max Error | Mean Error |
| ------------ | ------------- | --------- | ---------- |
| S-RoBA       | Yes           | 11.11%    |            |
| DRUM6        | No            | 6.34%     |            |
| MITCHEL      | No            | 11.11%    |            |
| DSM8         | No            |           |            |
| HAAM         | No            | 13.76%    |            |
| Baugh-Wooley |               |           |            |
| Wallace Tree |               |           |            |

This uses a 45nm library and YoSYS, OpenRoad to find these metrics(32 bit inputs, 64 outputs):

| MULT        | Area     | Delay | INT-Power | SW-Power | Leek-Power | Total-Power | LS-Power | PDP-SL | PADP-SL   | PDP    | PADP      |
| ----------- | -------- | ----- | --------- | -------- | ---------- | ----------- | -------- | ------ | --------- | ------ | --------- |
| DOWNROBATWO | 2925.734 | 2.92  | 0.0248    | 0.0267   | 0.106      | 0.157       | 0.1327   | 0.3875 | 1133.6751 | 0.4584 | 1341.2735 |
| UROBA       | 1696.016 | 2.05  | 0.0189    | 0.0164   | 0.0579     | 0.0931      | 0.0743   | 0.1523 | 258.3287  | 0.1909 | 323.6931  |
| ROBA        | 1778.742 | 1.63  | 0.0183    | 0.0168   | 0.059      | 0.0941      | 0.0758   | 0.1236 | 219.7707  | 0.1534 | 272.8288  |
| ASROBA      | 1660.904 | 2.3   | 0.0184    | 0.0166   | 0.0571     | 0.0922      | 0.0737   | 0.1695 | 281.5398  | 0.2121 | 352.2113  |

These metrics feel wrong though, as how can delay for UROBA be more than ROBA, as UROBA has lesser elements than ROBA.
I also believe the ASROBA design I am using is different to what the original paper might have used, since the authors did not release their verilog code.

Results:

where:

- MULT: The type of multiplier (e.g., DOWNROBATWO, ROBA, ASROBA).
- Area: The physical area consumed on hardware (e.g., FPGA or ASIC).
- Delay: The time taken to compute the multiplication (in nanoseconds).
- INT-Power: Internal power dissipation (e.g., due to capacitance switching).
- SW-Power: Switching power dissipation (dynamic power due to input transitions).
- Leek-Power: Leakage power dissipation (static power due to transistor leakage).
- Total-Power: Sum of all power consumption components.
- LS-Power: Load/store power (related to memory or data transfer operations).
- PDP-SL: Power-delay product with load/store considerations.
- PADP-SL: Power-area-delay product with load/store considerations.
- PDP: Power-delay product (a metric of energy efficiency).
- PADP: Power-area-delay product (a holistic metric of efficiency).

# References

- [AIM: Accelerating Arbitrary-precision Integer Multiplication on Heterogeneous Reconfigurable Computing Platform Versal ACAP](https://ieeexplore.ieee.org/document/10323754)
- [RoBA Multiplier: A Rounding-Based Approximate Multiplier for High-Speed yet Energy-Efficient Digital Signal Processing](https://ieeexplore.ieee.org/document/7517375)

| MULT        | Area     | Delay | INT-Power | SW-Power | Leek-Power | Total-Power | LS-Power | PDP-SL | PADP-SL   | PDP    | PADP      |
| ----------- | -------- | ----- | --------- | -------- | ---------- | ----------- | -------- | ------ | --------- | ------ | --------- |
| DOWNROBATWO | 2925.734 | 2.92  | 0.0248    | 0.0267   | 0.106      | 0.157       | 0.1327   | 0.3875 | 1133.6751 | 0.4584 | 1341.2735 |
| UROBA       | 1696.016 | 2.05  | 0.0189    | 0.0164   | 0.0579     | 0.0931      | 0.0743   | 0.1523 | 258.3287  | 0.1909 | 323.6931  |
| ROBA        | 1778.742 | 1.63  | 0.0183    | 0.0168   | 0.059      | 0.0941      | 0.0758   | 0.1236 | 219.7707  | 0.1534 | 272.8288  |
| ASROBA      | 1660.904 | 2.3   | 0.0184    | 0.0166   | 0.0571     | 0.0922      | 0.0737   | 0.1695 | 281.5398  | 0.2121 | 352.2113  |
| DRUM6_32_s  | 891.898  | 1.61  | 0.0144    | 0.00883  | 0.0247     | 0.0479      | 0.03353  | 0.0540 | 48.1476   | 0.0771 | 68.7823   |