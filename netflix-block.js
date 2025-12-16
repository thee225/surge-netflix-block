/**
 * Surge 脚本：拦截 Netflix GraphQL 响应
 * 
 * 重要说明：
 * 1. 必须先启用 MITM *.netflix.com 才能拦截到这些请求
 * 2. 不能直接 REJECT 整个 web.prod.cloud.netflix.com/graphql，因为该 URL 还用于：
 *    - 登录认证
 *    - 影片切换
 *    - 预览功能
 *    - 其他核心功能
 * 3. 本脚本只拦截包含特定字段（同户验证相关）的响应，其他正常请求正常通过
 * 4. iOS 上可以直接 REJECT ios.prod.cloud.netflix.com/graphql
 * 5. Web 端（电脑）必须使用脚本精确拦截，因为几乎所有功能都通过这个 URL
 * 
 * 拦截字段：
 * - clcsInterstitialLolomo: 同户验证弹窗（主页）
 * - clcsInterstitialPlaybackV2: 同户验证弹窗（播放）
 */

function shouldBlock(json) {
    if (!json || !json.data) {
        return false;
    }
    // 检查是否包含需要拦截的字段
    const hasLolomo = json.data.hasOwnProperty('clcsInterstitialLolomo');
    const hasPlayback = json.data.hasOwnProperty('clcsInterstitialPlaybackV2');
    if (hasLolomo || hasPlayback) {
        console.log("[Surge] 检测到字段 - clcsInterstitialLolomo: " + hasLolomo + ", clcsInterstitialPlaybackV2: " + hasPlayback);
        return true;
    }
    return false;
}

// 获取响应体和 URL
let body = $response.body;
let url = $request.url;

console.log("[Surge] 拦截到请求: " + url);
console.log("[Surge] 响应体长度: " + (body ? body.length : 0));

// 检查响应体是否为空
if (!body || body.length === 0) {
    console.log("[Surge] 响应体为空，直接返回");
    $done({});
    return;
}

try {
    // 尝试解析 JSON
    const json = JSON.parse(body);
    console.log("[Surge] JSON 解析成功，检查字段...");
    
    if (shouldBlock(json)) {
        console.log("[Surge] 检测到需要拦截的字段，返回空对象");
        // 复制响应头，移除压缩相关头
        let headers = {};
        if ($response.headers) {
            for (let key in $response.headers) {
                let lowerKey = key.toLowerCase();
                // 移除压缩相关头
                if (lowerKey !== 'content-encoding' && lowerKey !== 'content-length') {
                    headers[key] = $response.headers[key];
                }
            }
        }
        // 设置 Content-Type 和 Content-Length
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = "2";
        // 返回空对象
        $done({
            body: "{}",
            status: 200,
            headers: headers
        });
    } else {
        console.log("[Surge] 未检测到需要拦截的字段，正常返回");
        // 正常返回原响应
        $done({});
    }
} catch (e) {
    // 如果不是 JSON 或解析失败，正常返回
    console.warn("[Surge] 响应解析错误:", e);
    console.warn("[Surge] 响应体前100字符:", body ? body.substring(0, 100) : "null");
    $done({});
}

