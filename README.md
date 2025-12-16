# Netflix GraphQL 拦截模块

Surge 模块，用于拦截并修改 Netflix GraphQL 响应，移除 `clcsInterstitialLolomo` 和 `clcsInterstitialPlaybackV2` 字段。

## 使用方法

### 方式一：从 URL 导入（推荐）

1. 在 Surge 中打开 **模块** 页面
2. 点击 **从 URL 导入**
3. 粘贴以下 URL：
   ```
   https://raw.githubusercontent.com/thee225/surge-netflix-block/main/netflix-block-inline.sgmodule
   ```
4. 启用模块

**注意**：从 URL 导入时，需要确保 `netflix-block.js` 文件也在同一目录下，或者使用完整 URL 版本的模块。

### 方式二：本地使用

1. 下载整个仓库到本地
2. 确保 `netflix-block-inline.sgmodule` 和 `netflix-block.js` 在同一目录
3. 在 Surge 中：**模块** → **从文件导入** → 选择 `netflix-block-inline.sgmodule`
4. 启用模块

## 文件说明

- `netflix-block-inline.sgmodule` - 主模块文件（使用本地 JS 脚本）
- `netflix-block.js` - JavaScript 脚本文件（包含拦截逻辑）
- `netflix-block.sgmodule` - 备用模块文件

## 技术说明

根据 [Surge 脚本手册](http://nssurge.com/resource/surge-mac/manual/scripting)，`script-path` 支持：
- 相对路径（相对于配置文件）
- 绝对路径
- URL

本模块使用相对路径 `netflix-block.js`，需要确保脚本文件与模块文件在同一目录。

