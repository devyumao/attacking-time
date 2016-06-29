/**
 * @file 颜色
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    /**
     * 颜色
     *
     * @type {Object}
     */
    var colors = {
        'bg': '#91d1d2',
        'white': '#fff',
        'black': '#000',
        'dark-grey': '#555',
        'darker-grey': '#333',
        'chocolate': '#a45d35',
        'beige': '#ffecb8',
        'dark-beige': '#e1d0a1',
        'coffee': '#554d36',
        'yellow': '#ffcd43',
        'cherry': '#e46462',
        'orange': '#ffad5d',
        'dark-purple': '#826865',
        'red': '#d6393a'
    };

    /**
     * 取得
     *
     * @param {string} color 颜色名称
     * @return {string} 颜色十六进制
     */
    function get(color) {
        return colors[color];
    }

    return {
        get: get
    };

});
