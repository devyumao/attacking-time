/**
 * @file 棒棒
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var Easing = require('common/Easing');
    var config = require('level/config');

    /**
     * 默认伸长速度
     *
     * @const
     * @type {number}
     */
    var DEFAULT_SPEED = 8;

    /**
     * 默认材质
     *
     * @const
     * @type {string}
     */
    var DEFAULT_TEXTURE = 'stick';

    /**
     * 默认额外长度
     *
     * @const
     * @type {number}
     */
    var DEFAULT_EXTRA_LENGTH = 0;

    /**
     * 棒棒类
     *
     * @exports Stick
     * @class
     * @param {Phaser.Game} game 游戏
     */
    function Stick(game) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 贴图
         *
         * @type {?Phaser.tileSprite}
         */
        this.image = null;

        /**
         * 废弃的贴图
         *
         * @type {?Phaser.tileSprite}
         */
        this.trash = null;

        this.updateSpeed();
        this.updateTexture();
        this.updateExtraLength();

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Stick.prototype.init = function () {
        this.update();
    };

    /**
     * 更新
     *
     * @public
     */
    Stick.prototype.update = function () {
        var game = this.game;

        if (this.image) {
            // 销毁废弃, 并将当前置于废弃
            this.trash && this.trash.destroy(false);
            this.trash = this.image;
        }

        // 创建新贴图
        var image = game.add.tileSprite(
            config.CURR_EDGE_X, game.height - config.HORIZON,
            5, 0.001, // 虽然初始无长度, 但仍要设置个小值, 以避免 tileSprite 的渲染问题
            this.texture
        );
        image.anchor.set(0.5, 1);
        this.image = image;
    };

    /**
     * 设置为可玩状态
     *
     * @public
     */
    Stick.prototype.enablePlay = function () {
        var image = this.image;
        image.height = 0;
        image.angle = 0;
    };

    /**
     * 伸长
     *
     * @public
     */
    Stick.prototype.lengthen = function () {
        if (this.image.height < this.game.height - config.HORIZON) {
            this.image.height += this.speed;
        }
    };

    /**
     * 旋转
     *
     * @private
     * @param {number} angle 角度
     * @param {Object} tweenOptions 动画参数项
     * @param {number} tweenOptions.duration 持续时间
     * @param {number} tweenOptions.delay 延时
     * @return {Promise}
     */
    Stick.prototype.rotate = function (angle, tweenOptions) {
        var game = this.game;

        var rotate = game.add.tween(this.image)
            .to({angle: angle}, tweenOptions.duration, Easing.Quadratic.In, false, tweenOptions.delay);
        var promise = new Promise(function (resolve) {
            rotate.onComplete.add(resolve);
        });
        rotate.start();

        return promise;
    };

    /**
     * 放平
     *
     * @public
     * @return {Promise}
     */
    Stick.prototype.layDown = function () {
        return this.rotate(90, {duration: 400, delay: 150});
    };

    /**
     * 落下
     *
     * @public
     * @return {Promise}
     */
    Stick.prototype.fall = function () {
        return this.rotate(180, {duration: 250, delay: 100});
    };

    /**
     * 取得 Phaser 对象
     *
     * @public
     * @return {Array.<Phaser.tileSprite>} 对象组
     */
    Stick.prototype.getPhaserObjects = function () {
        return [this.image, this.trash];
    };

    /**
     * 取得长度
     *
     * @public
     * @return {number} 长度
     */
    Stick.prototype.getLength = function () {
        return this.image.height;
    };

    /**
     * 取得完全长度, 包含隐藏的额外长度
     *
     * @public
     * @return {number} 全长
     */
    Stick.prototype.getFullLength = function () {
        return this.image.height + this.extraLength;
    };

    /**
     * 判断长度是否属于某区间
     *
     * @public
     * @param {number} lower 下限
     * @param {number} upper 上限
     * @return {boolean} 长度是否属于某区间
     */
    Stick.prototype.isBetween = function (lower, upper) {
        var length = this.getLength();
        return length > lower && length < upper;
    };

    /**
     * 判断是否恰好落在平台上
     *
     * @public
     * @param {Stage} stage 平台
     * @return {boolean} 是否恰好落在平台上
     */
    Stick.prototype.isInStage = function (stage) {
        return this.isBetween(stage.getInterval() - this.extraLength, stage.getNextEdgeX() - stage.getCurrEdgeX());
    };

    /**
     * 判断末端是否击中奖励点
     *
     * @public
     * @param {Stage} stage 平台
     * @return {boolean} 末端是否击中奖励点
     */
    Stick.prototype.isInSpot = function (stage) {
        var spotRange = stage.getSpotRange();
        return this.isBetween(spotRange.lower, spotRange.upper);
    };

    /**
     * 更新伸长速度
     *
     * @public
     */
    Stick.prototype.updateSpeed = function () {
        var speed = global.getHeroConfig().power.stickSpeed;
        /**
         * 伸长的速度
         *
         * @type {number}
         */
        this.speed = speed ? speed : DEFAULT_SPEED;
    };

    /**
     * 更新材质名称
     *
     * @public
     */
    Stick.prototype.updateTexture = function () {
        var texture = global.getHeroConfig().power.stickTexture;
        /**
         * 材质名称
         *
         * @type {string}
         */
        this.texture = texture ? texture : DEFAULT_TEXTURE;
    };

    /**
     * 更新额外长度
     *
     * @public
     */
    Stick.prototype.updateExtraLength = function () {
        var extraLength = global.getHeroConfig().power.stickExtraLength;
        /**
         * 额外长度
         *
         * @type {number}
         */
        this.extraLength = extraLength ? extraLength : DEFAULT_EXTRA_LENGTH;
    };

    return Stick;

});
