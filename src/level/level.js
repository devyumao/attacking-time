/**
 * @file 关卡 state
 *       与以往开发的游戏不同，menu -> play 是连贯场景
 *       所以实际是同一 state, 皆归为 level 下, 用内部状态区分
 *
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var config = require('level/config');

    // 引入场景类
    var Background = require('./scene/Background');
    var Foreground = require('./scene/Foreground');
    var Fog = require('./scene/Fog');
    var Building = require('./scene/Building');

    // 引入菜单元素类
    var Start = require('./ui/Start');
    var MenuBtns = require('./ui/MenuBtns');
    var Title = require('./ui/Title');
    var End = require('./ui/End');

    // 引入主体玩物类
    var Stage = require('./Stage');
    var Hero = require('./Hero');
    var Stick = require('./Stick');

    // 引入界面元素类
    var Scoreboard = require('./ui/Scoreboard');
    var Tip = require('./ui/Tip');
    var Praise = require('./ui/Praise');
    var Combo = require('./ui/Combo');

    /**
     * 关卡内部状态
     *
     * @const
     * @type {Object}
     */
    var STATUS = global.LEVEL_STATUS;

    /**
     * 关卡 state
     * 1. state 在整个游戏进程中, 只进行一次实例化
     * 2. 单场景状态的重复挑战类游戏, level 概念与 state 概念直接挂接
     * 综合以上因素, 选用了普通 object, 而没有使用 class 形式
     *
     * @exports level
     * @namespace
     */
    var level = {};

    /**
     * 初始化
     *
     * @public
     * @param {string} status 状态
     */
    level.init = function (status) {
        this.status = status;
    };

    /**
     * 创建对象
     *
     * @public
     */
    level.create = function () {
        var game = this.game;

        this.reset();

        this.initAudios();

        switch (this.status) {
            case STATUS.MENU:
                this.initMenuStatus();
                break;
            case STATUS.PLAY:
                this.initPlayStatus();
                break;
        }

        this.transition();

        if (!global.getNickname()) {
            var RolePopup = require('./ui/popup/RolePopup');
            new RolePopup(
                game,
                {
                    hasMaskTouch: false
                }
            );
        }
    };

    /**
     * 更新帧
     *
     * @public
     */
    level.update = function () {
        // 背景始终滚动
        this.background.scroll();

        if (this.status === STATUS.PLAY) {
            if (this.shouldMgScroll) {
                // 各中景滚动速度不一, 增强距离层次感
                this.nearMidground.scroll();
                this.farMidground.scroll();
            }

            if (this.isHoldEnabled && this.isBeingHeld) {
                // 伸长棒子
                this.stick.lengthen();
            }

            // 处理待添加食物
            var food = this.stage.getFood();
            if (food && food.isStartingBeingEaten(this.hero)) {
                this.audioTool.play();
                this.scoreboard.addScore(2);
            }
        }
    };

    /**
     * 重置
     *
     * @private
     */
    level.reset = function () {
        /**
         * 按住操作是否启用
         *
         * @type {boolean}
         */
        this.isHoldEnabled = false;

        /**
         * 是否正被按住
         *
         * @type {boolean}
         */
        this.isBeingHeld = false;

        /**
         * 触击操作是否开启
         *
         * @type {boolean}
         */
        this.isTouchEnabled = false;

        /**
         * 中景是否应该滚动
         *
         * @type {boolean}
         */
        this.shouldMgScroll = false;

        /**
         * 背景及物件主题
         *
         * @type {string}
         */
        this.theme = 1;

        // 重置微信分享信息
        global.resetShareText();
        require('common/weixin').updateShare();
    };

    /**
     * 初始化音频
     *
     * @private
     */
    level.initAudios = function () {
        var game = this.game;

        this.audioGround = game.add.audio('ground');
        this.audioClick = game.add.audio('click');
        this.audioStickLayDown = game.add.audio('stick-lay-down');
        this.audioPass = game.add.audio('pass');
        this.audioTool = game.add.audio('tool');
        this.audioSpot = game.add.audio('spot');
        this.audioStickLengthen = game.add.audio('stick-lengthen');
        this.audioWall = game.add.audio('wall');
    };

    /**
     * 转场
     *
     * @private
     */
    level.transition = function () {
        // 用遮掩层过渡
        var Mask = require('common/ui/Mask');
        var mask = new Mask(this.game, {alpha: 1});
        mask.hide(150); // 会自动销毁
    };

    /**
     * 初始化场景
     *
     * @private
     */
    level.initView = function () {
        var game = this.game;

        /**
         * 背景
         *
         * @type {Background}
         */
        this.background = new Background(
            game,
            {
                index: this.theme,
                imagePrefix: 'bg',
                speed: 0.3
            }
        );

        /**
         * 远中景
         *
         * @type {Background}
         */
        this.farMidground = new Background(
            game,
            {
                index: this.theme,
                imagePrefix: 'mg-far',
                speed: 1
            }
        );

        /**
         * 近中景
         *
         * @type {Background}
         */
        this.nearMidground = new Background(
            game,
            {
                index: this.theme,
                imagePrefix: 'mg-near',
                speed: 2
            }
        );

        /**
         * 雾气
         *
         * @type {Fog}
         */
        this.fog = new Fog(game);
    };

    /**
     * 初始化基础物件
     *
     * @private
     */
    level.initBaseObjs = function () {
        this.initView();

        var game = this.game;

        /**
         * 平台
         *
         * @type {Stage}
         */
        this.stage = new Stage(game, {index: this.theme});

        /**
         * 英雄
         *
         * @type {Hero}
         */
        this.hero = new Hero(game, {index: global.getSelected()});
    };

    /**
     * 初始化菜单状态
     *
     * @private
     */
    level.initMenuStatus = function () {
        this.initBaseObjs();

        var game = this.game;

        /**
         * 开始按钮
         *
         * @type {Start}
         */
        this.start = new Start(
            game,
            {
                onClick: function () {
                    this.start.disable();
                    this.start.fadeOut();
                    this.audioClick.play();
                    this.initPlayStatus();
                },
                context: this
            }
        );

        this.building = new Building(game);

        /**
         * 菜单按钮组
         *
         * @type {MenuBtns}
         */
        this.menuBtns = new MenuBtns(game);

        /**
         * 标题
         *
         * @type {Title}
         */
        this.title = new Title(game);

        if (global.getNickname()) {
            this.title.tween();
        }
    };

    /**
     * 初始化可玩状态
     *
     * @private
     */
    level.initPlayStatus = function () {
        var game = this.game;

        // 根据前继状态进行物件的销毁和初始化
        switch (this.status) {
            case STATUS.PLAY:
                this.initBaseObjs();

                // 物件设为可玩, 无动画过渡
                [this.hero, this.stage].forEach(function (item) {
                    item.enablePlay(false);
                });

                this.isHoldEnabled = true;

                break;

            case STATUS.MENU:
                this.building.fadeOut();
                this.title.fadeOut();

                // 销毁菜单元素
                [this.menuBtns].forEach(function (item) {
                    item.destroy();
                });

                // 物件设为可玩, 有动画过渡
                var promises = [];
                [this.hero, this.stage].forEach(function (item) {
                    promises.push(item.enablePlay(true));
                });
                var me = this;
                Promise.all(promises)
                    .then(function () {
                        me.status = STATUS.PLAY;
                        me.isHoldEnabled = true;
                    });

                break;
        }

        /**
         * 记分牌
         *
         * @type {Scoreboard}
         */
        this.scoreboard = new Scoreboard(game);

        /**
         * 棒子
         *
         * @type {Stick}
         */
        this.stick = new Stick(game);

        /**
         * 前景
         *
         * @type {Foreground}
         */
        this.foreground = new Foreground(
            game,
            {
                objects: [this.stage, this.hero, this.stick]
            }
        );

        // 最高分不足2，则给玩法提示
        // 不设1，因为首次成功有偶然性，不一定是真会玩
        if (global.getHighest() < 2) {
            /**
             * 玩法提示
             *
             * @type {?Tip}
             */
            this.playTip = new Tip(game, {text: config.TIP.PLAY});
        }

        /**
         * 连击
         *
         * @type {Combo}
         */
        this.combo = new Combo(game);

        this.bindTouch();
    };

    /**
     * 绑定触击操作
     *
     * @private
     */
    level.bindTouch = function () {
        var game = this.game;

        game.input.onDown.add(onInputDown, this);
        game.input.onUp.add(onInputUp, this);
    };

    /**
     * 触摸按下函数
     *
     * @inner
     */
    function onInputDown() {
        var hero = this.hero;

        // 处理按住
        if (this.isHoldEnabled) {
            this.isBeingHeld = true;
            this.audioStickLengthen.play();
        }

        // 处理触击
        if (this.isTouchEnabled) {
            hero.flip();
        }
    }

    /**
     * 触摸松开函数
     *
     * @inner
     */
    function onInputUp() {
        if (!this.isHoldEnabled || !this.isBeingHeld) {
            return;
        }

        this.audioStickLengthen.stop();

        this.isBeingHeld = false;
        this.isHoldEnabled = false;

        this.layDownStick();
    }

    /**
     * 放下棒子
     *
     * @private
     */
    level.layDownStick = function () {
        var stick = this.stick;
        var me = this;

        this.stick.layDown()
            .then(function () {
                me.isTouchEnabled = true;

                var stage = me.stage;
                if (stick.getFullLength() > stage.getInterval()) { // 长度足够
                    me.audioStickLayDown.play();

                    var combo = me.combo;
                    if (stick.isInSpot(stage)) { // 命中奖励点
                        me.audioSpot.play();

                        // 奖励点加分
                        combo.add();
                        var points = stage.getSpotMultiple() * combo.get();
                        me.scoreboard.addScore(points);
                        // 赞美一下, 会自动销毁
                        new Praise(
                            me.game,
                            {
                                points: points,
                                pointsX: stage.getSpotX()
                            }
                        );
                    }
                    else {
                        combo.reset();
                    }

                    return me.makeHeroWalkToNext();
                }

                // 长度不足
                return me.makeHeroWalkToStickEnd();
            })
            .then(function (result) {
                result.isFailed && me.fail();
            });
    };

    /**
     * 使英雄走到下根柱子
     *
     * @private
     * @return {Promise}
     */
    level.makeHeroWalkToNext = function () {
        var me = this;
        var hero = this.hero;
        var stage = this.stage;

        return hero.walk(stage.getCurrEdgeX() + stage.getInterval())
            .then(function () {
                me.isTouchEnabled = false;
                if (!hero.isUpsideDown()) { // 未倒置
                    if (me.stick.isInStage(stage)) { // 成功啦
                        // 隐去(销毁)提示
                        [me.playTip, me.foodTip].forEach(function (tip) {
                            if (tip) {
                                tip.hide();
                                tip = null;
                            }
                        });

                        return me.makeHeroWalkToNextEdge();
                    }

                    // 走过了
                    return me.makeHeroWalkToStickEnd();
                }

                // 倒置触壁
                me.audioWall.play();
                return Promise.resolve({isFailed: true});
            });
    };

    /**
     * 使英雄走到下根柱子边缘
     *
     * @private
     * @return {Promise}
     */
    level.makeHeroWalkToNextEdge = function () {
        var me = this;
        var stage = this.stage;
        var nextEdgeX = stage.getNextEdgeX();
        var foreground = this.foreground;

        return this.hero.walk(nextEdgeX)
            .then(function () {
                me.audioPass.play();

                // 常规加分
                me.scoreboard.addScore(1);

                me.shouldMgScroll = true;
                // 滚动中景
                foreground.move(stage.getCurrEdgeX() - nextEdgeX)
                    .then(function () {
                        me.shouldMgScroll = false;
                    });

                // 添加下根柱子
                return stage.addNext();
            })
            .then(function (result) {
                // 物件更新
                [me.stick, foreground].forEach(function (item) {
                    item.update();
                });

                me.isHoldEnabled = true;

                // 从未取得过道具 并且 下一局有食物, 则提示
                if (!global.getHasTool() && result.hasFood) {
                    me.foodTip = new Tip(me.game, {text: config.TIP.FOOD});
                }

                return Promise.resolve({isFailed: false});
            });
    };

    /**
     * 使英雄走到棒子顶端
     *
     * @private
     * @return {Promise}
     */
    level.makeHeroWalkToStickEnd = function () {
        var me = this;

        return this.hero.walk(this.stage.getCurrEdgeX() + this.stick.getLength() + 12)
            .then(function () {
                me.isTouchEnabled = false;

                return Promise.resolve({isFailed: true});
            });
    };

    /**
     * 处理失败
     *
     * @private
     */
    level.fail = function () {
        var me = this;

        // 判断新纪录
        var highest = global.getHighest();
        var score = this.scoreboard.getScore();
        var hasNewRecord = score > highest;
        hasNewRecord && global.setHighest(score);

        var stick = this.stick;
        var hero = this.hero;

        // 棒子、英雄落下
        Promise.all([stick.fall(), hero.fall()])
            .then(function () {
                // 屏幕抖动
                me.game.plugins.screenShake.shake(10);
                me.audioGround.play();
                // 为了体验, 停滞一小段时间再继续
                setTimeout(
                    function () {
                        if (hero.power.doubleLife) { // 双命重生
                            hero.sustainLife();
                            stick.enablePlay();
                            hero.twinkle();
                            me.isHoldEnabled = true;
                        }
                        else {
                            // 显示结束画面
                            new End(
                                me.game,
                                {
                                    score: score,
                                    hasNewRecord: hasNewRecord
                                }
                            );
                        }
                    },
                    400
                );
            });
    };

    return level;

});
