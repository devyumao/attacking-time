/**
 * @file 食物
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var Easing = require('common/Easing');

    /**
     * 食物
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {number} options.x 水平坐标
     * @param {number} options.y 竖直坐标
     */
    var Food = function (game, options) {
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
         * 是否被吃
         *
         * @type {boolean}
         */
        this.isEaten = false;

        /**
         * 振动动画
         *
         * @type {?Phaser.Game}
         */
        this.shaking = null;

        /**
         * 水平坐标
         *
         * @type {number}
         */
        this.x = options.x;

        /**
         * 竖直坐标
         *
         * @type {number}
         */
        this.y = options.y;

        this.init();
    };

    /**
     * 初始化
     *
     * @private
     */
    Food.prototype.init = function () {
        var game = this.game;

        var heroConfig = global.getHeroConfig();
        var imageName = ['tool', heroConfig.name, game.rnd.between(1, 3)].join('-');
        this.image = game.add.image(this.x, this.y, imageName);
        this.image.scale.set(0.45);
        this.shake();
    };

    /**
     * 振动
     *
     * @private
     */
    Food.prototype.shake = function () {
        this.shaking = this.game.add.tween(this.image)
            .to({y: '8'}, 1000, Easing.Sinusoidal.InOut, true, 0, -1, true);
    };

    /**
     * 停止振动
     *
     * @private
     */
    Food.prototype.stopShaking = function () {
        this.shaking.stop();
    };

    /**
     * 销毁
     *
     * @public
     */
    Food.prototype.destroy = function () {
        this.image.destroy();
    };

    /**
     * 取得 Phaser 对象
     *
     * @public
     * @return {?Phaser.Image} Phaser 对象
     */
    Food.prototype.getPhaserObject = function () {
        return this.image;
    };

    /**
     * 判断是否开始被吃
     *
     * @public
     * @param {Hero} hero 英雄
     * @return {boolean} 是否开始被吃
     */
    Food.prototype.isStartingBeingEaten = function (hero) {
        if (this.isEaten || !hero.isUpsideDown()) {
            return false;
        }

        var image = this.image;

        var foodLeft = image.x;
        var foodRight = image.x + image.width;
        var heroRight = hero.getX(); // XXX: 注意 hero 的 anchor x 是 1 (右侧)
        var heroLeft = heroRight - hero.getWidth();

        if (foodLeft < heroRight && foodRight > heroLeft) {
            this.beEaten();
            return true;
        }

        return false;
    };

    /**
     * 被吃
     *
     * @public
     */
    Food.prototype.beEaten = function () {
        this.isEaten = true;

        this.stopShaking();

        var image = this.image;
        // 调整中心及位置以适应动画
        image.anchor.set(0.5);
        image.x += image.width / 2;
        image.y += image.height / 2;


        var game = this.game;

        // 消失动画
        var vanish = game.add.tween(image.scale)
            .to({x: 0, y: 0}, 100, Easing.Quadratic.In);
        vanish.onComplete.add(
            function () {
                this.destroy();
            },
            this
        );
        vanish.start();

        // 加分动画
        // 渐显配合抬升, 然后渐隐
        var pointsText = game.add.text(
            image.x, image.y + 20,
            '+2',
            {
                font: 'bold 24px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        pointsText.anchor.set(0.5, 1);
        pointsText.alpha = 0;

        var duration = 700;
        var showPoints = game.add.tween(pointsText)
            .to({alpha: 0.8}, duration * 0.5, Easing.Quadratic.Out, false);
        var hidePoints = game.add.tween(pointsText)
            .to({alpha: 0}, duration * 0.5, Easing.Quadratic.In, false);
        var risePoints = game.add.tween(pointsText)
            .to({y: '+20'}, duration, Easing.Linear.None, false);
        risePoints.onComplete.add(function () {
            pointsText.destroy();
        });
        showPoints.chain(hidePoints);
        showPoints.start();
        risePoints.start();

        !global.getHasTool() && global.setHasTool(1);
    };

    /**
     * 取得宽度
     *
     * @public
     * @return {number} 宽度
     */
    Food.prototype.getWidth = function () {
        return this.image.width;
    };

    /**
     * 隐藏
     *
     * @public
     */
    Food.prototype.hide = function () {
        this.image.alpha = 0;
    };

    /**
     * 显示
     *
     * @public
     */
    Food.prototype.show = function () {
        this.image.alpha = 1;
    };

    return Food;

});
