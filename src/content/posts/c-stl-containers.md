---
title: STL 容器详解及用法指南
published: 2025-07-11
description: C++ STL 常用容器 vector、list、deque、set、map、stack、queue 和 pair 的特点与常用操作。
tags: [C++, STL]
category: 语法
lang: zh_CN
draft: false
---

# STL（标准模板库）容器详解及其操作用法

C++ 的标准模板库（STL）提供了一系列数据结构，称为容器。常用的有 `vector`、`list`、`queue`、`deque`、`set`、`map`、`stack` 等。下面逐个介绍特点和常用操作。

**下方所有代码均省略 `using namespace std;`**

## 1. `vector`

### 特点

- 支持动态大小调整，类似数组。
- 随机访问 O(1)。
- 需要增长时，可能重新分配内存。

### 常用操作

```cpp
#include <vector>
#include <iostream>

int main() {
    vector<int> vec;

    // 添加元素
    vec.push_back(10);
    vec.push_back(20);
    vec.push_back(30);

    // 遍历
    cout << "Vector elements: ";
    for (const auto& v : vec) { // 也可以是 for(auto v:vec)
        cout << v << " ";  // 10 20 30
    }

    // 清空元素
    vec.clear();
    cout << "After clear, size: " << vec.size() << endl;  // 0

    return 0;
}
```

## 2. `list`

### 特点

- 支持快速插入和删除。
- 不支持随机访问。

### 常用操作

```cpp
#include <list>
#include <iostream>

int main() {
    list<int> lst;

    // 添加元素
    lst.push_back(10);
    lst.push_back(20);
    lst.push_front(5); // 在头部插入元素

    // 遍历
    cout << "List elements: ";
    for (const auto& v : lst) {
        cout << v << " "; // 5 10 20
    }
    cout << endl;

    // 清空元素
    lst.clear();
    cout << "After clear, size: " << lst.size() << endl;  // 0

    return 0;
}
```

## 3. `deque`

### 特点

- 支持双端插入和删除。
- 随机访问 O(1)。

### 常用操作

```cpp
#include <deque>
#include <iostream>

int main() {
    deque<int> deq;

    // 添加元素
    deq.push_back(10);
    deq.push_front(5);
    deq.push_back(20);

    // 遍历
    cout << "Deque elements: ";
    for (const auto& v : deq) {
        cout << v << " "; // 5 10 20
    }
    cout << endl;

    // 清空元素
    deq.clear();
    cout << "After clear, size: " << deq.size() << endl;  // 0

    return 0;
}
```

## 4. `set`

### 特点

- 元素自动排序。
- 不允许重复元素。

### 常用操作

```cpp
#include <set>
#include <iostream>

int main() {
    set<int> s;

    // 添加元素
    s.insert(10);
    s.insert(20);
    s.insert(10); // 尝试插入重复元素，被忽略

    // 遍历（自动升序）
    cout << "Set elements: ";
    for (const auto& v : s) {
        cout << v << " "; // 10 20
    }
    cout << endl;

    // 清空元素
    s.clear();
    cout << "After clear, size: " << s.size() << endl;  // 0

    return 0;
}
```

## 5. `map`

### 特点

- 自动排序的键值对。
- 不允许重复键。

### 常用操作

```cpp
#include <map>
#include <iostream>

int main() {
    map<string, int> m;

    // 添加元素
    m["apple"] = 10;
    m["banana"] = 20;

    // 遍历（按键升序）
    cout << "Map elements: ";
    for (const auto& pair : m) {
        cout << pair.first << ": " << pair.second << " "; // apple: 10 banana: 20
    }
    cout << endl;

    // 清空元素
    m.clear();
    cout << "After clear, size: " << m.size() << endl;  // 0

    return 0;
}
```

## 6. `stack`

### 特点

- 先进后出（FILO），只能在一端（顶端）操作元素。

### 常用操作

```cpp
#include <stack>
#include <iostream>

int main() {
    stack<int> stk;

    // 添加元素
    stk.push(10);
    stk.push(20);
    stk.push(30);

    // 遍历（需要临时存储到另一个容器）
    cout << "Stack elements (top to bottom): ";
    stack<int> temp = stk; // 使用临时栈
    while (!temp.empty()) {
        cout << temp.top() << " ";
        temp.pop();
    }
    cout << endl;

    // 清空元素
    while (!stk.empty()) {
        stk.pop();
    }
    cout << "After clear, size: " << stk.size() << endl;  // 0

    return 0;
}
```

## 7. `queue`

### 特点

- 先进先出（FIFO），在一端插入、另一端删除。

### 常用操作

```cpp
#include <queue>
#include <iostream>

int main() {
    queue<int> q;

    // 添加元素
    q.push(10);
    q.push(20);
    q.push(30);

    // 遍历（需要临时存储到另一个容器）
    cout << "Queue elements (front to back): ";
    queue<int> temp = q; // 使用临时队列
    while (!temp.empty()) {
        cout << temp.front() << " ";
        temp.pop();
    }
    cout << endl;

    // 清空元素
    while (!q.empty()) {
        q.pop();
    }
    cout << "After clear, size: " << q.size() << endl;  // 0

    return 0;
}
```

## 8. `pair`

`pair` 可以把两个数据组合成一个单元，常用于需要返回两个值的函数，或在 `map` 之类的容器中存键值对。

```cpp
int main() {
    // 直接初始化
    pair<string, int> p1("Tom", 18);

    // 使用 make_pair
    auto p2 = make_pair("Jerry", 20);
    p2 = {"Lubby", 19};

    // 输出结果
    cout << "p1: " << p1.first << ", " << p1.second << endl;
    cout << "p2: " << p2.first << ", " << p2.second << endl;

    return 0;
}
```

## 总结

STL 容器提供了高效且灵活的数据结构，选对容器可以让代码更简洁、更高效。做题时先想清楚需要的操作（随机访问？头尾插入？自动排序？），再挑对应的容器。