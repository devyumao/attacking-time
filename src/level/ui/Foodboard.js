/**
 * @file 食物栏
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var Easing = require('common/Easing');

    /**
     * 食物栏类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     */
    function Foodboard(game) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 文本
         *
         * @type {?Phaser.Text}
         */
        this.text = null;

        /**
         * 图例
         *
         * @type {?Phaser.Image}
         */
        this.legend = null;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Foodboard.prototype.init = function () {
        var game = this.game;

        // 绘制文本
        var text = game.add.text(
            game.width - 63, 20,
            global.getFoodCount() + '',
            {
                font: 'bold 30px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        text.anchor.set(1, 0.5);
        text.y += text.height / 2;
        this.text = text;

        // 绘制图例
        var legend = game.add.image(game.width - 20, 18, 'food');
        legend.width = 35;
        legend.height = legend.width;
        legend.anchor.set(1, 0);
        this.legend = legend;
    };

    /**
     * 更新
     *
     * @public
     */
    Foodboard.prototype.update = function () {
        var text = this.text;
        text.text = global.getFoodCount() + '';

        var game = this.game;
        var duration = 200;
        var easingQuadratic = Easing.Quadratic;

        // 放大再恢复的效果
        var largen = game.add.tween(text.scale)
            .to({x: 1.2, y: 1.2}, duration, easingQuadratic.Out);
        var recover = game.add.tween(text.scale)
            .to({x: 1, y: 1}, duration, easingQuadratic.In);
        largen.chain(recover);
        largen.start();
    };

    return Foodboard;

});
