# Netflix GraphQL 拦截模块

Surge 模块，用于拦截并修改 Netflix GraphQL 响应，移除 `clcsInterstitialLolomo` 和 `clcsInterstitialPlaybackV2` 字段。

## 使用方法

在 Surge 中：
1. 打开 Surge → 模块
2. 点击"从 URL 导入"
3. 粘贴以下 URL：
   ```
   https://raw.githubusercontent.com/你的用户名/仓库名/main/netflix-block-inline.sgmodule
   ```
4. 启用模块

## 文件说明

- `netflix-block-inline.sgmodule` - Surge 模块文件（推荐使用，内联脚本）
- `netflix-block.sgmodule` - 使用外部脚本文件的版本
- `netflix-block.js` - 外部脚本文件

