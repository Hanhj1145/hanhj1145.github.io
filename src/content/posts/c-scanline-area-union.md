---
title: 扫描线（矩形面积并）
published: 2025-07-29
description: 扫描线算法解决二维矩形面积并问题，化面为线，配合线段树维护有效高度，附完整C++实现。
tags: [算法, 计算几何, 线段树]
category: 算法
lang: zh_CN
draft: false
---

# 扫描线（矩形面积并）

> 扫描线一般运用在图形上面，它和它的字面意思十分相似，就是一条线在整个图上扫来扫去，它一般被用来解决图形面积、周长以及二维数点等问题。 —— [OI Wiki，扫描线](https://oi-wiki.org/geometry/scanning/)

## 二维矩形面积并问题

在二维坐标系上给出多个矩形的左下以及右上坐标，求出所有矩形构成的图形的面积，重叠部分只算一次。

![扫描线示意图](https://oi-wiki.org/geometry/images/scanning.svg)

## 核心思想

不要让矩形看成一个个"面"，而是把它拆成两条竖直的边（事件）：

- **左边**：扫描线碰到它，说明**进入**了矩形区域，标记 `+1`。
- **右边**：扫描线碰到它，说明**离开**了矩形区域，标记 `-1`。

每条边包含三个信息：所在的 x 坐标、纵向范围 $[y_1, y_2]$、是左边还是右边。例如矩形 $(x_1,y_1,x_2,y_2)$ 会拆成两个事件：

- $(x_1, y_1, y_2, +1)$
- $(x_2, y_1, y_2, -1)$

把所有事件按 x 坐标从小到大排序，然后从左到右处理：

1. 相邻两个事件之间夹着一个"条形"区域，宽度等于两事件 x 坐标之差。
2. 这个条形的高度，就是当前扫描线上被矩形覆盖的总有效长度。
3. 面积增量 = 宽度 × 有效高度，累加所有增量即得总面积。
4. 处理完一个事件后，根据它是左边还是右边，更新线段树上 $[y_1, y_2]$ 的覆盖情况。

## 有效高度怎么算

需要一种数据结构快速完成：区间 $[y_1, y_2]$ 覆盖数 ±1，以及查询整条扫描线的覆盖总长度。

Y 坐标可能非常大（到 $10^9$），开不下那么大的数组，所以要离散化：把所有出现过的 y 坐标收集起来排序去重，映射成紧凑下标。

离散化之后用线段树：

- 每个叶子节点代表一个最小 y 区间 $[y_i, y_{i+1}]$，非叶子节点代表子区间并集。
- 每个节点存两个信息：`cover` 表示该区间被矩形完整覆盖的次数；`len` 表示该区间内被覆盖的有效长度。
- 更新逻辑 `pushup(u)`：

  - 若 `cover[u] > 0`，整个区间都被覆盖，`len[u]` 等于区间实际长度。
  - 若 `cover[u] == 0`，有效长度等于左右儿子 `len` 之和。

流程串起来就是：遇到左边在 $[y_1, y_2]$ 上 `cover +1`，遇到右边 `cover -1`，每次更新后根节点的 `len` 就是当前有效高度。

## C++ 代码实现

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 事件边
struct Edge {
    double x;      // 边的 x 坐标
    double y1, y2; // 边的纵向范围
    int flag;      // 左边(+1) 或 右边(-1)
    // 按 x 排序
    bool operator<(const Edge& other) const {
        return x < other.x;
    }
};

// 线段树节点
struct Node {
    int cover;   // 区间被覆盖的次数
    double len;  // 区间内被覆盖的有效长度
};

vector<Edge> edges;       // 所有事件边
vector<double> y_coords;  // 不重复的y坐标，用于离散化
vector<Node> tree;        // 线段树

// y 离散化后的索引
int find_y_index(double y) {
    return lower_bound(y_coords.begin(), y_coords.end(), y) - y_coords.begin();
}

void pushup(int u, int l, int r) {
    if (tree[u].cover > 0) {
        // 完全覆盖：有效长度就是区间实际长度
        tree[u].len = y_coords[r + 1] - y_coords[l];
    } else if (l == r) {
        tree[u].len = 0;
    } else {
        tree[u].len = tree[u * 2].len + tree[u * 2 + 1].len;
    }
}

// 区间更新：[update_l, update_r]，k 为 +1 或 -1
void update(int u, int l, int r, int update_l, int update_r, int k) {
    if (r < update_l || l > update_r) return; // 完全在区间外

    if (update_l <= l && r <= update_r) {     // 完全覆盖目标区间
        tree[u].cover += k;
        pushup(u, l, r);
        return;
    }

    int mid = l + (r - l) / 2;
    update(u * 2, l, mid, update_l, update_r, k);
    update(u * 2 + 1, mid + 1, r, update_l, update_r, k);
    pushup(u, l, r);
}

int main() {
    int n;
    cout << "请输入矩形数量: ";
    cin >> n;

    for (int i = 0; i < n; ++i) {
        double x1, y1, x2, y2;
        cout << "请输入第 " << i + 1 << " 个矩形的 x1, y1, x2, y2: ";
        cin >> x1 >> y1 >> x2 >> y2;

        edges.push_back({x1, y1, y2, 1});
        edges.push_back({x2, y1, y2, -1});

        y_coords.push_back(y1);
        y_coords.push_back(y2);
    }

    // 1. 离散化 y 坐标
    sort(y_coords.begin(), y_coords.end());
    y_coords.erase(unique(y_coords.begin(), y_coords.end()), y_coords.end());
    int m = y_coords.size(); // m 个点 -> m-1 个区间，索引范围 0 ~ m-2

    // 2. 排序事件边
    sort(edges.begin(), edges.end());

    // 3. 初始化线段树（4倍大小）
    tree.resize(m * 4);

    long long total_area = 0;

    // 4. 开始扫描
    for (int i = 0; i < edges.size(); ++i) {
        // 计算上一个条形区域的面积
        if (i > 0) {
            double width = edges[i].x - edges[i - 1].x;
            double height = tree[1].len; // 根节点 len 即当前有效高度
            total_area += width * height;
        }

        int y1_idx = find_y_index(edges[i].y1);
        int y2_idx = find_y_index(edges[i].y2);

        // [y1, y2] 对应离散化索引 y1_idx ~ y2_idx-1
        if (y1_idx < y2_idx) {
            update(1, 0, m - 2, y1_idx, y2_idx - 1, edges[i].flag);
        }
    }

    cout << "矩形面积并为: " << total_area << endl;
    return 0;
}
```

## 总结

扫描线算法的精髓可以概括为"化面为线，离散处理"：

1. **分割**：把二维的矩形问题降维成在一维扫描线上处理区间覆盖。
2. **排序**：所有边界（事件）按 x 排序，确定处理顺序。
3. **扫描**：从左到右处理每个事件，计算两个事件之间的窄条面积。
4. **合并**：用线段树高效计算每个窄条的"有效高度"，累加得到总面积。

这个思想不仅能求面积，还能求周长并等其他几何问题，是计算几何里很常用的一类算法。

---

部分资源来源于网络，侵权请联系删除。