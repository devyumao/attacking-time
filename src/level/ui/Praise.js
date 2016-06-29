/**
 * @file 赞美
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var Easing = require('common/Easing');
    var config = require('level/config');

    /**
     * 赞美类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {number} options.points 加分
     * @param {number} options.pointsX 加分水平位置
     */
    function Praise(game, options) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 加分文本
         *
         * @type {?Phaser.Text}
         */
        this.pointsText = null;

        /**
         * 赞美文本
         *
         * @type {?Phaser.Text}
         */
        this.praiseText = null;

        /**
         * 加分
         *
         * @type {number}
         */
        this.points = options.points;

        /**
         * 加分水平位置
         *
         * @type {number}
         */
        this.pointsX = options.pointsX;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Praise.prototype.init = function () {
        var game = this.game;

        // 绘制加分文本
        var pointsText = game.add.text(
            this.pointsX, game.height - config.HORIZON,
            '+' + this.points,
            {
                font: 'bold 24px ' + global.fontFamily,
                fill: color.get('yellow')
            }
        );
        pointsText.anchor.set(0.5, 1);
        pointsText.alpha = 0;
        this.pointsText = pointsText;

        // 绘制赞美文本
        var sentences = ['赞 哟 !', '好 棒 !', '└(^o^)┘']; // TODO: to be added
        var praiseText = game.add.text(
            game.width / 2, 230,
            sentences[game.rnd.between(0, sentences.length - 1)],
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        praiseText.anchor.set(0.5, 0);
        praiseText.alpha = 0;
        this.praiseText = praiseText;

        this.tween();
    };

    /**
     * 动起来
     *
     * @private
     */
    Praise.prototype.tween = function () {
        var game = this.game;
        var duration = 700;

        // 加分动画
        // 渐显配合抬升, 然后渐隐
        var pointsText = this.pointsText;
        var showPoints = game.add.tween(pointsText)
            .to({alpha: 1}, duration * 0.5, Easing.Quadratic.Out, false);
        var hidePoints = game.add.tween(pointsText)
            .to({alpha: 0}, duration * 0.5, Easing.Quadratic.In, false);
        var risePoints = game.add.tween(pointsText)
            .to({y: '-20'}, duration, Easing.Linear.None, false);
        risePoints.onComplete.add(function () {
            pointsText.destroy();
        });
        showPoints.chain(hidePoints);
        showPoints.start();
        risePoints.start();

        // 赞美动画
        // 渐显再渐隐
        var praiseText = this.praiseText;
        var showPraise = game.add.tween(praiseText)
            .to({alpha: 1}, 400, Easing.Quadratic.Out, false);
        var hidePraise = game.add.tween(praiseText)
            .to({alpha: 0}, 400, Easing.Quadratic.In, false, 300);
        hidePraise.onComplete.add(function () {
            praiseText.destroy();
        });
        showPraise.chain(hidePraise);
        showPraise.start();
    };

    return Praise;

});
