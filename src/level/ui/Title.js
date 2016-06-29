/**
 * @file 标题
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Easing = require('common/Easing');

    /**
     * 标题类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     */
    function Title(game) {
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
        this.body = null;

        this.tweenChain = null;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Title.prototype.init = function () {
        var game = this.game;

        var body = game.add.image(game.width / 2, 64, 'transparent-2');
        body.anchor.set(0.5, 0);
        this.body = body;

        var fly = game.add.image(-294, 282, 'title-fly');
        fly.anchor.set(0.5);
        body.addChild(fly);

        var titleXd = game.add.image(-96, 117, 'title-xd');
        titleXd.anchor.set(0.5);
        body.addChild(titleXd);

        var hero = game.add.image(76, 92, 'title-hero');
        hero.anchor.set(0.5);
        hero.scale.set(0);
        body.addChild(hero);

        var titleXqc = game.add.image(56, 161, 'title-xqc');
        titleXqc.anchor.set(0.5);
        body.addChild(titleXqc);

        var flyMove = game.add.tween(fly)
            .to({x: '170', y: '-84'}, 450, Easing.Quadratic.Out, false, 500);

        var heroLargen = game.add.tween(hero.scale)
            .to({x: 1, y: 1}, 400, Easing.Quadratic.InOut);

        var xqcShake = game.add.tween(titleXqc)
            .to({angle: '-5'}, 150, Easing.Quadratic.InOut, false, 0, 2, true);

        flyMove.chain(heroLargen);
        heroLargen.chain(xqcShake);

        flyMove.onStart.add(function () {
            setTimeout(
                function () {
                    var audio = game.add.audio('fly');
                    audio.play();
                },
                500
            );
        });

        heroLargen.onStart.add(function () {
            var audio = game.add.audio('hero-fly');
            audio.play();
        });

        this.tweenChain = flyMove;
    };

    /**
     * 补间动画
     *
     * @public
     */
    Title.prototype.tween = function () {
        this.tweenChain.start();
    };

    /**
     * 销毁
     *
     * @public
     */
    Title.prototype.fadeOut = function () {
        var game = this.game;
        var body = this.body;

        var move = game.add.tween(body)
            .to({y: -240}, 200, Easing.Quadratic.In);

        move.onComplete.add(
            function () {
                body.destroy();
            },
            this
        );

        move.start();
    };

    return Title;

});
