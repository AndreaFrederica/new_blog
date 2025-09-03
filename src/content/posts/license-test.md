---
title: "代码许可证测试"
description: "测试代码块许可证功能"
published: 2024-12-21
tags: ["test", "license"]
category: "Test"
draft: false
---

# 代码许可证测试

这个文件用于测试代码块许可证功能。

## 预配置许可证测试

### MIT 许可证

```javascript license:mit
function helloWorld() {
  console.log("Hello, World!");
}
```

### Apache 2.0 许可证

```python license:apache_2_0
def greet(name):
    return f"Hello, {name}!"
```

### CC BY-NC 4.0 许可证

```html license:cc_by_nc_4_0
<div class="greeting">
  <h1>Welcome!</h1>
</div>
```

## 手动配置许可证测试

### 简单格式

```typescript license:custom-license
interface User {
  id: number;
  name: string;
  email: string;
}
```

### JSON 格式

```css license:{"name":"自定义CSS许可证","url":"/license/custom-css","icon":"🎨"}
.custom-style {
  color: #333;
  background: #f5f5f5;
  padding: 1rem;
}
```

### 键值对格式

```bash license:name=Bash脚本许可证&url=/license/bash&icon=💻
#!/bin/bash
echo "Hello from Bash!"
```

## 复杂配置测试

### 带徽章的许可证

```java license:{"name":"Java企业许可证","url":"https://example.com/license","icon":"☕","badge":"https://img.shields.io/badge/License-Enterprise-blue"}
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 自定义颜色

```go license:{"name":"Go许可证","url":"/license/go","icon":"🐹","color":"#00ADD8"}
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

## 无许可证代码块

```javascript
// 这个代码块没有许可证信息
function noLicense() {
  return "No license specified";
}
```
