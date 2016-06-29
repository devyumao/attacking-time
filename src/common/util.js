/**
 * @file 工具
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    /**
     * 工具
     *
     * @exports util
     * @namespace
     */
    var util = {};

    /**
     * 判断是否为数组
     *
     * @param {*} item 待判定量
     * @return {boolean} 是否为数组
     */
    util.isArray = function (item) {
        return Object.prototype.toString.call(item).slice(8, -1) === 'Array';
    };

    /**
     * 根据概率随机命中
     *
     * @param {number} p 概率
     * @return {boolean} 是否命中
     */
    util.proba = function (p) {
        p = p * 10 || 1;
        var odds = Math.floor(Math.random() * 10);
        return p === 1 || odds < p;
    };

    /**
     * 设置继承关系
     *
     * @param {Function} type 子类
     * @param {Function} superType 父类
     * @return {Function} 子类
     */
    util.inherits = function (type, superType) {
        var Empty = function () {};
        Empty.prototype = superType.prototype;
        var proto = new Empty();

        var originalPrototype = type.prototype;
        type.prototype = proto;

        for (var key in originalPrototype) {
            proto[key] = originalPrototype[key];
        }
        type.prototype.constructor = type;

        return type;
    };

    /**
     * 添加 hover 效果
     *
     * @param {Phaser.Button} btn 按钮
     * @param {*} target 待加效果目标
     */
    util.addHover = function (btn, target) {
        var events = btn.events;
        target = target ? target : btn;
        var originAlpha = target.alpha;

        events.onInputDown.add(function () {
            target.alpha = originAlpha * 0.8;
        });
        events.onInputUp.add(function () {
            target.alpha = originAlpha;
        });
    };

    /**
     * 首字母大写
     *
     * @param {string} str 字串
     * @return {string} 首字母大写的字串
     */
    util.firstToUpperCase = function (str) {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
    };

    return util;

});
