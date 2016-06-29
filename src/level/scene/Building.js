/**
 * @file 建筑
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Easing = require('common/Easing');

    /**
     * 建筑类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     */
    var Building = function (game) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 贴图
         *
         * @type {?Phaser.Image}
         */
        this.image = null;

        this.init();
    };

    /**
     * 初始化
     *
     * @private
     */
    Building.prototype.init = function () {
        var game = this.game;

        var image = game.add.image(220, 620, 'building');
        image.anchor.set(0.5, 0);
        this.image = image;
    };

    /**
     * 渐出
     *
     * @public
     */
    Building.prototype.fadeOut = function () {
        var game = this.game;
        var image = this.image;

        var move = game.add.tween(image)
            .to({y: game.height}, 200, Easing.Linear.None);

        move.onComplete.add(
            function () {
                image.destroy();
            },
            this
        );

        move.start();
    };

    return Building;

});
