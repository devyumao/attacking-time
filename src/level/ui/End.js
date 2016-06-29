/**
 * @file 结束面板
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Mask = require('common/ui/Mask');
    var Easing = require('common/Easing');

    /**
     * 结束面板类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {number} options.score 分数
     * @param {boolean} options.hasNewRecord 是否破纪录
     */
    function End(game, options) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 遮罩
         *
         * @type {?Mask}
         */
        this.mask = null;

        /**
         * 主体
         *
         * @type {?Phaser.Image}
         */
        this.body = null;

        /**
         * 分数
         *
         * @type {?Mask}
         */
        this.score = options.score;

        /**
         * 是否破纪录
         *
         * @type {boolean}
         */
        this.hasNewRecord = options.hasNewRecord;

        this.init();
    }
    // 无需 destroy 方法，因为出口只有跳转状态，会自动销毁

    /**
     * 初始化
     *
     * @private
     */
    End.prototype.init = function () {
        this.initMask();
        this.initBody();
        this.initBoard();
        this.initBtns();
        this.initDoll();
        this.intCopyright();

        this.show();

        if (this.hasNewRecord) {
            this.showShareMask();
        }

        this.updateShare();
    };

    /**
     * 初始化遮罩
     *
     * @private
     */
    End.prototype.initMask = function () {
        var Mask = require('common/ui/Mask');
        this.mask = new Mask(this.game, {alpha: 0.6});
    };

    /**
     * 初始化主体
     *
     * @private
     */
    End.prototype.initBody = function () {
        var game = this.game;

        var body = game.add.image(game.width / 2, 80);
        body.anchor.set(0.5, 0);
        this.body = body;
    };

    /**
     * 初始化面板
     *
     * @private
     */
    End.prototype.initBoard = function () {
        var game = this.game;
        var body = this.body;

        var board = game.add.image(0, 90, 'end-board');
        board.anchor.set(0.5, 0);
        body.addChild(board);

        var valueFontStyle = {
            font: 'bold 48px ' + global.fontFamily,
            fill: color.get('cherry')
        };

        // 绘制分数
        var scoreValue = game.add.text(
            64, 114,
            this.score + '',
            valueFontStyle
        );
        scoreValue.anchor.set(1, 0);
        board.addChild(scoreValue);

        // 绘制最高分
        var hightest = global.getHighest();
        var highestValue = game.add.text(
            64, 190,
            hightest + '',
            valueFontStyle
        );
        highestValue.anchor.set(1, 0);
        board.addChild(highestValue);

        if (this.hasNewRecord) {
            // 绘制新纪录
            var newRecord = game.add.image(
                scoreValue.x + 10,
                scoreValue.y - 8,
                'new-record'
            );
            board.addChild(newRecord);
        }
    };

    /**
     * 转场
     *
     * @private
     * @return {Promise}
     */
    End.prototype.transition = function () {
        // 应用场景皆为状态跳转, 无需销毁
        var mask = new Mask(this.game, {alpha: 1});
        return mask.show(150);
    };

    /**
     * 初始化按钮列
     *
     * @private
     */
    End.prototype.initBtns = function () {
        var me = this;
        var game = this.game;
        var body = this.body;
        var STATUS = global.LEVEL_STATUS;
        var level = game.state.states.level;
        var audioClick = level.audioClick;

        var btnConfigs = [
            {
                texture: 'btn-share',
                text: '炫耀一下',
                onClick: function () {
                    audioClick.play();
                    me.showShareMask();
                }
            },
            {
                texture: 'btn-home',
                text: '返回菜单',
                onClick: function () {
                    audioClick.play();
                    me.transition()
                        .then(function () {
                            game.state.start('level', true, false, STATUS.MENU);
                        });
                }
            },
            {
                texture: 'btn-restart',
                text: '再玩一次',
                onClick: function () {
                    audioClick.play();
                    me.transition()
                        .then(function () {
                            game.state.start('level', true, false, STATUS.PLAY);
                        });
                }
            }
        ];

        btnConfigs.forEach(function (config, index) {
            var btn = game.add.button(115 * (index - 1), 440, config.texture, config.onClick);
            btn.anchor.set(0.5);
            util.addHover(btn);
            body.addChild(btn);
        });
    };

    /**
     * 初始化玩偶物件
     *
     * @private
     */
    End.prototype.initDoll = function () {
        var game = this.game;

        var doll = game.add.image(-575, -460, 'end-doll');
        doll.anchor.set(-1.3, -2.5);
        doll.angle += 2;
        this.body.addChild(doll);

        game.add.tween(doll)
            .to({angle: '-8'}, 1500, Easing.Sinusoidal.InOut, true, 0, -1, true);
    };

    /**
     * 初始化版权
     *
     * @private
     */
    End.prototype.intCopyright = function () {
        var game = this.game;

        var copyright = game.add.image(0, 600, 'copyright');
        copyright.anchor.set(0.5, 0);
        copyright.scale.set(0.52);
        this.body.addChild(copyright);
    };

    /**
     * 显示分享遮罩
     *
     * @private
     */
    End.prototype.showShareMask = function () {
        var game = this.game;
        var duration = 150;

        var mask = new Mask(game, {alpha: 0.6});
        mask.show(duration);

        var tipText = game.add.text(
            game.width / 2, 200,
            '点击右上角\n分享到朋友圈',
            {
                font: 'bold 42px ' + global.fontFamily,
                fill: color.get('white'),
                align: 'center'
            }
        );
        tipText.anchor.set(0.5, 0);

        var ease = Easing.Quadratic.InOut;
        game.add.tween(tipText)
            .from({alpha: 0}, duration, ease, true);

        var hide = function () {
            var duration = 400;
            mask.hide(duration);
            var hideTip = game.add.tween(tipText)
                .to({alpha: 0}, duration, ease);
            hideTip.onComplete.add(function () {
                tipText.destroy();
            });
            hideTip.start();
        };

        // 触摸或等待可隐藏
        mask.bindTouch(hide);
        setTimeout(hide, 1000);
    };

    /**
     * 显示
     *
     * @private
     */
    End.prototype.show = function () {
        var duration = 500;
        this.mask.show(duration);
        this.game.add.tween(this.body)
            .from({alpha: 0}, duration, Easing.Quadratic.InOut, true);
    };

    /**
     * 更新分享信息
     *
     * @private
     */
    End.prototype.updateShare = function () {
        global.setShareText(
            '我作为开发SSGer冲过了' + this.score + '道难关，你也来试试吧！'
        );
        require('common/weixin').updateShare();
    };

    return End;

});
