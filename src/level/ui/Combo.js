/**
 * @file 连击显示
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var Easing = require('common/Easing');

    /**
     * 连击显示类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     */
    function Combo(game) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 连击数
         *
         * @type {number}
         */
        this.count = 0;

        /**
         * 主体
         *
         * @type {?Phaser.Image}
         */
        this.body = null;

        /**
         * 连击数文字元素
         *
         * @type {?Phaser.Text}
         */
        this.countText = null;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Combo.prototype.init = function () {
        var game = this.game;

        // 初始化主体
        var body = game.add.image(20, 168);
        body.alpha = 0;
        this.body = body;

        // 绘制标签
        var label = game.add.text(
            0, 0,
            'COMBO',
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('orange'),
                strokeThickness: 8,
                stroke: color.get('white')
            }
        );
        label.anchor.set(0, 0.5);
        body.addChild(label);

        // 绘制乘号
        var multipleSign = game.add.text(
            label.width + 5, 0,
            '×',
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        multipleSign.anchor.set(0, 0.5);
        body.addChild(multipleSign);

        // 绘制连击数
        var countText = game.add.text(
            multipleSign.x + multipleSign.width + 18, 0,
            this.count + '',
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('cherry'),
                strokeThickness: 8,
                stroke: color.get('white')
            }
        );
        countText.anchor.set(0.5);
        this.countText = countText;
        body.addChild(countText);
    };

    /**
     * 取得连击数
     *
     * @public
     * @return {number} 连击数
     */
    Combo.prototype.get = function () {
        return this.count;
    };

    /**
     * 显示
     *
     * @private
     */
    Combo.prototype.show = function () {
        this.game.add.tween(this.body)
            .to({alpha: 1}, 300, Easing.Quadratic.Out, true);
    };

    /**
     * 隐藏
     *
     * @private
     */
    Combo.prototype.hide = function () {
        this.game.add.tween(this.body)
            .to({alpha: 0}, 300, Easing.Quadratic.In, true);
    };

    /**
     * 增加连击数
     *
     * @public
     */
    Combo.prototype.add = function () {
        if (!this.count) {
            this.show();
        }

        var countText = this.countText;
        countText.text = ++this.count + '';

        var game = this.game;
        var duration = 200;
        var easingQuadratic = Easing.Quadratic;

        // 放大后再恢复的效果
        var largen = game.add.tween(countText.scale)
            .to({x: 1.5, y: 1.5}, duration, easingQuadratic.Out);
        var recover = game.add.tween(countText.scale)
            .to({x: 1, y: 1}, duration, easingQuadratic.In);
        largen.chain(recover);
        largen.start();
    };

    /**
     * 重置
     *
     * @public
     */
    Combo.prototype.reset = function () {
        if (this.count) {
            this.hide();
            this.count = 0;
        }
    };

    return Combo;

});
