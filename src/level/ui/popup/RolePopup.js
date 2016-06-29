/**
 * @file 角色选择 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/ui/Popup');

    /**
     * 英雄家族弹框类
     *
     * @class
     * @extends Popup
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     */
    function RolePopup(game, options) {
        if (!options) {
            options = {};
        }

        Popup.call(
            this, game,
            {
                hasHeader: true,
                headerType: 'icon',
                headerIcon: 'icon-hero',
                title: '选择角色',
                y: 50,
                height: 652,
                hasMaskTouch: options.hasMaskTouch
            }
        );

        this.init();
    }
    util.inherits(RolePopup, Popup);

    /**
     * 初始化内容
     *
     * @private
     */
    RolePopup.prototype.initContent = function () {
        var me = this;
        var game = this.game;
        var container = this.container;

        var level = game.state.states.level;
        var audioClick = level.audioClick;

        global.herosConfig.forEach(function (heroConfig, index) {
            var panelEdgeHeight = game.cache.getImage('panel-edge-yellow').height;
            var panelMargin = 20;
            var panelWidth = 170;
            var panelMainHeight = 150;
            var panelHeight = panelMainHeight + panelEdgeHeight * 2;

            // 设置面板容器
            var panelCtn = game.add.button(
                (me.containerWidth + (index % 2 ? 1 : -1) * (panelMargin + panelWidth)) / 2,
                (panelMargin + panelHeight) * Math.floor(index / 2) + panelMargin,
                'transparent-2',
                function () {
                    audioClick.play();
                    this.select(heroConfig.id);
                    this.hide();
                },
                me
            );
            container.addChild(panelCtn);
            util.addHover(panelCtn);

            var panelTopEdge = game.add.image(
                0, 0,
                'panel-edge-' + heroConfig.color
            );
            panelTopEdge.anchor.set(0.5, 0);
            panelCtn.addChild(panelTopEdge);

            var panelMain = game.add.image(
                panelTopEdge.x,
                panelTopEdge.y + panelEdgeHeight,
                'pixel-' + heroConfig.color
            );
            panelMain.scale.set(panelWidth / 2, panelMainHeight / 2);
            panelMain.anchor.set(0.5, 0);
            panelCtn.addChild(panelMain);

            var panelBottomEdge = game.add.image(
                panelTopEdge.x,
                panelMain.y + panelMainHeight + panelEdgeHeight,
                'panel-edge-' + heroConfig.color
            );
            panelBottomEdge.scale.y = -1;
            panelBottomEdge.anchor.set(0.5, 0);
            panelCtn.addChild(panelBottomEdge);


            var legend = game.add.image(
                0, 70,
                'legend-' + heroConfig.name
            );
            legend.anchor.set(0.5);
            legend.scale.set(0.92);
            panelCtn.addChild(legend);

            // 绘制名称文本
            var nameText = game.add.text(
                0, 130,
                heroConfig.chName,
                {
                    font: 'bold 24px ' + global.fontFamily,
                    fill: color.get('dark-purple')
                }
            );
            nameText.anchor.set(0.5, 0);
            panelCtn.addChild(nameText);

        });
    };

    /**
     * 选择英雄
     *
     * @private
     * @param {number} id 序号
     */
    RolePopup.prototype.select = function (id) {
        var game = this.game;

        var hero = game.state.states.level.hero;
        hero.change(id);

        // global.setNickname(''); // for dev
        if (!global.getNickname()) {
            var heroConfig = global.herosConfig[global.getSelected()];
            global.setNickname(global.getRandomNameTitle() + heroConfig.chName);

            var level = game.state.states.level;
            level.title.tween();
        }
    };

    return RolePopup;

});
