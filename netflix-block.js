/**
 * Surge 脚本：拦截 Netflix GraphQL 响应
 * 移除包含 clcsInterstitialLolomo 或 clcsInterstitialPlaybackV2 的响应
 */

function shouldBlock(json) {
    if (!json || !json.data) return false;
    return json.data.hasOwnProperty('clcsInterstitialLolomo') || json.data.hasOwnProperty('clcsInterstitialPlaybackV2');
}

// 获取响应体
let body = $response.body;

try {
    // 尝试解析 JSON
    const json = JSON.parse(body);
    
    if (shouldBlock(json)) {
        console.log("[Surge] 拦截到包含目标字段的响应，返回空对象");
        // 复制响应头
        let headers = {};
        if ($response.headers) {
            for (let key in $response.headers) {
                headers[key] = $response.headers[key];
            }
        }
        // 设置 Content-Type
        headers["Content-Type"] = "application/json";
        // 返回空对象
        $done({
            body: "{}",
            status: 200,
            headers: headers
        });
    } else {
        // 正常返回原响应
        $done({});
    }
} catch (e) {
    // 如果不是 JSON 或解析失败，正常返回
    console.warn("[Surge] 响应解析错误:", e);
    $done({});
}

