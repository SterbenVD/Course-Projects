import random
import matplotlib.pyplot as plt

number_lim = 2**8
number_start = 2**7

# This function returns the second largest bit of a number: For an,an-1,...,a0, it returns an-1
def second_largest_bit(num):
    # Keep dividing the number by 2 until the number is less than 4: Form of a_1 a_0
    while num >= 4:
        num = num//2
    # Return a_0
    return num%2

# This function returns the number of bits in a number by counting the number of times we can divide the number by 2
def num_bits(num):
    count = 0
    while num > 0:
        num = num//2
        count += 1
    return count

def round(num):
    # Find the number of bits in num
    numz = num_bits(num)
    # Find the second largest bit of num
    numx = second_largest_bit(num)
    # Find the round of num
    if numz <= 1:
        return -1
    numr = (1 << (numz-1) if numx == 0 else 1 << numz)
    # numr = (1 << (numz-1))
    return numr

highest_old_error = 0
highest_new_error = 0

highest_old_error_pairs = []
highest_new_error_pairs = []

def func(logs = False):
    for i in range(number_start, number_lim):
        for j in range(number_start, number_lim):
            a = i
            b = j
            if a == 0 or b == 0:
                continue

            ar = round(a)
            br = round(b)

            if ar == -1 or br == -1:
                continue

            # ar-a and br-b
            ara = ar - a
            brb = br - b

            # For error calculation
            act_ans = a*b

            ans = ar*b + a*br - ar*br

            # Logs for debugging
            if logs:
                print("a: ", a)
                print("b: ", b)
                print("ar: ", ar)
                print("br: ", br)
                print("ar - a: ", ara)
                print("br - b: ", brb)
            
            old_error = abs(ans - act_ans)/act_ans

            para = (ara if ara > 0 else -ara)
            pbrb = (brb if brb > 0 else -brb)

            parr = round(para)
            pbrr = round(pbrb)

            if logs:
                print("para: ", para)
                print("pbrb: ", pbrb)
                print("parr: ", parr)
                print("pbrr: ", pbrr)
            
            if ara * brb > 0:
                ans = ans + parr * pbrr
            else:
                ans = ans - parr * pbrr
            
            new_error = abs(ans - act_ans)/act_ans

            if logs:
                print("Old Error: ", old_error)
                print("New Error: ", new_error)
            
            global highest_old_error
            global highest_new_error
            global highest_old_error_pairs
            global highest_new_error_pairs

            if old_error > highest_old_error:
                highest_old_error = old_error
            if old_error > 0.11111:
                highest_old_error_pairs.append([a, b])
            if new_error > highest_new_error:
                highest_new_error = new_error
            if new_error > 0.0578:
                highest_new_error_pairs.append([a, b])
            
            
            # if a%1000 == 0 and b%1000 == 0:
            print("a: ", a, "and b: ", b)

if __name__ == "__main__":
    func()
    print("Highest Old Error: ", highest_old_error)
    print("Highest New Error: ", highest_new_error)
    print("Highest Old Error Pairs: ", highest_old_error_pairs)
    print("Highest New Error Pairs: ", highest_new_error_pairs)