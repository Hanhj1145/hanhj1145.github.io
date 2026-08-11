---
title: ST表（稀疏表）
published: 2025-06-30
description: ST 表（稀疏表）解决静态 RMQ 问题，O(NlogN) 预处理、O(1) 查询，含原理、代码、应用与进阶优化。
tags: [算法, 数据结构, RMQ]
category: 算法
lang: zh_CN
draft: false
---

# ST表（稀疏表）

ST 表，又称稀疏表，经常用来解决 RMQ 问题。

## 背景

先来一个小问题：

```
有N个数，M次询问，每次给定区间[L,R]，求区间内的最大值。

N<=10,M<=10
```

[P3865 【模板】ST表](https://www.luogu.org/problemnew/show/P3865)

```
N<=10^5,M<=10^6
```

随着 M 的增大，$O(\log N)$ 的询问处理已经不够优秀，我们需要 O(1) 处理询问的方法。这就引出了今天的主题——ST 表。

## 前置技能

倍增算法（例题：[P3379 【模板】最近公共祖先（LCA）](https://www.luogu.org/problemnew/show/P3379)）

区间动规（例题：[P3146 [USACO16OPEN]248](https://www.luogu.org/problemnew/show/P3146)）

## 算法流程

要 O(1) 求出区间最大值，一个很自然的想法是记录 $f(i,j)$ 为 $[i,j]$ 内的最大值，显然有转移方程 $f(i,j)=\max(f(i,j-1),a_j)$。

但是这样预处理是 $O(N^2)$ 的，不能通过，考虑进一步优化。

观察到一个性质：**max 操作允许区间重叠，也就是 $\max(a,b,c)=\max(\max(a,b),\max(b,c))$**。这个性质决定了 ST 表能否用来维护某种操作，例如 ST 表一般不能维护区间和，因为 $a+b+c \neq a+b+b+c$。于是我们可以由两个较小的、有重叠的区间直接推出一个大区间，少维护一些区间。

计算机中有很多事物跟 2 有关，这里也用倍增思想。令 $f(i,j)$ 为从 $a_i$ 开始的、连续 $2^j$ 个数的最大值，显然：

$$
f(i,0)=a_i
$$

$$
f(i,j)=\max\left(f(i,j-1),\;f(i+2^{j-1},j-1)\right)
$$

这一条非常重要，画个图理解一下：

![](https://cdn.luogu.com.cn/upload/pic/50965.png)

现在考虑 $f(1,2)$，也就是 $[1,4]$ 的最大值：

![](https://cdn.luogu.com.cn/upload/pic/50966.png)

把 $[1,4]$ 分成 $[1,2]$ 和 $[3,4]$ 两个小区间，这两个区间是之前求过的 $f(1,1)$ 与 $f(3,1)$，而 $f(1,1)=8,\;f(3,1)=7$，则 $f(1,2)=\max(f(1,1),f(3,1))=8$。

在这种方式下，以每个点为起点都有 $O(\log N)$ 个区间，每个区间可以 O(1) 求出，预处理总时间、空间复杂度都为 $O(N\log N)$。

那怎么处理询问呢？

根据 max 的性质，可以把区间拆成两个相重叠的区间。看图：

![](https://cdn.luogu.com.cn/upload/pic/50967.png)

记询问区间长度为 $len$，从左端点向右找一段长为 $2^{\lfloor\log_2 len\rfloor}$ 的区间（蓝色部分），右端点向左也找一段同样长的区间（黄色部分）。这两段区间已经覆盖了整个区间（中间重叠了一块绿色部分），取最大值即可。

为了保证询问复杂度为 O(1)，需要提前预处理出每个 $\lfloor\log_2 len\rfloor$ 的值。整个算法总时间复杂度为 $O(N\log N+M)$。

### 代码详解

```cpp
#include<cstdio>
#include<algorithm>

using namespace std;

// 原始数组，存储输入的数值
int a[100001] = {0};

// 预处理数组：lg[i] 表示 log2(i) 的向下取整值
// 例如 lg[8] = 3，因为 2^3 = 8
int lg[100001] = {-1};

// ST表核心数组：maxn[j][k] 表示从位置j开始的长度为2^k的区间最大值
int maxn[100001][50] = {0};

int main() {
    int n = 0, m = 0;
    scanf("%d%d", &n, &m);

    // 第一步：输入数组并预处理lg数组
    for(int i = 1; i <= n; i++) {
        scanf("%d", &a[i]);

        // 动态计算lg[i]：lg[i] = lg[i/2] + 1
        // 快速得到每个数的log2向下取整值
        lg[i] = lg[i/2] + 1;
    }

    // 第二步：初始化ST表的第一列（区间长度为1的情况）
    for(int i = 1; i <= n; i++) {
        maxn[i][0] = a[i]; // 区间长度为1的最大值就是自身
    }

    // 第三步：填充ST表的其他列（区间长度为2^k的情况）
    for(int k = 1; k <= lg[n]; k++) { // 遍历所有可能的指数k
        for(int j = 1; j + (1<<k) - 1 <= n; j++) {
            // 区间[j, j + (1<<k)-1] 必须不超过数组长度
            // 当前区间的最大值等于两个子区间的最大值的较大者
            // 子区间长度2^(k-1)，分成两段：
            // [j, j + 2^(k-1) -1] 和 [j + 2^(k-1), j + 2^k -1]
            maxn[j][k] = max(
                maxn[j][k-1],
                maxn[j + (1 << (k-1))][k-1]
            );
        }
    }

    // 第四步：处理查询
    int l = 0, r = 0;
    while(m--) {
        scanf("%d%d", &l, &r);

        // 计算区间长度len = r - l + 1
        int length = r - l + 1;
        int k = lg[length]; // 获取最大的指数k使得2^k <= length

        // 查询区间可分解为两个长度为2^k的区间：
        // [l, l + 2^k -1] 和 [r - 2^k + 1, r]
        // 这两个区间的并集覆盖了整个查询区间
        printf("%d\n",
            max(
                maxn[l][k],            // 第一个区间的最大值
                maxn[r - (1<<k) + 1][k] // 第二个区间的最大值
            )
        );
    }
    return 0;
}
```

### 代码模板

```cpp
#include<bits/stdc++.h>

using namespace std;

int a[100001]={};
int lg[100001]={-1};
int maxn[100001][50]={};

int main()
{
    int n=0,m=0;
    cin>>n>>m;
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        lg[i]=lg[i/2]+1;
    }

    for(int i=1;i<=n;i++)
    {
        maxn[i][0]=a[i];
    }

    for(int i=1;i<=lg[n];i++)
    {
        for(int j=1;j+(1<<i)-1<=n;j++)
        {
            maxn[j][i]=max(maxn[j][i-1],maxn[j+(1<<(i-1))][i-1]);
        }
    }

    int l=0,r=0;
    while(m--)
    {
        cin>>l>>r;
        int len=lg[r-l+1];
        cout<<max(maxn[l][len],maxn[r-(1<<(len))+1][len])<<endl;
    }
    return 0;
}
```

## 应用

先来一道模板题：[P2880 [USACO07JAN]平衡的阵容Balanced Lineup](https://www.luogu.org/problemnew/show/P2880)

```
给定N个数和M个询问，求每次询问区间内极差=最大值-最小值。
```

用 ST 表求出区间最大值、最小值即可，最小值同理（最小值也满足那个性质）。

```cpp
#include<cstdio>
#include<algorithm>

using namespace std;

int a[100001]={};
int lg[100001]={-1};
int maxn[100001][50]={};
int minn[100001][50]={};

int main()
{
    int n=0,m=0;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        lg[i]=lg[i/2]+1;
        maxn[i][0]=a[i];
        minn[i][0]=a[i];
    }
    for(int i=1;i<=lg[n];i++)
    {
        for(int j=1;j+(1<<i)-1<=n;j++)
        {
            maxn[j][i]=max(maxn[j][i-1],maxn[j+(1<<(i-1))][i-1]);
            minn[j][i]=min(minn[j][i-1],minn[j+(1<<(i-1))][i-1]);
        }
    }
    int l=0,r=0;
    while(m--)
    {
        scanf("%d%d",&l,&r);
        int len=lg[r-l+1];
        printf("%d\n",max(maxn[l][len],maxn[r-(1<<len)+1][len])-
        min(minn[l][len],minn[r-(1<<len)+1][len]));
    }
    return 0;
}
```

ST 表还能维护很多东西，只要满足重叠性性质的**静态**问题都能维护，但 ST 表较难修改。于是就有了这道省选题（JSOIWC2019Day4T1）：

```
给定N个整数和M个询问，每次询问给定一个X，求有多少个区间[L,R]使得A[L]~A[R]的GCD为X。
```

算法 1：

暴力枚举每一个区间求 GCD。

复杂度：$O(MN^3\log A)$

期望得分：0

算法 2：

把所有区间 GCD 预处理出来，扔进 map 里。

复杂度：$O(N^2\log N+N\log A+M\log N)$

期望得分：50

算法 3：

GCD 满足重叠性性质，因此可以用 ST 表求出每个区间 GCD。

以每个数为起点的区间 GCD 最多 $O(\log N)$ 个（每次变化至少变小一半）。可以二分出第一次变化的点，记录出现次数，插入 map 即可。

复杂度：$O(N\log^2 N+N\log N\log A+M\log N)$

期望得分：100

## 进阶

假设有个出题人故意卡你……

```
有N个数，M次询问，每次给定区间[L,R]，求区间内的最大值。

N<=2*10^7,M<=2*10^7,随机数据，时限5s
```

预处理都超时了。怎么办？要想方设法降低 ST 表的构造时间。

分块 + ST 表（思路引自 @[xhhkwy](https://www.luogu.org/space/show?uid=96592)）：

```
将序列分成长度是logN的块，预处理出每一块的前缀min与后缀min，
然后在把每一个块的最小值拉出来跑st，
预处理时间复杂度为N + (N/logN)*log(N/logN) = O(N)，
询问的话如果两个端点在一个块中那么暴力，时间复杂度O(logN)。
否则直接查st表+前后缀min
```

注意，只有数据随机的情况才能使大部分查询操作复杂度为 O(1)。如果题目没有写明"随机数据"，不要轻易使用。

## 后记

ST 表解决的是静态 RMQ。动态修改的场景下，线段树才是主流选择，需要分清两者各自的适用条件。