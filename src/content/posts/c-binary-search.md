---
title: 二分查找
published: 2025-07-27
description: 二分查找的原理，以及二分答案的最大化、最小化、浮点数、二分边界等常见模板。
tags: [算法, 二分]
category: 算法
lang: zh_CN
draft: false
---

# 二分查找

## 概述

### 定义

二分法（_Binary Search_），也称折半查找，是在一个有序数组中查找某一元素的算法。

### 过程

以在一个升序数组中查找一个数为例，它每次聚焦数组当前部分的中间元素：

- 如果中间元素刚好是要找的，就结束搜索过程；
- 如果中间元素小于所查找的值，那么左侧的只会更小，不会有所查找的元素，只需到右侧查找；
- 如果中间元素大于所查找的值同理，只需到左侧查找；
- 在左/右区间内，再次重复该过程。

> 以上内容来自 [OI Wiki](https://oi-wiki.org/)

## 二分答案之常见模板

二分答案（_Binary Search on Answer_）通过二分查找确定最优解，常用于解决最值问题（最大值最小化、最小值最大化）。模板按问题类型分类如下。

### 一、基础模板分类

#### 1. 最大化问题（寻找最大的可行解）

求满足条件的最大值。

```cpp
int left = 最小可能值, right = 最大可能值;
int ans = -1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (check(mid)) {  // mid 可行，尝试寻找更大的值
        ans = mid;     // 记录当前可行解
        left = mid + 1;
    } else {           // mid 不可行，缩小右边界
        right = mid - 1;
    }
}
// ans 是最大可行值
```

#### 2. 最小化问题（寻找最小的可行解）

求满足条件的最小值。

```cpp
int left = 最小可能值, right = 最大可能值;
int ans = -1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (check(mid)) {  // mid 可行，尝试寻找更小的值
        ans = mid;
        right = mid - 1;
    } else {           // mid 不可行，增大左边界
        left = mid + 1;
    }
}
// ans 是最小可行值
```

### 二、浮点数精度模板

解空间为实数时（如求平方根、几何问题）：

```cpp
double left = 最小可能值, right = 最大可能值;
double eps = 1e-7;     // 精度控制（通常比题目要求多两位）
for (int iter = 0; iter < 100; ++iter) {  // 固定迭代次数法
// 或 while (right - left > eps) {        // 精度差控制法
    double mid = (left + right) / 2;
    if (check(mid)) {
        left = mid;    // 或 right = mid（根据问题方向调整）
    } else {
        right = mid;
    }
}
// 最终解为 (left + right)/2 或 left
```

### 三、特殊边界模板

#### 1. 左闭右开区间写法

处理数组下标时更简洁（如 lower_bound）。

```cpp
int left = 0, right = n;  // [left, right)
while (left < right) {
    int mid = left + (right - left) / 2;
    if (check(mid)) {
        right = mid;      // 压缩右边界
    } else {
        left = mid + 1;   // 压缩左边界
    }
}
// left == right 是第一个满足条件的位置
```

#### 2. 寻找极值点模板

单峰函数找极值（如抛物线的最高点）。

```cpp
int left = 0, right = n-1;
while (left < right) {
    int mid = left + (right - left) / 2;
    if (a[mid] < a[mid+1]) {  // 递增趋势，峰值在右侧
        left = mid + 1;
    } else {                  // 递减趋势，峰值在左侧
        right = mid;
    }
}
// left 是峰值位置
```

### 四、模板核心要素总结

| 要素 | 说明 |
|------|------|
| 确定解空间 | 明确 `left` 和 `right` 的初始值（如 0~1e9） |
| check 函数 | 关键逻辑：判断当前 mid 是否满足题目条件 |
| 边界更新 | 根据 check 结果决定收缩方向（最大化向右，最小化向左） |
| 终止条件 | 整数用 `left <= right`，浮点数用精度或固定次数 |
| 答案保存 | 在 check 通过时及时记录候选答案 |

### 五、经典问题与模板对应

| 问题类型 | 适用模板 | 例题 |
|----------|----------|------|
| 最大值最小化 | 最小化模板 | 书籍叠放问题（LeetCode 410） |
| 最小值最大化 | 最大化模板 | 木头切割问题 |
| 实数范围解 | 浮点数模板 | 求平方根（LeetCode 69） |
| 寻找第一个/最后一个位置 | 左闭右开模板 | 二分查找变种（LeetCode 34） |
| 单峰序列极值 | 极值点模板 | 山脉数组找峰值（LeetCode 852） |

### 六、代码调试技巧

1. **打印中间值**：在二分循环中输出 `left/right/mid` 观察收缩过程。
2. **边界测试**：测试解空间的最小值、最大值和空输入的情况。
3. **死循环检查**：确保每次迭代区间必然缩小（如更新必须用 `mid ± 1`）。
4. **check 函数验证**：单独测试 check 函数的正确性。

---

掌握这些模板后，可以覆盖大部分二分答案题型。做题时先判断是最大化还是最小化，再套用对应的收缩逻辑即可。

---

部分资源来源于网络，侵权请联系删除。
