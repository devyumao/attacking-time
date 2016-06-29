/**
 * @file 提示
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var Easing = require('common/Easing');

    /**
     * 提示类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {string} text 文本
     */
    function Tip(game, options) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 文本
         *
         * @type {string}
         */
        this.text = options.text;

        /**
         * 文本元素
         *
         * @type {?Phaser.Text}
         */
        this.textText = null;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Tip.prototype.init = function () {
        var game = this.game;

        var textText = game.add.text(
            game.width / 2, 135,
            this.text,
            {
                font: 'bold 26px ' + global.fontFamily,
                fill: color.get('white'),
                align: 'center'
            }
        );
        textText.anchor.set(0.5, 0);
        this.textText = textText;

        this.show();
    };

    /**
     * 显示
     *
     * @private
     */
    Tip.prototype.show = function () {
        this.game.add.tween(this.textText)
            .from({alpha: 0}, 300, Easing.Quadratic.Out, true);
    };

    /**
     * 隐藏 (附带销毁)
     *
     * @public
     */
    Tip.prototype.hide = function () {
        var hide = this.game.add.tween(this.textText)
            .to({alpha: 0}, 300, Easing.Quadratic.In);
        hide.onComplete.add(
            function () {
                this.destroy();
            },
            this
        );
        hide.start();
    };

    /**
     * 隐藏
     *
     * @private
     */
    Tip.prototype.destroy = function () {
        this.textText.destroy();
    };

    return Tip;

});
