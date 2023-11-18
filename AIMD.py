total = 10.5

cwnd1 = 0.5
cwnd2 = 0.5

frac1 = 1/4
frac2 = 3/4

one = []
two = []

for i in range(1000000):
    cwnd1 += 0.001
    if cwnd1 + cwnd2 > total:
        cwnd1 *= frac1
    cwnd2 += 0.001
    if cwnd1 + cwnd2 > total:
        cwnd2 *= frac2
    one.append(cwnd1)
    two.append(cwnd2)
    
l = 100000
    
print(sum(one[-l:]) / l)
print(sum(two[-l:]) / l)

print(sum(one[-l:]) / sum(two[-l:]))