/**
 * @file 记分牌
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var Easing = require('common/Easing');

    /**
     * 记分牌类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     */
    function Scoreboard(game) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 分数
         *
         * @type {number}
         */
        this.score = 0;

        /**
         * 文本
         *
         * @type {?Phaser.Text}
         */
        this.text = null;

        /**
         * 面板
         *
         * @type {?Phaser.Image}
         */
        this.board = null;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Scoreboard.prototype.init = function () {
        var game = this.game;

        var board = game.add.image(game.width / 2, 85, 'scoreboard');
        board.anchor.set(0.5);
        this.board = board;

        var text = game.add.text(
            0, 2,
            this.score + '',
            {
                font: 'bold 48px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        text.anchor.set(0.5);
        board.addChild(text);
        this.text = text;
    };

    /**
     * 取得分数
     *
     * @public
     * @return {number} 分数
     */
    Scoreboard.prototype.getScore = function () {
        return this.score;
    };

    /**
     * 加分
     *
     * @public
     * @param {number} value 值
     */
    Scoreboard.prototype.addScore = function (value) {
        this.score += value;
        var text = this.text;
        text.text = this.score + '';

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

    return Scoreboard;

});
