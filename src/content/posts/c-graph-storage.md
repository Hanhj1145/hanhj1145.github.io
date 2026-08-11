---
title: 图的存储
published: 2025-07-11
description: OI 中最常用的三种图存储方式：邻接矩阵、邻接表和链式前向星的原理、代码与适用场景。
tags: [图论, 数据结构]
category: 图论
lang: zh_CN
draft: false
---

# 图的存储：三种常用表示方法

在 OI 中处理图，首先要学会如何存储它。存储方式影响空间占用，也影响算法效率。本文介绍最常用的三种：**邻接矩阵**、**邻接表**和**链式前向星**。

## 1. 邻接矩阵（Adjacency Matrix）

用二维数组 `adj[N][N]` 表示图。

- **无权图**：`adj[i][j]` 为 1 表示顶点 i 和 j 之间有边，为 0 表示无边。
- **带权图**：`adj[i][j]` 存储边 `(i, j)` 的权重，无边时用一个特殊值（如 `INF`）表示。

```cpp
const int MAXN = 100; // 最大顶点数
const int INF = 0x3f3f3f3f; // 表示无穷大，用于无边或不可达

int adj[MAXN][MAXN]; // 邻接矩阵

void init_matrix(int n) {
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (i == j) {
                adj[i][j] = 0; // 自己到自己距离为0
            } else {
                adj[i][j] = INF; // 初始时无边为无穷大
            }
        }
    }
}

// 添加边 (u, v)，权重为w
void add_edge_matrix(int u, int v, int w) {
    adj[u][v] = w;
    // 如果是无向图，还需要：
    // adj[v][u] = w;
}
```

![邻接矩阵示意图](https://img-blog.csdnimg.cn/23a034a204844b6d9c0d5b76477cd535.png)

**优点：**

- 实现和理解简单。
- 判断边是否存在只需 O(1)，直接查询 `adj[i][j]`。

**缺点：**

- 空间复杂度高，无论边数多少都要 $O(|V|^2)$。顶点较多时容易内存超限。
- 遍历邻居需扫一行，$O(|V|)$。对稀疏图效率低。

**适用场景：** 顶点数较少（通常 $|V| \le 1000$）的稠密图。

## 2. 邻接表（Adjacency List）

为每个顶点维护一个列表，存储与该顶点直接相连的所有顶点。

- 通常用 `vector<int>[]`（无权图）或 `vector<pair<int,int>>[]`（带权图）实现。

```cpp
const int MAXN = 100005; // 最大顶点数

// 无权图
vector<int> adj_list_unweighted[MAXN];

// 带权图 (存储pair<邻居顶点, 边权重>)
vector<pair<int, int>> adj_list_weighted[MAXN];

// 添加无权边 (u, v)
void add_edge_list_unweighted(int u, int v) {
    adj_list_unweighted[u].push_back(v);
    // 如果是无向图，还需要：
    // adj_list_unweighted[v].push_back(u);
}

// 添加带权边 (u, v)，权重为w
void add_edge_list_weighted(int u, int v, int w) {
    adj_list_weighted[u].push_back({v, w});
    // 如果是无向图，还需要：
    // adj_list_weighted[v].push_back({u, w});
}
```

**优点：**

- 只存实际存在的边，空间 $O(|V|+|E|)$，对稀疏图高效。
- 遍历邻居只需扫对应列表，复杂度 $O(degree(V))$。

**缺点：**

- 判断边是否存在要遍历邻接列表，最坏 $O(|V|)$。
- 实现比邻接矩阵略复杂。

**适用场景：** 顶点数较多或边数较少时，是 OI 中最常用和推荐的存储方式。

## 3. 链式前向星

一种用数组模拟链表的邻接表实现，通过 `head` 数组和 `next` 数组把属于同一个顶点的边串起来。

**基本结构：**

- `head[u]`：以顶点 u 为起点的第一条边的索引。
- `edge[k]`：第 k 条边的信息（终点 v、权重 w）。
- `next[k]`：与第 k 条边同起点的下一条边的索引。
- `cnt`：当前边的总数。

```cpp
const int MAXN = 100005;
const int MAXM = 200005; // 无向图一条边存两次，通常为顶点数的2倍

struct Edge {
    int to;    // 边的终点
    int weight; // 边的权重
    int next;  // 同起点的下一条边的索引
};

Edge edges[MAXM];
int head[MAXN]; // head[u] 以u为起点的第一条边的索引
int cnt;

void init_forward_star() {
    cnt = 0;
    for (int i = 0; i < MAXN; ++i) {
        head[i] = -1;
    }
}

// 头插法添加边
void add_edge_forward_star(int u, int v, int w) {
    edges[cnt].to = v;
    edges[cnt].weight = w;
    edges[cnt].next = head[u]; // 新边的下一条是原来的第一条
    head[u] = cnt;             // head[u] 指向新边
    cnt++;

    // 如果是无向图，还需要添加反向边
    // edges[cnt].to = u;
    // edges[cnt].weight = w;
    // edges[cnt].next = head[v];
    // head[v] = cnt;
    // cnt++;
}

// 遍历顶点u的所有邻居
void traverse_forward_star(int u) {
    for (int i = head[u]; i != -1; i = edges[i].next) {
        int v = edges[i].to;
        int w = edges[i].weight;
        // 对邻居v和边权重w进行操作
    }
}
```

![链式前向星](https://img-blog.csdnimg.cn/a82c5b83236a43c8a667076ace71a2c5.png)

**优点：**

- 空间 $O(|V|+|E|)$，和邻接表类似。
- 边存储在连续内存中，比 `vector` 的 `push_back` 更缓存友好，极限数据下表现更好。
- 在需要遍历边并修改（如 Kruskal）或某些高级算法（如网络流）中结构更顺手。

**缺点：**

- 需要手动维护 `head`、`next`、`edges` 数组，容易出错。
- 判断边是否存在同样要遍历。

**适用场景：** 顶点数和边数都较大、对常数优化有要求，或需要特殊边操作时。初学者通常选邻接表更安全。

## 总结与选择

| 存储方式 | 空间复杂度 | 判断边是否存在 | 遍历邻居效率 | 实现难度 |
|----------|-----------|--------------|-------------|---------|
| 邻接矩阵 | $O(|V|^2)$ | O(1) | $O(|V|)$ | 简单 |
| 邻接表 | $O(|V|+|E|)$ | $O(degree)$ | $O(degree)$ | 中等 |
| 链式前向星 | $O(|V|+|E|)$ | $O(degree)$ | $O(degree)$ | 较难 |

最推荐的是**邻接表**，空间和时间上平衡得很好，用 `vector` 实现简单且安全。链式前向星在需要极致性能或特定算法时会用到，但对大多数图论问题，邻接表已经足够。

