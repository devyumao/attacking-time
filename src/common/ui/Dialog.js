/**
 * @file 指定图片弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Easing = require('common/Easing');

    function Dialog(game, options) {
        this.game = game;
        this.mask = null;
        this.bodyName = options.bodyName;
        this.body = null;
        this.y = options.y ? options.y : 40;
        this.ctnX = options.ctnX;
        this.ctnY = options.ctnY;
        this.elements = [];
        this.hasMaskTouch = typeof options.hasMaskTouch === 'undefined' ? true : options.hasMaskTouch;
    }

    Dialog.prototype.init = function () {
        this.initMask();
        this.initBody();
        this.initContainer();
        this.initContent();

        this.show();
    };

    Dialog.prototype.initMask = function () {
        var me = this;
        var Mask = require('common/ui/Mask');

        this.mask = new Mask(
            this.game,
            {
                alpha: 0.5,
                onTouch: this.hasMaskTouch
                    ? function () {
                        me.mask.unbindTouch();
                        me.hide();
                    }
                    : null
            }
        );
    };

    Dialog.prototype.initBody = function () {
        var game = this.game;

        var body = game.add.image(game.width / 2, game.height, this.bodyName);
        body.anchor.set(0.5, 0);
        this.body = body;

        this.elements.push(body);
    };

    Dialog.prototype.initContainer = function () {
        var game = this.game;

        var container = game.add.image(this.ctnX, game.height + this.ctnY - this.y, 'transparent-2');
        this.container = container;

        this.elements.push(container);
    };

    Dialog.prototype.initContent = function () {
    };

    Dialog.prototype.show = function () {
        this.mask.show(500);

        var game = this.game;
        var y = this.y;
        this.elements.forEach(function (el) {
            game.add.tween(el)
                .to({y: y - game.height + ''}, 600, Easing.Back.Out, true);
        });
    };

    Dialog.prototype.hide = function (tweenEnabled) {
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

    return Dialog;
});
