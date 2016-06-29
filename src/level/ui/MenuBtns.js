/**
 * @file 菜单按钮组
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');

    /**
     * 菜单按钮组类
     *
     * @class
     * @param {Phaser.Game} game 游戏
     */
    function MenuBtns(game) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 组
         *
         * @type {Phaser.Group}
         */
        this.group = game.add.group();

        this.init();
    }

    /**
     * 初始化
     *
     * @private
     */
    MenuBtns.prototype.init = function () {
        var game = this.game;
        var level = game.state.states.level;
        var audioClick = level.audioClick;

        // 按钮配置
        // 显示顺序由下至上
        var btnConfigs = [
            {
                position: 'right',
                icon: 'icon-hero',
                title: '角色',
                onClick: function () {
                    audioClick.play();
                    var RolePopup = require('./popup/RolePopup');
                    new RolePopup(game);
                }
            },
            {
                position: 'left',
                icon: 'icon-podium',
                title: '排名',
                onClick: function () {
                    audioClick.play();
                    var RankDialog = require('./dialog/RankDialog');
                    new RankDialog(game);
                }
            }
        ];

        var btnTexture = 'menu-btn';
        var btnWidth = game.cache.getImage(btnTexture).width;
        var bottom = 160 + btnWidth / 2;
        var titleMargin = 8;

        // 位置配置, 分左右
        var posConfig = {};
        posConfig.left = {
            index: 0,
            x: 30 + btnWidth / 2,
            titleX: btnWidth / 2 + titleMargin,
            titleAnchorX: 0
        };
        posConfig.right = {
            index: 0,
            x: game.width - posConfig.left.x,
            titleX: -btnWidth / 2 - titleMargin,
            titleAnchorX: 1
        };

        var group = this.group;

        btnConfigs.forEach(function (config) {
            var pos = config.position;

            // 绘制按钮
            var btn = game.add.button(
                posConfig[pos].x,
                game.height - bottom - posConfig[pos].index * 70,
                btnTexture,
                config.onClick
            );
            btn.anchor.set(0.5);
            util.addHover(btn);
            group.add(btn);

            // 绘制图标
            var icon = game.add.image(0, 0, config.icon);
            icon.anchor.set(0.5);
            icon.width = 34;
            icon.height = icon.width;
            btn.addChild(icon);

            // 绘制标题
            var title = game.add.text(
                posConfig[pos].titleX, 0,
                config.title,
                {
                    font: 'bold 28px ' + global.fontFamily,
                    fill: color.get('white')
                }
            );
            title.anchor.set(posConfig[pos].titleAnchorX, 0.5);
            title.alpha = 0.8;
            title.setShadow(1, 1, color.get('black'), 4);
            btn.addChild(title);

            ++posConfig[pos].index;
        });
    };

    /**
     * 销毁
     *
     * @public
     */
    MenuBtns.prototype.destroy = function () {
        this.group.destroy();
    };

    return MenuBtns;

});
