---
title: 快速幂
published: 2025-07-01
description: 快速幂的原理（二进制拆分 + 分治）、C++ 模板、常见应用场景与易错点。
tags: [数学, 快速幂]
category: 数学
lang: zh_CN
draft: false
---

# 快速幂（Exponentiation by Squaring）

快速幂用来计算形如 $a^b \bmod m$ 的式子。指数 b 很大的时候，循环逐次相乘会超时，快速幂可以在 $O(\log b)$ 时间内完成。

## 原理

核心是利用**二进制拆分**和**分治策略**：

$$
a^b =
\begin{cases}
a^{b/2} \cdot a^{b/2}, & b \text{ 为偶数} \\
a^{(b-1)/2} \cdot a^{(b-1)/2} \cdot a, & b \text{ 为奇数}
\end{cases}
$$

把指数 b 不断除以 2 来减少乘法次数，每一步取模防止溢出。

**例子：** 计算 $3^5 \bmod 7$

- $3^5 = 3^{4+1} = 3^4 \cdot 3$
- $3^4 = (3^2)^2$
- $3^2 = 9$
- $3^4 = 81 \bmod 7 = 4$
- $3^5 = 4 \cdot 3 = 12 \bmod 7 = 5$

结果是 5。

## C++ 模板

```cpp
typedef long long LL;

LL quick_pow(LL a, LL b, LL mod) {
    LL res = 1;
    while (b > 0) {
        if (b & 1) res = (res * a) % mod; // 当前位是1则乘入结果
        a = (a * a) % mod;                // 平方底数
        b >>= 1;                          // 处理下一位
    }
    return res;
}
```

- `a` 是底数，`b` 是指数，`mod` 是模数（不需要模运算时可省略）。
- 用位运算 `b & 1` 判断当前位是否为 1，效率更高。
- 时间复杂度 $O(\log b)$。

## 应用场景

### 1. 大指数取模

给定 $a, b, p$，求 $a^b \bmod p$，直接套模板即可。

### 2. 原根判定

判断一个数是否为某个质数的原根，需要快速幂验证相关条件。

### 3. 矩阵快速幂 / 斐波那契数列

把递推式改成矩阵形式，再用快速幂加速。例如斐波那契数列：

$$
\begin{bmatrix}
F_{n+1} \\
F_n
\end{bmatrix}
=
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}^n
\cdot
\begin{bmatrix}
F_1 \\
F_0
\end{bmatrix}
$$

写一个矩阵快速幂函数即可快速求第 $n$ 项。

### 4. 组合数取模（卢卡斯定理）

卢卡斯定理中也用快速幂计算逆元。

## 常见错误

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 结果始终为 0 | 忘记初始化 `res = 1` | 初始化正确 |
| 负数情况 | 底数可能是负数 | 先取模再快速幂 |
| 大整数溢出 | 中间结果太大 | 每次运算后取模 |
| 指数为 0 | 没有特殊处理 | 注意 $a^0 = 1$ |

## 扩展：浮点数的快速幂

如需计算浮点数幂（不取模）：

```cpp
double fast_pow(double a, int b) {
    double res = 1;
    bool neg = false;
    if (b < 0) {
        neg = true;
        b = -b;
    }
    while (b > 0) {
        if (b & 1) res *= a;
        a *= a;
        b >>= 1;
    }
    return neg ? 1 / res : res;
}
```

## 总结

快速幂的核心是**分治 + 二进制拆分**，时间复杂度 $O(\log b)$。除了基础模板，矩阵快速幂是它的一个进阶方向。

### 推荐练习题目

1. [洛谷 P1226 【模板】快速幂](https://www.luogu.com.cn/problem/P1226)
2. [LeetCode 50. Pow(x, n)](https://leetcode.cn/problems/powx-n/)
3. [HDU 1097 A hard puzzle](http://acm.hdu.edu.cn/showproblem.php?pid=1097)

---

部分资源来源于网络，侵权请联系删除。