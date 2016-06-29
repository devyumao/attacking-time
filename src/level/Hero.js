/**
 * @file 英雄
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var Easing = require('common/Easing');
    var config = require('level/config');

    /**
     * 英雄类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {number} options.index 序号
     */
    function Hero(game, options) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 序号
         *
         * @type {number}
         */
        this.index = options.index;

        /**
         * 精灵图
         *
         * @type {?Phaser.Sprite}
         */
        this.sprite = null;

        /**
         * 是否倒置
         *
         * @type {?boolean}
         */
        this.upsideDown = false;

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Hero.prototype.init = function () {
        this.initConfig();
        this.initSprite();
    };

    /**
     * 初始化配置
     *
     * @private
     */
    Hero.prototype.initConfig = function () {
        var heroConfig = global.herosConfig[this.index];
        for (var key in heroConfig) {
            if (heroConfig.hasOwnProperty(key)) {
                this[key] = heroConfig[key];
            }
        }
    };

    /**
     * 初始化精灵图
     *
     * @private
     */
    Hero.prototype.initSprite = function () {
        var game = this.game;

        var sprite = game.add.sprite(
            (game.width + this.width * this.scale) / 2,
            game.height - config.INITIAL_HORIZON
        );
        sprite.scale.set(this.scale);
        sprite.anchor.set(1, 1);
        this.sprite = sprite;

        this.down();
    };

    /**
     * 设置为可玩状态
     *
     * @public
     * @param {boolean} useTween 是否使用动态过渡
     * @return {Promise}
     */
    Hero.prototype.enablePlay = function (useTween) {
        var game = this.game;

        var sprite = this.sprite;
        var x = config.CURR_EDGE_X + this.paddingRight;
        var y = game.height - config.HORIZON;

        if (useTween) {
            var move = game.add.tween(sprite)
                .to({x: x, y: y}, 200, Easing.Linear.None);

            var me = this;
            var promise = new Promise(function (resolve) {
                move.onComplete.add(
                    function () {
                        this.down();
                        resolve();
                    },
                    me
                );
            });

            this.act('walk', true);

            move.start();

            return promise;
        }

        sprite.x = x;
        sprite.y = y;

        return Promise.resolve();
    };

    /**
     * 行使动作
     *
     * @private
     * @param {string} action 动作名称
     * @param {boolean=} loop 是否循环, 缺省 false
     */
    Hero.prototype.act = function (action, loop) {
        var sprite = this.sprite;
        var key = [this.name, action].join('-');

        // 若已是当前 key, 则不重载贴图 (loadTexture 较耗内存)
        if (sprite.key === key) {
            return;
        }
        sprite.loadTexture(key);

        // 添加/运行动画
        !sprite.animations.getAnimation(action) && sprite.animations.add(action);
        sprite.animations.play(action, this.actions[action].fps, !!loop);
    };

    /**
     * 向下动作 (呼吸)
     *
     * @public
     */
    Hero.prototype.down = function () {
        this.act('down', true);
    };

    /**
     * 向上动作 (施法)
     *
     * @public
     */
    Hero.prototype.up = function () {
        this.act('walk', true);
    };

    /**
     * 踢腿动作
     *
     * @public
     */
    Hero.prototype.kick = function () {
        this.act('kick');
    };

    /**
     * 行走
     *
     * @public
     * @param {number} targetX 目标位置 X 坐标
     * @return {Promise}
     */
    Hero.prototype.walk = function (targetX) {
        var game = this.game;
        var sprite = this.sprite;

        // 置顶，避免被新生成的棒棒遮盖
        sprite.bringToTop();

        // 目标位置不越过屏宽
        var maxX = game.width;
        targetX += this.paddingRight;
        if (targetX > maxX) {
            targetX = maxX;
        }

        var duration = (targetX - sprite.x) * 3;
        // 平移动画
        var move = game.add.tween(sprite)
            .to({x: targetX}, duration, Easing.Linear.None);

        var me = this;
        var promise = new Promise(function (resolve) {
            move.onComplete.add(
                function () {
                    // 动作还原为初始
                    this.down();
                    resolve();
                },
                me
            );
        });

        // 装配行走动作
        this.act('walk', true);

        move.start();

        return promise;
    };

    /**
     * 取得 Phaser 对象
     *
     * @public
     * @return {Array.<Phaser.Sprite>} 对象组
     */
    Hero.prototype.getPhaserObjects = function () {
        return [this.sprite];
    };

    /**
     * 落下
     *
     * @public
     * @return {Promise}
     */
    Hero.prototype.fall = function () {
        var game = this.game;

        var fall = game.add.tween(this.sprite)
            .to(
                {
                    // 落下距离考虑倒置因素
                    y: game.height + (!this.upsideDown ? this.height : 0)
                },
                300, Easing.Quadratic.In, false, 100
            );

        var promise = new Promise(function (resolve) {
            fall.onComplete.add(resolve);
        });

        fall.start();

        return promise;
    };

    /**
     * 翻转
     *
     * @public
     */
    Hero.prototype.flip = function () {
        this.sprite.scale.y *= -1;
        this.upsideDown = !this.upsideDown;
    };

    /**
     * 是否倒置
     *
     * @public
     * @return {boolean} 是否倒置
     */
    Hero.prototype.isUpsideDown = function () {
        return this.upsideDown;
    };

    /**
     * 取得贴图水平位置
     *
     * @public
     * @return {number} 贴图水平位置
     */
    Hero.prototype.getX = function () {
        return this.sprite.x;
    };

    /**
     * 取得贴图宽度
     *
     * @public
     * @return {number} 贴图宽度
     */
    Hero.prototype.getWidth = function () {
        return this.sprite.width;
    };

    /**
     * 更换英雄
     *
     * @public
     * @param {number} index 序号
     * @param {boolean} isTemp 是否临时, 针对有形态切换的英雄
     */
    Hero.prototype.change = function (index, isTemp) {
        // 更新当前所选序号
        global.setSelected(index, !isTemp);

        // 更新各属性
        this.index = index;
        this.initConfig();

        var game = this.game;
        var sprite = this.sprite;
        sprite.x = (game.width + this.width * this.scale) / 2;
        sprite.y = game.height - config.INITIAL_HORIZON;
        sprite.scale.set(this.scale);

        this.down();

        // 根据英雄超能更新棒棒和平台的属性
        var level = game.state.states.level;
        var stick = level.stick;
        if (stick) {
            // 棒棒速度
            stick.updateSpeed();
            // 棒棒材质
            stick.updateTexture();
            // 额外棒长
            stick.updateExtraLength();
        }
        var stage = level.stage;
        // 食物出现几率
        stage.updateFoodProba();
        // 最小柱宽
        stage.updateMinWidth();
        // 奖励点乘数
        stage.updateSpotMultiple();
        // 奖励点宽度
        stage.updateSpotWidth();

        if (isTemp) {
            // 还原当前所选序号
            global.setSelected(this.power.previousLife, false);
        }
    };

    /**
     * 续命
     *
     * @public
     */
    Hero.prototype.sustainLife = function () {
        // 切换为下一形态
        this.change(this.power.nextLife, true);
        this.enablePlay(false);
    };

    /**
     * 闪烁效果
     *
     * @public
     * @return {Promise}
     */
    Hero.prototype.twinkle = function () {
        var twinkle = this.game.add.tween(this.sprite)
            .from({alpha: 0}, 200, Easing.Linear.None, true, 0, 1, true);

        var promise = new Promise(function (resolve) {
            twinkle.onComplete.add(resolve);
        });

        twinkle.start();

        return promise;
    };

    return Hero;

});
