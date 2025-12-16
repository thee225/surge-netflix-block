# Netflix GraphQL 拦截模块

Surge 模块，用于拦截并修改 Netflix GraphQL 响应，移除 `clcsInterstitialLolomo` 和 `clcsInterstitialPlaybackV2` 字段，从而跳过 Netflix 的同户验证。

## ⚠️ 重要说明

### 为什么不能直接 REJECT 整个域名？

**不能直接 REJECT `web.prod.cloud.netflix.com/graphql`**，因为该 URL 还用于其他核心功能：
- 登录认证
- 影片切换
- 预览功能
- 其他核心功能

如果直接 REJECT，会导致 Netflix 无法正常使用。

### 为什么需要 MITM？

**必须先启用 MITM `*.netflix.com`** 才能拦截到这些 HTTPS 请求。没有 MITM，脚本无法工作。

### iOS vs Web 的区别

- **iOS 端**：可以直接 REJECT `ios.prod.cloud.netflix.com/graphql`（因为该 URL 只用于验证）
- **Web 端（电脑）**：必须使用脚本精确拦截，因为几乎所有功能都通过 `web.prod.cloud.netflix.com/graphql` 传递

### 工作原理

脚本会：
1. 拦截所有 `web.prod.cloud.netflix.com/graphql` 的响应
2. 解析 JSON 响应体
3. **只拦截**包含 `clcsInterstitialLolomo` 或 `clcsInterstitialPlaybackV2` 字段的响应
4. 将拦截的响应替换为空对象 `{}`
5. 其他正常请求**正常通过**，不影响功能

## 使用方法

### 前置条件

1. **启用 MITM**：在 Surge 中启用 MITM 功能，并添加 `*.netflix.com` 到 MITM hostname
2. **安装证书**：确保已安装并信任 Surge 的 CA 证书

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

