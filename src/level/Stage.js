/**
 * @file 平台
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var util = require('common/util');
    var Easing = require('common/Easing');
    var config = require('level/config');
    var Food = require('./Food');

    /**
     * 默认食物出现几率
     *
     * @const
     * @type {number}
     */
    var DEFAULT_FOOD_PROBA = 0.5;

    /**
     * 默认最小柱宽
     *
     * @const
     * @type {number}
     */
    var DEFAULT_MIN_WIDTH = 24;

    /**
     * 默认奖励点乘数
     *
     * @const
     * @type {number}
     */
    var DEFAULT_SPOT_MULTIPLE = 1;

    /**
     * 默认奖励点宽度
     *
     * @const
     * @type {number}
     */
    var DEFAULT_SPOT_WIDTH = 14;

    /**
     * 平台类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {index} options.index 主题序号
     */
    function Stage(game, options) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 主题序号
         *
         * @type {number}
         */
        this.index = options.index;

        /**
         * 贴图名
         *
         * @type {string}
         */
        this.imageName = 'stage-' + this.index;

        /**
         * 上根柱子
         *
         * @type {?Phaser.tileSprite}
         */
        this.prev = null;

        /**
         * 当前柱子
         *
         * @type {?Phaser.tileSprite}
         */
        this.curr = null;

        /**
         * 下根柱子
         *
         * @type {?Phaser.tileSprite}
         */
        this.next = null;

        /**
         * 奖励点
         *
         * @type {?Phaser.Image}
         */
        this.spot = null;

        /**
         * 废弃的食物
         *
         * @type {?Food}
         */
        this.oldFood = null;

        /**
         * 食物
         *
         * @type {?Food}
         */
        this.food = null;

        /**
         * 平移速度曲线
         *
         * @type {Function}
         */
        this.moveEasing = Easing.Linear.None;

        /**
         * 高度
         *
         * @type {number}
         */
        this.height = game.cache.getImage('stage-1').height;

        /**
         * 当前柱子右沿水平位置
         *
         * @type {number}
         */
        this.currEdgeX = config.CURR_EDGE_X;

        /**
         * 最大柱宽
         *
         * @type {number}
         */
        this.maxWidth = this.currEdgeX;

        this.updateMinWidth();

        this.updateFoodProba();

        this.updateSpotMultiple();
        this.updateSpotWidth();

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    Stage.prototype.init = function () {
        var game = this.game;

        // 一根居中的当前柱
        this.curr = game.add.tileSprite(
            (game.width - this.maxWidth) / 2,
            game.height - config.INITIAL_HORIZON - (this.height - config.HORIZON),
            this.maxWidth,
            this.height,
            'stage-3'
        );
    };

    Stage.prototype.getRandomThemeImageName = function () {
        return 'stage-' + this.game.rnd.between(1, 3);
    };

    /**
     * 设置为可玩状态
     *
     * @public
     * @param {boolean} useTween 是否使用动态过渡
     * @return {Promise}
     */
    Stage.prototype.enablePlay = function (useTween) {
        var game = this.game;

        // 初始化 next
        // 初始 next 限制宽度与距离，使得首次难度不要太奇葩
        var nextWidth = this.maxWidth;
        var next = game.add.tileSprite(
            game.width, game.height - this.height,
            nextWidth, this.height,
            this.getRandomThemeImageName()
        );
        this.randomTilePosition(next);
        this.next = next;
        this.spot = this.createSpot(next);

        var curr = this.curr;
        // 位置信息
        var currX = 0;
        var currY = game.height - this.height;
        var nextX = this.currEdgeX + game.rnd.between(40, 180);

        if (useTween) {
            var easing = this.moveEasing;

            // curr 移动
            var moveCurr = game.add.tween(curr)
                .to({x: currX, y: currY}, 200, easing);

            // next 移动
            var moveNext = game.add.tween(next)
                .to({x: nextX}, 200, easing);

            var promise = new Promise(function (resolve) {
                moveNext.onComplete.add(resolve);
            });

            moveCurr.chain(moveNext);
            moveCurr.start();

            return promise;
        }

        curr.x = currX;
        curr.y = currY;
        next.x = nextX;

        return Promise.resolve();
    };

    /**
     * 随机柱子纹理位置
     *
     * @private
     * @param {Phaser.tileSprite} pillar 柱子
     */
    Stage.prototype.randomTilePosition = function (pillar) {
        pillar.tilePosition.x = -this.game.rnd.between(0, 250 - this.maxWidth);
    };

    /**
     * 创建奖励点
     *
     * @private
     * @param {Phaser.tileSprite} pillar 柱子
     * @return {Phaser.Image} 奖励点
     */
    Stage.prototype.createSpot = function (pillar) {
        var spot = this.game.add.image(pillar.width / 2, this.height - config.HORIZON, 'spot');
        spot.width = this.spotWidth;
        spot.anchor.set(0.5, 0);
        pillar.addChild(spot);

        return spot;
    };

    /**
     * 创建食物
     *
     * @private
     * @return {Phaser.Image} 奖励点
     */
    Stage.prototype.createFood = function () {
        var game = this.game;

        var food = new Food(
            game,
            {
                x: game.width,
                y: game.height - config.HORIZON + 10
            }
        );

        return food;
    };

    /**
     * 添加下根柱子
     *
     * @public
     * @return {Promise}
     */
    Stage.prototype.addNext = function () {
        var game = this.game;

        // next 大小、位置信息
        var nextWidth = game.rnd.between(this.minWidth, this.maxWidth);
        var nextMargin = [20, 10];
        // next 水平位置在 curr 和除去自身宽度的边界之间, 考虑边缘留空
        var nextX = game.rnd.between(this.currEdgeX + nextMargin[0], game.width - nextWidth - nextMargin[1]);

        // food 大小、位置信息
        var foodMargin = 10;
        var food = this.createFood();
        food.hide();
        var foodWidth = food.getWidth();
        var foodX = nextX;
        var hasFood = util.proba(this.foodProba) // 先验概率
            && nextX - this.currEdgeX >= foodWidth + foodMargin * 2; // 间距是否足够放

        if (hasFood) {
            // food 水平位置在两根柱子之间
            foodX = game.rnd.between(this.currEdgeX + foodMargin, nextX - foodMargin - foodWidth);
            food.show();

            // food 平移动画
            var moveFood = game.add.tween(food.getPhaserObject())
                .to({x: foodX}, 300, this.moveEasing);
            moveFood.start();
        }

        // 添加 next
        var next = game.add.tileSprite(
            game.width + nextX - foodX, game.height - this.height,
            nextWidth, this.height,
            this.getRandomThemeImageName()
        );
        this.randomTilePosition(next);

        var spot = this.createSpot(next);

        // next 平移动画
        var move = game.add.tween(next)
            .to({x: nextX}, 300, this.moveEasing);
        var me = this;
        var promise = new Promise(function (resolve) {
            move.onComplete.add(
                function () {
                    // 更替新旧对象
                    this.prev && this.prev.destroy();
                    this.prev = this.curr;
                    this.curr = this.next;
                    this.next = next;
                    this.spot = spot;

                    this.oldFood && this.oldFood.destroy();
                    this.oldFood = this.food;
                    this.food = food || null;

                    resolve({hasFood: hasFood});
                },
                me
            );
        });
        move.start();

        return promise;
    };

    /**
     * 取得当前柱子右沿的水平位置
     *
     * @public
     * @return {number} 当前柱子右沿的水平位置
     */
    Stage.prototype.getCurrEdgeX = function () {
        return this.currEdgeX;
    };

    /**
     * 取得当前柱子右沿的水平位置
     *
     * @public
     * @return {number} 当前柱子右沿的水平位置
     */
    Stage.prototype.getNextEdgeX = function () {
        var next = this.next;
        return next.x + next.width;
    };

    /**
     * 取得 Phaser 对象
     *
     * @public
     * @return {Array.<Phaser.tileSprite|Phaser.Image>} 对象组
     */
    Stage.prototype.getPhaserObjects = function () {
        var objects = [this.prev, this.curr, this.next];
        [this.oldFood, this.food].forEach(function (item) {
            item && objects.push(item.getPhaserObject());
        });
        return objects;
    };

    /**
     * 取得两根柱子间距
     *
     * @public
     * @return {number} 两根柱子间距
     */
    Stage.prototype.getInterval = function () {
        var curr = this.curr;
        return this.next.x - curr.x - curr.width;
    };

    /**
     * 取得奖励点水平位置
     *
     * @public
     * @return {number} 奖励点水平位置
     */
    Stage.prototype.getSpotX = function () {
        var next = this.next;
        return next.x + this.spot.x;
    };

    /**
     * 取得奖励点位置区间
     *
     * @public
     * @return {Object} 奖励点位置区间
     */
    Stage.prototype.getSpotRange = function () {
        var lower = this.getSpotX() - this.currEdgeX - this.spotWidth / 2;
        var upper = lower + this.spotWidth;

        return {
            lower: lower,
            upper: upper
        };
    };

    /**
     * 取得食物
     *
     * @public
     * @return {Food} 食物
     */
    Stage.prototype.getFood = function () {
        return this.food;
    };

    /**
     * 取得奖励点乘数
     *
     * @public
     * @return {Food} 奖励点乘数
     */
    Stage.prototype.getSpotMultiple = function () {
        return this.spotMultiple;
    };

    /**
     * 更新食物出现几率
     *
     * @public
     */
    Stage.prototype.updateFoodProba = function () {
        var foodProba = global.getHeroConfig().power.foodProba;
        /**
         * 食物出现几率
         *
         * @type {number}
         */
        this.foodProba = foodProba ? foodProba : DEFAULT_FOOD_PROBA;
    };

    /**
     * 更新最小柱宽
     *
     * @public
     */
    Stage.prototype.updateMinWidth = function () {
        var minWidth = global.getHeroConfig().power.stageMinWidth;
        /**
         * 最小柱宽
         *
         * @type {number}
         */
        this.minWidth = minWidth ? minWidth : DEFAULT_MIN_WIDTH;
    };

    /**
     * 更新奖励点乘数
     *
     * @public
     */
    Stage.prototype.updateSpotMultiple = function () {
        var spotMultiple = global.getHeroConfig().power.spotMultiple;
        /**
         * 奖励点乘数
         *
         * @type {number}
         */
        this.spotMultiple = spotMultiple ? spotMultiple : DEFAULT_SPOT_MULTIPLE;
    };

    /**
     * 更新奖励点宽度
     *
     * @public
     */
    Stage.prototype.updateSpotWidth = function () {
        var spotWidth = global.getHeroConfig().power.spotWidth;
        /**
         * 奖励点宽度
         *
         * @type {number}
         */
        this.spotWidth = spotWidth ? spotWidth : DEFAULT_SPOT_WIDTH;
    };

    return Stage;

});
