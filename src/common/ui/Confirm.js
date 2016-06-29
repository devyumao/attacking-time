/**
 * @file 确认 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/ui/Popup');

    /**
     * 确认弹框类
     *
     * @class
     * @extends Popup
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {string=} options.text 文本
     * @param {Function} options.onConfirm 确认回调
     */
    function Confirm(game, options) {
        Popup.call(
            this, game,
            {
                hasHeader: false,
                height: 280,
                y: 200
            }
        );

        /**
         * 文本
         *
         * @type {string}
         */
        this.text = options.text ? options.text : '';

        /**
         * 确认回调
         *
         * @type {Function}
         */
        this.onConfirm = options.onConfirm;

        this.init();
    }
    util.inherits(Confirm, Popup);

    /**
     * 初始化内容
     *
     * @private
     */
    Confirm.prototype.initContent = function () {
        this.initText();
        this.initBtns();
    };

    /**
     * 初始化文本
     *
     * @private
     */
    Confirm.prototype.initText = function () {
        var game = this.game;
        var container = this.container;

        // TODO: 文字中 icon 定制化
        var textText = game.add.text(
            this.containerWidth / 2, 40,
            this.text,
            {
                font: '28px ' + global.fontFamily,
                fill: color.get('coffee'),
                align: 'center'
            }
        );
        textText.anchor.set(0.5, 0);
        textText.lineSpacing = 10;
        container.addChild(textText);
    };

    /**
     * 初始化按钮组
     *
     * @private
     */
    Confirm.prototype.initBtns = function () {
        var game = this.game;
        var container = this.container;
        var margin = 25;

        // 绘制确认按钮
        var btnConfirm = game.add.button(
            this.containerWidth / 2 + margin, this.containerHeight,
            'btn-confirm',
            function () {
                this.onConfirm();
                this.hide();
            },
            this
        );
        btnConfirm.anchor.set(0, 1);
        util.addHover(btnConfirm);
        container.addChild(btnConfirm);

        // 绘制取消按钮
        var btnCancel = game.add.button(
            this.containerWidth / 2 - margin - btnConfirm.width, this.containerHeight,
            'btn-confirm',
            function () {
                this.hide();
            },
            this
        );
        btnCancel.anchor.set(0, 1);
        util.addHover(btnCancel);
        container.addChild(btnCancel);

        var fontStyle = {
            font: 'bold 30px ' + global.fontFamily,
            fill: color.get('coffee')
        };

        // 绘制确认文字
        var confirmText = game.add.text(
            btnConfirm.width / 2, -btnConfirm.height / 2,
            '是',
            fontStyle
        );
        confirmText.anchor.set(0.5);
        btnConfirm.addChild(confirmText);

        // 绘制取消文字
        var cancelText = game.add.text(
            btnCancel.width / 2, -btnCancel.height / 2,
            '否',
            fontStyle
        );
        cancelText.anchor.set(0.5);
        btnCancel.addChild(cancelText);
    };

    return Confirm;

});
