---
title: 许可证系统测试
published: 2025-09-04
description: 测试新的许可证系统功能，包括预配置许可证和自定义许可证配置
tags: ["测试", "许可证"]
category: 测试
draft: false
license: cc_by_nc_4_0
lang: "zh_cn"
---

# 许可证系统测试

这篇文章用于测试新的许可证系统功能。

## 使用预配置许可证

这段代码使用 MIT 许可证：

```javascript license:mit
function hello() {
  console.log("Hello, World!");
}
```

这段代码使用 MPL 2.0 许可证：

```typescript license:mpl_2_0
interface User {
  id: number;
  name: string;
}

class UserService {
  getUser(id: number): User | null {
    // 实现获取用户逻辑
    return null;
  }
}
```

## 使用自定义许可证配置

这段代码使用自定义许可证：

```python license:{"id":"custom","name":"我的自定义许可证","url":"https://example.com/license","icon":"🔐","color":"#FF6B6B"}
def process_data(data):
    """处理数据的函数"""
    return data.strip().upper()
```

这段代码使用带徽章的许可证：

```javascript license:{"id":"apache","name":"Apache 2.0","url":"https://apache.org/licenses/LICENSE-2.0","badge":"https://img.shields.io/badge/License-Apache%202.0-blue.svg"}
function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}
```

## 手动配置许可证

使用键值对格式配置自定义许可证：

```python license:my_custom,name:"我的专有许可证",url:"https://mycompany.com/license"
def proprietary_algorithm():
    """这是一个专有算法"""
    return "secret sauce"
```

使用完整手动配置：

```java license:company_internal,name:"公司内部许可证",url:"https://intranet.company.com/licenses/internal",icon:"🏢",color:"#FF5722"
public class InternalTool {
    public static void main(String[] args) {
        System.out.println("Internal company tool");
    }
}
```

## 纯文本许可证

使用简单文本许可证：

```css license:"仅供学习使用"
.example {
  color: red;
  font-weight: bold;
}
```

## 复杂示例

使用 CC BY-NC 4.0 许可证的代码：

```vue license:cc_by_nc_4_0
<template>
  <div class="license-demo">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: "LicenseDemo",
  props: {
    title: String,
    description: String,
  },
};
</script>

<style scoped>
.license-demo {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
```

## 没有许可证的代码

这段代码没有指定许可证：

```bash
echo "这段代码没有许可证信息"
ls -la
```
