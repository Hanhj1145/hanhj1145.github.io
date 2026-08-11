---
title: 逆元
published: 2025-07-01
description: 模意义下的乘法逆元：概念、费马小定理与扩展欧几里得两种求法，以及组合数取模的应用。
tags: [数学, 数论, 逆元]
category: 数学
lang: zh_CN
draft: false
---

# 逆元

逆元，又称乘法逆元。本文介绍模意义下乘法运算的逆元（Modular Multiplicative Inverse）。

## 一、概念

### 1. 模运算下"倒数"的引入

在实数中，$\frac{1}{2} = 0.5$，它满足 $2 \times \frac{1}{2} = 1$，即 $a \times x = 1$。

但在模运算中（比如取模 $10^9+7$），不能直接使用除法，容易产生浮点精度问题，只能整整数运算。

> [!NOTE] 为什么模运算下除法无法正常进行？
> 模运算的核心是**同余关系**（$a \equiv b \pmod m$ 表示 a 和 b 除以 m 的余数相同）。
> 对于**乘法**，同余有"保运算性"：若 $a \equiv b \pmod m$，则对任意整数 c，都有 $a \times c \equiv b \times c \pmod m$。
> 但**除法**是乘法的逆运算，对应"消去律"：若 $a \times c \equiv b \times c \pmod m$，能否推出 $a \equiv b \pmod m$？不一定！
> 反例：取 $m=6$，$c=2$，$a=1$，$b=4$。此时 $1 \times 2 = 2$，$4 \times 2 = 8$，而 $2 \equiv 8 \pmod 6$，但 $1 \not\equiv 4 \pmod 6$。当除数 c 和模数 m 不互质时，同余式两边不能直接除以 c。

于是问题变成：**能不能找到一个整数 x，使得 $a \times x \equiv 1 \pmod p$？** 也就是找模运算下可以等效替代 $\frac{1}{a}$ 的整数 x。如果能找到，就说 x 是 a 在模 p 下的**逆元**。

### 2. $a \cdot x \equiv 1 \pmod p$ 的含义

这是**同余式**。两个数除以同一个数后余数相同，就说它们同余。例如 $5 \equiv 12 \pmod 7$，因为 5 和 12 除以 7 的余数都是 5。

所以 $a \cdot x \equiv 1 \pmod p$ 的意思是：$a$ 和 $x$ 相乘再对 p 取模结果是 1。记 $x \equiv a^{-1} \pmod p$，这个 x 相当于 a 在模 p 世界里的"倒数"。

### 3. 举个例子

求 3 在模 7 意义下的逆元，也就是找 x 使 $3 \cdot x \equiv 1 \pmod 7$：

- $3 \times 1 = 3 \to 3 \bmod 7 = 3$ ✗
- $3 \times 2 = 6 \to 6 \bmod 7 = 6$ ✗
- $3 \times 5 = 15 \to 15 \bmod 7 = 1$ ✓

所以 **3 在模 7 下的逆元是 5**。

### 4. 费马小定理

> 如果 p 是质数，且 a 不是 p 的倍数（a 与 p 互质），则有：

$$
a^{p-1} \equiv 1 \pmod p
$$

变形可得：

$$
a \cdot a^{p-2} \equiv 1 \pmod p
\Rightarrow a^{-1} \equiv a^{p-2} \pmod p
$$

所以：**a 的逆元就是 $a^{p-2} \bmod p$**。

> [!NOTE] 请注意
> 逆元存在的前提是 c 和 m **互质**（$\gcd(c, m) = 1$）：
> - 若 $\gcd(c, m) = d > 1$，方程 $c \times x \equiv 1 \pmod m$ **无解**（左边是 d 的倍数，右边是 1，矛盾）。
> - 若 $\gcd(c, m) = 1$，根据**贝祖定理**，存在唯一的 x（$0 \le x < m$）满足条件。

## 二、代码模板

### 方法一：快速幂 + 费马小定理（p 是质数）

```cpp
typedef long long LL;

// 快速幂：计算 a^b mod mod_val
LL qpow(LL a, LL b, LL mod_val) {
    LL res = 1;
    while (b) {
        if (b & 1) res = res * a % mod_val;
        a = a * a % mod_val;
        b >>= 1;
    }
    return res;
}

// 求 a 在模 p 下的逆元（要求 p 是质数）
LL inv(LL a, LL p) {
    return qpow(a, p - 2, p);
}
```

快速幂的原理见[快速幂](/posts/c-quick-pow/)。

### 方法二：扩展欧几里得算法（适用范围更广）

```cpp
void exgcd(LL a, LL b, LL &x, LL &y) {
    if (!b) {
        x = 1; y = 0;
        return;
    }
    exgcd(b, a % b, y, x);
    y -= (a / b) * x;
}

// 返回 a 在模 p 下的逆元（要求 a 和 p 互质）
LL inv(LL a, LL p) {
    LL x, y;
    exgcd(a, p, x, y);
    return (x % p + p) % p; // 避免负数
}
```

## 三、实际应用举例

### 例题：求组合数 C(n, k) % MOD

组合数公式里有除法：

$$
C(n, k) = \frac{n!}{k!(n-k)!}
$$

不能直接做除法，要用逆元代替。

**步骤：**

1. 预处理阶乘 $fact[i] = i!$。
2. 预处理阶乘逆元 $inv\_fact[i] = inv(i!) \bmod MOD$。
3. 用公式 $C(n, k) = fact[n] \cdot inv\_fact[k] \cdot inv\_fact[n-k] \bmod MOD$。

```cpp
const int MAXN = 1e6 + 5;
const LL MOD = 1e9 + 7;

LL fact[MAXN], inv_fact[MAXN];

// 快速幂函数 qpow 如上所示

void init(int n) {
    fact[0] = 1;
    for (int i = 1; i <= n; ++i)
        fact[i] = fact[i - 1] * i % MOD;

    inv_fact[n] = qpow(fact[n], MOD - 2, MOD); // 用费马小定理求逆元
    for (int i = n - 1; i >= 0; --i)
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD;
}

LL C(int n, int k) {
    if (k < 0 || k > n) return 0;
    return fact[n] * inv_fact[k] % MOD * inv_fact[n - k] % MOD;
}
```

> [!NOTE] 适用前提
> 模数通常是**大质数**（如 $10^9+7$）。当 $k! < MOD$ 且 $(n-k)! < MOD$ 时，它们与质数 MOD 必然互质（质数的因数只有 1 和自身），逆元才存在。

## 四、总结

| 内容 | 解释 |
|------|------|
| 逆元定义 | 一个数 x，使得 $a \times x \equiv 1 \pmod p$，记作 $a^{-1}$ |
| 存在条件 | a 和 p 互质（p 是质数时，只要 a 不为 0 的倍数） |
| 作用 | 替代模意义下的除法，把除法变成乘法 |
| 常见方法 | 费马小定理（快）、扩展欧几里得（通用） |
| 应用场景 | 组合数、概率题等需要取模的地方 |

一句话：**逆元就是"模意义下的倒数"，用乘法代替模运算下的除法。**

练习：[2025-0301 五队上课（逆元）](https://www.luogu.com.cn/contest/233402#problems)

---

部分资源来源于网络，侵权请联系删除。