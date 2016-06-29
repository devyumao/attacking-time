/**
 * @file 背景
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var config = require('level/config');

    /**
     * 背景类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {string} options.imagePrefix 贴图名前缀
     * @param {number} options.index 主题序号
     * @param {number=} options.speed 滚动速度
     */
    function Background(game, options) {
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

        /**
         * 贴图名前缀
         *
         * @type {string}
         */
        this.imagePrefix = options.imagePrefix;

        /**
         * 主题序号
         *
         * @type {number}
         */
        this.index = options.index;

        /**
         * 滚动速度
         *
         * @type {number}
         */
        this.speed = options.speed ? options.speed : 0;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Background.prototype.init = function () {
        var game = this.game;

        var imageName = this.imagePrefix;
        var image = game.add.tileSprite(
            0, 0,
            game.cache.getImage(imageName).width, game.height,
            imageName
        );
        this.image = image;
        image.tilePosition.x -= config.THEME[this.index].OFFSET;
    };

    /**
     * 滚动
     *
     * @public
     */
    Background.prototype.scroll = function () {
        this.image.tilePosition.x -= this.speed;
    };

    return Background;

});
