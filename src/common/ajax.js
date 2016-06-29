/**
 * @file AJAX
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    /**
     * 数据转换为请求格式
     *
     * @param {Object} data 数据
     * @return {string} 请求串
     */
    function toQuery(data) {
        var query = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return query.join('&');
    }

    /**
     * 发送 POST 请求
     *
     * @param {Object} settings 设置
     * @param {string} settings.url URL
     * @param {Object} setting.data 数据
     * @param {Function} setting.success 成功回调
     * @param {Function} setting.failure 失败回调
     */
    function post(settings) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    settings.success && settings.success(xhr.responseText, xhr);
                }
                else {
                    settings.failure && settings.failure(xhr.status, xhr);
                }
            }
        };
        xhr.open('POST', settings.url ? settings.url : '');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(this.toQuery(settings.data ? settings.data : {}));
    }

    /**
     * 发送 GET 请求
     *
     * @param {Object} settings 设置
     * @param {string} settings.url URL
     * @param {Object} setting.data 数据
     * @param {Function} setting.success 成功回调
     * @param {Function} setting.failure 失败回调
     */
    function get(settings) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    settings.success && settings.success(xhr.responseText, xhr);
                }
                else {
                    settings.failure && settings.failure(xhr.status, xhr);
                }
            }
        };
        var data = settings.data || {};
        var url = settings.url || '';
        url += url.indexOf('?') === -1 ? '?' + this.toQuery(data) : '&' + this.toQuery(data);
        xhr.open('GET', url);
        xhr.send();
    }

    return {
        toQuery: toQuery,
        post: post,
        get: get
    };

});
