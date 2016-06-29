/**
 * @file 前景
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var util = require('common/util');
    var Easing = require('common/Easing');

    /**
     * 前景
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {number} options.objects 前景对象组
     */
    function Foreground(game, options) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 前景对象组
         *
         * @type {Array.<Object|Array<>}
         */
        this.objects = options.objects;

        /**
         * Phaser 元素组
         * 不使用 Phaser.Group 的原因: 坐标处理比较棘手
         *
         * @type {Array}
         */
        this.elements = [];

        this._init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Foreground.prototype._init = function () {
        this.update();
    };

    /**
     * 更新
     *
     * @public
     */
    Foreground.prototype.update = function () {
        var elements = [];

        // 逐层收集, 最多两层
        this.objects.forEach(function (obj) {
            var el = obj.getPhaserObjects();
            if (!el) {
                return;
            }

            if (util.isArray(el)) {
                el.forEach(function (item) {
                    if (!item) {
                        return;
                    }

                    elements.push(item);
                });
            }
            else {
                elements.push(el);
            }
        });

        this.elements = elements;
    };

    /**
     * 移动
     *
     * @public
     * @param {number} offsetX 水平位移
     * @return {Promise}
     */
    Foreground.prototype.move = function (offsetX) {
        var game = this.game;
        var elements = this.elements;
        offsetX += '';
        var promises = [];

        elements.forEach(function (el, index) {
            var move = game.add.tween(el)
                .to({x: offsetX}, 300, Easing.Linear.None);
            promises.push(
                new Promise(function (resolve) {
                    move.onComplete.add(resolve);
                })
            );
            move.start();
        });

        return Promise.all(promises);
    };

    return Foreground;

});
