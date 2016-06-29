/**
 * @file 开始按钮
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Easing = require('common/Easing');

    /**
     * 开始按钮类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {Function} options.onClick 点击回调
     * @param {Object} options.context 回调上下文
     */
    function Start(game, options) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 按钮
         *
         * @type {Phaser.Button}
         */
        this.button = null;

        this.ring = null;

        /**
         * 点击回调
         *
         * @type {Function}
         */
        this.onClick = options.onClick;

        /**
         * 回调上下文
         *
         * @type {Object}
         */
        this.context = options.context;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Start.prototype.init = function () {
        var game = this.game;

        // 绘制按钮
        var button = game.add.button(
            game.width / 2, 458,
            'start',
            this.onClick,
            this.context
        );
        button.anchor.set(0.5);
        button.scale.set(0.5);
        this.button = button;

        var ring = game.add.image(0, 0, 'start-ring');
        ring.anchor.set(0.5);
        button.addChild(ring);
        this.ring = ring;

        this.shake();
    };

    Start.prototype.disable = function () {
        this.button.inputEnabled = false;
    };

    /**
     * 振动
     *
     * @private
     */
    Start.prototype.shake = function () {
        this.game.add.tween(this.button)
            .to({y: '-15'}, 2000, Easing.Sinusoidal.InOut, true, 0, -1, true);
    };

    /**
     * 渐出
     *
     * @public
     */
    Start.prototype.fadeOut = function () {
        var game = this.game;

        var duration = 750;
        var largen = game.add.tween(this.ring.scale)
            .to({x: 1.3, y: 1.3}, duration, Easing.Linear.None);
        var hide = game.add.tween(this.button)
            .to({alpha: 0}, duration, Easing.Linear.None);
        hide.onComplete.add(
            function () {
                this.destroy();
            },
            this
        );
        hide.start();
        largen.start();
    };

    /**
     * 销毁
     *
     * @public
     */
    Start.prototype.destroy = function () {
        this.button.destroy();
    };

    return Start;

});
