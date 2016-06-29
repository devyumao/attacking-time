/**
 * @file 雾
 *       用来滤背景对比度
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    /**
     * 雾类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     */
    var Fog = function (game) {
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
    Fog.prototype.init = function () {
        var game = this.game;

        var image = game.add.image(0, 0, 'pixel-white');
        image.scale.set(game.width / image.width, game.height / image.height);
        image.alpha = 0;
        this.image = image;
    };

    return Fog;

});
