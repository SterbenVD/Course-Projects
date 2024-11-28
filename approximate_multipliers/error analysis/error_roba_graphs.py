import random
import matplotlib.pyplot as plt

# Can change
r_max = 6 # Recurse depth
n = 100000 # Number of samples

# Max values of a and b
a_max = 2**31-1 # Max value of a
b_max = 2**31-1 # Max value of b

# Required for stats
errors = [[] for i in range(r_max)]

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

# This function performs the operation a*b using the RoBa algorithm
# a*b = (ar-a)*(br-b) + a*br + b*ar - ar*br
# Recur is the number of times we want to recurse (ar-a)*(br-b) in the algorithm
# Ignoring (ar-a)*(br-b) in the last recursion
def oper(a,b,recur = 0,logs = False):

    # If either a or b is 0, the answer is 0
    if a == 0 or b == 0:
        return 0, 0
    
    # Find the number of bits in a and b
    az = num_bits(a)
    bz = num_bits(b)

    if az == 1 or bz == 1:
        return a*b, 0

    # ax and bx are the second largest bits of a and b respectively
    ax = second_largest_bit(a)
    bx = second_largest_bit(b)

    # ar = 2^(az-1) if second largest bit of a is 0, else 2^az
    ar = (1 << (az-1) if ax == 0 else 1 << az)
    br = (1 << (bz-1) if bx == 0 else 1 << bz)
    # ar = 1 << (az-1)
    # br = 1 << (bz-1)

    # The answer is calculated using the RoBa algorithm
    ans = ar*b + a*br - ar*br

    # ar-a and br-b
    ara = ar - a
    brb = br - b

    # For error calculation
    act_ans = a*b

    # Logs for debugging
    if logs:
        print("a: ", a)
        print("b: ", b)
        print("ax: ", ax)
        print("bx: ", bx)
        print("ar: ", ar)
        print("br: ", br)
        print("ar - a: ", ara)
        print("br - b: ", brb)
        print("az: ", az)
        print("bz: ", bz)
    
    # Mod of the (ar-a) and (br-b) 
    para = (ara if ara > 0 else -ara)
    pbrb = (brb if brb > 0 else -brb)

    # Recurse if recur > 0
    if recur:
        recur = recur - 1
        prev_ans = ans
        
        # tans = (ar-a)*(br-b) 
        tans,_ = oper(para,pbrb,recur)

        # Add or subtract tans based on the sign of (ar-a)*(br-b)
        if (ara*brb) > 0:
            ans = ans + tans
        elif (ara*brb) < 0:
            ans = ans - tans

        if logs:
            print("Recurse: ", tans)    
            print("Diff in Recurse: ", ans  - prev_ans)
    
    if logs:
        print("Actual Answer: ", act_ans)
        print("Answer: ", ans)
        print("Error: ", (act_ans - ans)/act_ans * 100)
    
    # Return the answer and the error
    return ans, (act_ans - ans)/act_ans * 100

def stats():
    # Recurse depth from 0 to 5
    errors = [[] for i in range(r_max)]
    for i in range(n):
        a = random.randint(0, a_max)
        b = random.randint(0, b_max)
        for r in range(r_max):
            # Calling the oper function for different values of recur
            # Add log = True in the arguments to see the logs

            # _, error = oper(a,b, recur = r, logs = True)
            _, error = oper(a,b, recur = r)
            if error < 0:
                error = -error
            errors[r].append(error)

    for r in range(r_max):
        print("\nRecur: ", r)
        print("Mean Error: ", sum(errors[r])/len(errors[r]), " %")
        print("Median Error: ", sorted(errors[r])[len(errors[r])//2], " %")
        print("Max Error: ", max(errors[r]), " %")
        print("Min Error: ", min(errors[r]), " %")
    
    fig, ax = plt.subplots(3,1)
    # Edit size of the figure
    fig.set_size_inches(10, 15)
    fig.suptitle('Error Analysis')
    
    # Plotting the mean error
    2.0
    ax[0].plot([i for i in range(r_max)], [sum(errors[i])/len(errors[i]) for i in range(r_max)], marker = 'o')
    ax[0].set_xlabel('Recurse Depth')
    ax[0].set_ylabel('Mean Error (%)')
    ax[0].set_title('Mean Error vs Recurse Depth')
    ax[0].set_yscale('log')
    # ax[0].savefig('mean_error.png')

    # Plotting the median error
    ax[1].plot([i for i in range(r_max)], [sorted(errors[i])[len(errors[i])//2] for i in range(r_max)], marker = 'o')
    ax[1].set_xlabel('Recurse Depth')
    ax[1].set_ylabel('Median Error (%)')
    ax[1].set_title('Median Error vs Recurse Depth')
    ax[1].set_yscale('log')
    # ax[1].savefig('median_error.png')

    # Plotting the max error
    ax[2].plot([i for i in range(r_max)], [max(errors[i]) for i in range(r_max)], marker = 'o')
    ax[2].set_xlabel('Recurse Depth')
    ax[2].set_ylabel('Max Error (%)')
    ax[2].set_title('Max Error vs Recurse Depth')
    ax[2].set_yscale('log')
    # ax[2].savefig('max_error.png')

    plt.savefig('error_analysis.png')

if __name__ == "__main__":
    # a = 5507884291704
    # b = 343960280240
    # for i in range(3):
    #     print("Iteration: ", i)
    #     oper(a,b, recur = i, logs = True)
    stats()