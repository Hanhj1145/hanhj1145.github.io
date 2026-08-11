---
title: 最小生成树
published: 2025-07-27
description: Kruskal 与 Prim 两种最小生成树算法：思想、模板代码、时间复杂度对比与选型建议。
tags: [图论, 最小生成树]
category: 图论
lang: zh_CN
draft: false
---

# 最小生成树

给定一个**无向带权连通图**，最小生成树（Minimum Spanning Tree, MST）是原图的一个子图：包含所有顶点，用最少的边让所有顶点连通，且边权之和最小。经典问题：一组城市和若干待建道路，每条有建设成本，要求所有城市互相可达且总成本最低。

求解有两个核心算法：**Kruskal 算法**和**Prim 算法**。

## 1. Kruskal 算法

Kruskal 基于贪心：总是优先选权重**最小**、且不会使两个端点成环的边。

### 核心思路

1. 所有边按权重从小到大排序。
2. 遍历每条边 `(u, v)`：
   - `u`、`v` 属于不同连通分量（加边不成环）→ 加入 MST，合并两个集合。
   - 已被同一连通分量包含 → 跳过。
3. 重复直到选了 V-1 条边，或所有边都考虑完毕。

判断是否成环要用**并查集（DSU）**：`find(u) == find(v)` 说明已在同一集合，加 `(u,v)` 会成环，否则可以加并合并。

```cpp
struct Edge {
    int u, v, weight;
};

vector<Edge> edges; // 存储所有边
DSU dsu;            // 并查集对象

vector<Edge> Kruskal(int V, vector<Edge>& edges_list) {
    sort(edges_list.begin(), edges_list.end(), [](const Edge& a, const Edge& b) {
        return a.weight < b.weight; // 按权重升序排序
    });

    dsu.init(V);
    vector<Edge> MST_Edges;
    long long total_weight = 0;

    for (const Edge& edge : edges_list) {
        if (dsu.find(edge.u) != dsu.find(edge.v)) {
            MST_Edges.push_back(edge);
            dsu.unite(edge.u, edge.v);
            total_weight += edge.weight;

            if (MST_Edges.size() == V - 1) { // 找到V-1条边，构建完成
                break;
            }
        }
    }
    // 可选：检查 MST_Edges.size() 是否为 V-1，不是说明图不连通
    return MST_Edges;
}
```

### 模板

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=2e5+10;
int n,m,z,x,y;
int ft[M];
struct node
{
	int u,v,w;
}ed[M];
bool cmp(node x,node y)
{
	return x.w<y.w;
}
int fd(int x)
{
	return ft[x]==x?x:ft[x]=fd(ft[x]);
}
void merge(int x,int y)
{
	int fx=fd(x);
	int fy=fd(y);
	if(fx!=fy)ft[fy]=fx;
	return;
}
int MST()
{
	sort(ed+1,ed+m+1,cmp);
	int ans=0,cnt=0;
	for(int i=1;i<=m;i++)
	{
		int fu=fd(ed[i].u);
		int fv=fd(ed[i].v);
		if(fu!=fv)
		{
			merge(ed[i].u,ed[i].v);
			ans+=ed[i].w;
			cnt++;
			if(cnt==n-1)
			{
				return ans;
			}
		}
	}
	return 0;
}
int main()
{
	cin>>n>>m;
	for(int i=1;i<=n;i++)
	{
		ft[i]=i;
	}
	for(int i=1;i<=m;i++)
	{
		cin>>ed[i].u>>ed[i].v>>ed[i].w;
	}
	int mm=MST();
	if(mm!=0)
	{
		cout<<mm<<endl;
	}
	else
	{
		cout<<"orz"<<endl;
	}
	return 0;
}
```

**复杂度：**

- 边排序 $O(E\log E)$，并查集操作 $O(E\alpha(V))$（$\alpha$ 为阿克曼函数的反函数，可视为常数）。
- 总计 $O(E\log E)$。
- 空间 $O(V+E)$：存边 $O(E)$，并查集 $O(V)$。

**适用场景：** 稀疏图（E 远小于 $V^2$）或边数相对较少时。

## 2. Prim 算法

Prim 从某个起始顶点开始，逐步"生长"出一棵树。它维护一个不断扩大的 MST，每次选一条连接树内顶点和树外顶点的**最短边**，把那棵树外顶点加入。

### 核心思路

1. 选一个起始顶点加入树。
2. 用优先队列维护连接树内外顶点的边，按权重排序。
3. 重复直到所有顶点入树：
   - 取出权最小的边 `(u, v)`（u 在树内，v 不在），把 v 加入树。
   - 对 v 的所有邻居 x：若 x 不在树内，把 `(v, x)` 加入优先队列。

### 朴素 Prim（邻接矩阵）

用 `lowcost[V]` 记录每个顶点到 MST 的最小边权，用 `visited` 标记。每次找最小的 `lowcost` 顶点加入。复杂度 $O(V^2)$，适合稠密图。

### 堆优化 Prim（邻接表）

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 100005;
const long long INF = 0x3f3f3f3f3f3f3f3fLL;

int n, m;
vector<pair<int, int>> adj[MAXN]; // 邻接表：<邻居顶点, 边权重>
bool inMST[MAXN];
typedef pair<long long, int> PII;

long long prim() {
    memset(inMST, 0, sizeof(inMST));

    long long minCost = 0;
    int edgesCount = 0;

    // 最小堆：按权重从小到大
    priority_queue<PII, vector<PII>, greater<PII>> pq;
    pq.push({0, 1}); // 起始顶点，0 为“伪权重”

    while (!pq.empty() && edgesCount < n) {
        PII current = pq.top();
        pq.pop();

        long long w = current.first;
        int u = current.second;

        if (inMST[u]) continue; // 已访问过，用更小的边替换过了

        inMST[u] = true;
        minCost += w;
        edgesCount++;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int edge_w = edge.second;
            if (!inMST[v]) {
                pq.push({edge_w, v}); // 同一顶点可多次入队，只有最早取出的生效
            }
        }
    }

    return (edgesCount == n) ? minCost : 0; // 未连通则返回0
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    cin >> n >> m;
    for (int i = 0; i < m; ++i) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w}); // 无向图添加反向边
    }

    long long result = prim();
    if (result != 0) {
        cout << result << endl;
    } else {
        cout << "orz" << endl;
    }
    return 0;
}
```

### 模板

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M	=2e5+10;
struct node
{
	int x,w;
};
struct qnode
{
	int x,w;
	friend bool operator<(const qnode x,const qnode y)
	{
		return x.w>y.w;
	}
};
int u,v,w,n,m,s;
bool vis[M];
vector<node>ve[M];
priority_queue<qnode>q;
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(0);std::cout.tie(0);
	cin>>n>>m;

	for(int i=1;i<=m;i++)
	{
		cin>>u>>v>>w;
		ve[u].push_back({v,w});
		ve[v].push_back({u,w});
	}
	s=1;
	int cnt=0,ans=0;
	q.push({s,0});
	while(!q.empty())
	{
		int tx=q.top().x;
		int tw=q.top().w;
		q.pop();
		if(vis[tx])continue;
		vis[tx]=1;
		ans+=tw;
		cnt++;
		for(auto it:ve[tx])
		{
			if(vis[it.x]==0)
			{
				q.push({it.x,it.w});
			}
		}
	}
	if(cnt==n)
	{
		cout<<ans<<endl;
	}
	else
	{
		cout<<"orz"<<endl;
	}
	return 0;
}
```

**复杂度：**

- 堆优化 Prim 为 $O(E\log V)$（每条边最多入队一次，每次操作 $O(\log V)$ 量级）。
- 空间 $O(V+E)$：邻接表 + 优先队列 + 标记数组。

**适用场景：** 稀疏图，且 E 较大时比朴素 Prim 效率更高。

## Kruskal 与 Prim 的对比与选择

| 特性 | Kruskal 算法 | Prim 算法（堆优化） |
|------|--------------|---------------------|
| 核心思想 | 贪心，按边排序，避免成环 | 贪心，逐步扩张 MST |
| 数据结构 | 并查集 + 排序 | 优先队列（最小堆） |
| 时间复杂度 | $O(E\log E)$ | $O(E\log V)$ |
| 空间复杂度 | $O(V+E)$ | $O(V+E)$ |
| 适用场景 | 稀疏图更优，实现简单 | 稀疏图效率高，实现稍复杂 |
| 实现难度 | 较容易（依赖并查集） | 较复杂（依赖优先队列） |

**如何选择：**

- **稀疏图（E 远小于 $V^2$）**：Kruskal 和堆优化 Prim 都很高效，Kruskal 实现更简单。
- **稠密图（E 接近 $V^2$）**：朴素 Prim（$O(V^2)$）更有优势，因为 $E\log V$ 可能大于 $V^2$。
- OI 中大部分图是稀疏图，所以 **Kruskal 和堆优化 Prim 是主流**。对并查集不熟悉的话，Kruskal 可能更直观。

## 结语

最小生成树应用很广，网络布线、交通规划、生物信息学里都能见到。掌握 Kruskal 和 Prim，也能顺便加深对贪心算法和并查集、优先队列的理解。

---

部分资源来源于网络，侵权请联系删除。