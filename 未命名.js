

(function() {
    'use strict';

    const targetUrl = "web.prod.cloud.netflix.com/graphql";

    function shouldBlock(json) {
        if (!json || !json.data) return false;
        return json.data.hasOwnProperty('clcsInterstitialLolomo') || json.data.hasOwnProperty('clcsInterstitialPlaybackV2');
    }

    // Patch fetch
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input?.url;
        if (url && url.includes(targetUrl)) {
            return originalFetch.call(this, input, init).then(async resp => {
                try {
                    const clone = resp.clone();
                    const text = await clone.text();
                    const json = JSON.parse(text);
                    if (shouldBlock(json)) {
                        console.log("[Tampermonkey] Blocked fetch with target field(s)");
                        return new Response("{}", {
                            status: 200,
                            headers: { "Content-Type": "application/json" }
                        });
                    }
                } catch (e) {
                    console.warn("[Tampermonkey] Fetch intercept error:", e);
                }
                return resp;
            });
        }
        return originalFetch.call(this, input, init);
    };

    // Patch XMLHttpRequest
    const OriginalXHR = window.XMLHttpRequest;
    function XHRProxy() {
        const xhr = new OriginalXHR();
        let requestUrl = '';

        const open = xhr.open;
        xhr.open = function(method, url, ...args) {
            requestUrl = url;
            return open.call(this, method, url, ...args);
        };

        const send = xhr.send;
        xhr.send = function(body) {
            if (requestUrl && requestUrl.includes(targetUrl)) {
                const self = this;
                const origOnReadyStateChange = self.onreadystatechange;
                self.onreadystatechange = function() {
                    try {
                        if (self.readyState === 4 && self.status === 200) {
                            let json;
                            try {
                                json = JSON.parse(self.responseText);
                            } catch { json = null; }
                            if (shouldBlock(json)) {
                                console.log("[Tampermonkey] Blocked XHR with target field(s)");
                                Object.defineProperty(self, 'responseText', {value: '{}'});
                                Object.defineProperty(self, 'response', {value: '{}'});
                            }
                        }
                    } catch(e) {
                        console.warn("[Tampermonkey] XHR intercept error:", e);
                    }
                    if (origOnReadyStateChange) origOnReadyStateChange.apply(this, arguments);
                };
            }
            return send.call(this, body);
        };

        return xhr;
    }
    window.XMLHttpRequest = XHRProxy;
})();