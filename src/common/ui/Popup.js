/**
 * @file 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var Easing = require('common/Easing');

    /**
     * 弹框类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object=} options 参数项
     * @param {boolean=} options.hasHeader 是否有头部
     * @param {string=} options.headerType 头部类型
     * @param {string=} options.headerIcon 头部图标
     * @param {number=} options.height 高度
     * @param {number=} options.y 竖直位置
     * @param {number=} options.paddingBottom 底部内间距
     * @param {string=} options.title 标题
     * @param {boolean} options.hasMaskTouch 是否有遮罩触及
     */
    function Popup(game, options) {
        if (!options) {
            options = {};
        }

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
         * 整体
         *
         * @type {?Phaser.Image}
         */
        this.body = null;
        /**
         * 头部
         *
         * @type {?Phaser.Image}
         */
        this.header = null;
        /**
         * 容器
         *
         * @type {?Phaser.Image}
         */
        this.container = null;

        /**
         * 主体
         *
         * @type {?Phaser.Image}
         */
        this.main = null;

        /**
         * 上边缘
         *
         * @type {?Phaser.Image}
         */
        this.topEdge = null;
        /**
         * 下边缘
         *
         * @type {?Phaser.Image}
         */
        this.bottomEdge = null;

        /**
         * Phaser 元素组
         *
         * @type {Array.<Phaser.Image>}
         */
        this.elements = [];

        /**
         * 是否有头部
         *
         * @type {boolean}
         */
        this.hasHeader = !!options.hasHeader;
        /**
         * 头部类型
         *
         * @type {string}
         */
        this.headerType = options.headerType ? options.headerType : '';
        /**
         * 头部图标
         *
         * @type {string}
         */
        this.headerIcon = options.headerIcon ? options.headerIcon : '';

        /**
         * 宽度
         *
         * @type {number}
         */
        this.width = game.cache.getImage('popup-edge').width;
        /**
         * 高度
         *
         * @type {number}
         */
        this.height = options.height ? options.height : 520;
        /**
         * 竖直位置
         *
         * @type {number}
         */
        this.y = options.y ? options.y : 120;
        /**
         * 水平内间距
         *
         * @type {number}
         */
        this.paddingHorz = 12;
        /**
         * 顶部内间距
         *
         * @type {number}
         */
        this.paddingTop = 30;
        /**
         * 底部内间距
         *
         * @type {number}
         */
        this.paddingBottom = options.paddingBottom ? options.paddingBottom : 30;

        /**
         * 容器宽度
         *
         * @type {number}
         */
        this.containerWidth = this.width - 2 * this.paddingHorz;
        /**
         * 容器高度
         *
         * @type {number}
         */
        this.containerHeight = 0;

        /**
         * 标题
         *
         * @type {string}
         */
        this.title = options.title ? options.title : '';

        this.hasMaskTouch = typeof options.hasMaskTouch === 'undefined' ? true : options.hasMaskTouch;
    }

    /**
     * 初始化
     *
     * @protected
     */
    Popup.prototype.init = function () {
        this.initMask();
        this.initBody();
        this.hasHeader && this.initHeader();
        this.initContainer();
        this.initContent();

        this.show();
    };

    /**
     * 初始化遮罩
     *
     * @private
     */
    Popup.prototype.initMask = function () {
        var me = this;
        var Mask = require('common/ui/Mask');

        this.mask = new Mask(
            this.game,
            {
                alpha: 0.4,
                onTouch: this.hasMaskTouch
                    ? function () {
                        me.mask.unbindTouch();
                        me.hide();
                    }
                    : null
            }
        );
    };

    /**
     * 初始化整体
     *
     * @private
     */
    Popup.prototype.initBody = function () {
        var game = this.game;

        // 绘制整体
        var body = game.add.image(game.width / 2, game.height);
        body.anchor.set(0.5, 0);
        body.inputEnabled = true;
        this.body = body;
        this.elements.push(body);

        // 绘制上边缘
        var topEdge = game.add.image(0, 0, 'popup-edge');
        topEdge.anchor.set(0.5, 0);
        body.addChild(topEdge);
        this.topEdge = topEdge;

        var edgeHeight = topEdge.height;

        // 绘制主体
        var main = game.add.image(0, edgeHeight, 'pixel-white');
        main.scale.set(this.width / 2, (this.height - edgeHeight * 2) / 2);
        main.anchor.set(0.5, 0);
        main.alpha = 0.7;
        body.addChild(main);
        this.main = main;

        // 绘制下边缘
        var bottomEdge = game.add.image(0, edgeHeight * 2 + main.height, 'popup-edge');
        bottomEdge.scale.y = -1;
        bottomEdge.anchor.set(0.5, 0);
        body.addChild(bottomEdge);
        this.bottomEdge = bottomEdge;
    };

    /**
     * 初始化头部
     *
     * @private
     */
    Popup.prototype.initHeader = function () {
        var game = this.game;

        // 绘制头部
        var header = game.add.image(
            -this.width / 2,
            game.cache.getImage('popup-header').height / 2,
            'popup-header'
        );
        header.anchor.set(0, 0.5);
        this.body.addChild(header);
        this.header = header;

        var padding = 12;

        // 绘制标题
        var titleText = game.add.text(
            padding, 3,
            this.title,
            {
                font: 'bold 30px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        titleText.anchor.set(0, 0.5);
        header.addChild(titleText);

        // 绘制图标
        switch (this.headerType) {
            case 'icon': // 普通图标
                var icon = game.add.image(this.width - padding, 0, this.headerIcon);
                icon.width = 35;
                icon.height = icon.width;
                icon.anchor.set(1, 0.5);
                header.addChild(icon);
                break;
            case 'food': // 食物图标 & 数量
                var food = game.add.image(this.width - padding, 0, 'food');
                food.width = 30;
                food.height = food.width;
                food.anchor.set(1, 0.5);
                header.addChild(food);

                var foodCountText = game.add.text(
                    food.x - food.width - 10, 3,
                    global.getFoodCount() + '',
                    {
                        font: 'bold 24px ' + global.fontFamily,
                        fill: color.get('dark-grey')
                    }
                );
                foodCountText.anchor.set(1, 0.5);
                header.addChild(foodCountText);
                break;
        }
    };

    /**
     * 初始化容器
     *
     * @private
     */
    Popup.prototype.initContainer = function () {
        var game = this.game;
        var margin = this.paddingHorz;

        if (this.hasHeader) {
            this.paddingTop = this.header.height;
        }

        var container = game.add.image(
            (game.width - this.width) / 2 + margin,
            game.height + this.paddingTop
        );
        this.containerHeight = this.height - this.paddingTop - this.paddingBottom;
        this.container = container;
        this.elements.push(container);

        this.initCrop();
    };

    /**
     * 初始化裁剪区
     *
     * @private
     */
    Popup.prototype.initCrop = function () {
        var game = this.game;
        var margin = this.paddingHorz;
        var container = this.container;

        // 框定可视区域
        var crop = this.game.add.graphics(0, 0);
        crop.beginFill(0xffffff);
        crop.drawRect(
            container.x, game.height + this.paddingTop,
            this.width - margin * 2, this.containerHeight
        );
        crop.endFill();
        container.mask = crop;
        this.elements.push(crop);
    };

    /**
     * 初始化内容
     * 供继承类覆盖
     *
     * @private
     */
    Popup.prototype.initContent = function () {
    };

    /**
     * 设置高度
     *
     * @protected
     * @param {number} height 高度
     */
    Popup.prototype.setHeight = function (height) {
        var originHeight = this.height;
        this.height = height;
        var heightDiff = height - originHeight;

        this.main.height += heightDiff;
        this.bottomEdge.y += heightDiff;

        this.container.mask.destroy();
        this.containerHeight += heightDiff;
        this.initCrop();
    };

    /**
     * 显示
     *
     * @protected
     */
    Popup.prototype.show = function () {
        this.mask.show(500);

        var game = this.game;
        var y = this.y;
        this.elements.forEach(function (el) {
            game.add.tween(el)
                .to({y: y - game.height + ''}, 600, Easing.Back.Out, true);
        });
    };

    /**
     * 隐藏 (附带销毁)
     *
     * @protected
     * @param {boolean=} tweenEnabled 动画是否启动
     */
    Popup.prototype.hide = function (tweenEnabled) {
        this.mask.hide(500);

        var game = this.game;
        var y = this.y;

        if (typeof tweenEnabled === 'undefined') {
            tweenEnabled = true;
        }

        if (tweenEnabled) {
            // 不使用 Phaser.Group 的原因: 坐标处理比较棘手
            this.elements.forEach(function (el) {
                var move = game.add.tween(el)
                    .to({y: game.height - y + ''}, 600, Easing.Back.In);
                move.onComplete.add(function () {
                    el.destroy();
                });
                move.start();
            });
        }
        else {
            this.elements.forEach(function (el) {
                el.destroy();
            });
        }
    };

    return Popup;

});
