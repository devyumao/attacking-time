/**
 * @file 排行榜 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Dialog = require('common/ui/Dialog');
    var Easing = require('common/Easing');

    /**
     * 排行榜弹框类
     *
     * @class
     * @extends Dialog
     * @param {Phaser.Game} game 游戏
     */
    function RankDialog(game) {
        Dialog.call(
            this, game,
            {
                bodyName: 'dialog-rank',
                y: 34,
                ctnX: 105 + 10,
                ctnY: 212 + 34
            }
        );

        this.init();
    }
    util.inherits(RankDialog, Dialog);

    /**
     * 初始化内容
     *
     * @private
     */
    RankDialog.prototype.initContent = function () {
        var me = this;
        // 获取排行数据
        require('common/ajax').get({
            url: require('common/url').GET_RANK,
            success: function (res) {
                res = JSON.parse(res);
                me.preprocessData(res);
            }
        });

        this.initDoll();
    };

    /**
     * 预处理数据
     *
     * @private
     * @param {Object} data 数据
     */
    RankDialog.prototype.preprocessData = function (data) {
        var list;

        var me = data.me;
        // me.rank = 343; // for dev

        if (me.rank > 5) { // 不在前5, 截前4 + 自己
            list = data.list.slice(0, 4);

            me.highest = global.getHighest();
            // me.highest = 323; // for dev
            list.push(me);
        }
        else {
            list = data.list.slice(0, 5);
        }

        this.initRows(list, me.nickname);
    };

    /**
     * 初始化行
     *
     * @private
     * @param {Array.<Object>} rankData 排行数据
     * @param {string} myNickname 个人昵称
     */
    RankDialog.prototype.initRows = function (rankData, myNickname) {
        var game = this.game;
        var container = this.container;

        rankData.forEach(function (data, index) {
            var rowHeight = 50;
            var rowWidth = 259;
            var margin = 8;

            // 绘制行
            var row = game.add.image(0, rowHeight / 2 + (rowHeight + margin) * index, 'transparent-2');
            row.anchor.set(0, 0.5);
            container.addChild(row);

            // 绘制排名
            var rankText = game.add.text(
                8, 0,
                (data.rank ? (data.rank > 999 ? '999+' : data.rank) : index + 1),
                {
                    font: 'bold 22px ' + global.fontFamily,
                    fill: color.get('dark-purple')
                }
            );
            rankText.anchor.set(0, 0.5);
            if (data.rank && data.rank > 999) { // 四位数及以上缩放
                rankText.scale.set(45 / rankText.width);
            }
            row.addChild(rankText);

            // 绘制名字
            var nameText = game.add.text(
                55, 0,
                data.nickname.replace(/-/g, ''),
                {
                    font: '20px ' + global.fontFamily,
                    fill: color.get('dark-purple')
                }
            );
            nameText.anchor.set(0, 0.5);
            row.addChild(nameText);

            if (data.nickname === myNickname) {
                // 绘制我的标签
                var meTip = game.add.image(
                    nameText.x + nameText.width + 4,
                    -2,
                    'me-tip'
                );
                meTip.anchor.set(0, 0.5);
                row.addChild(meTip);

                var meText = game.add.text(
                    meTip.width - 4, 1,
                    'me',
                    {
                        font: 'bold 16px ' + global.fontFamily,
                        fill: color.get('white')
                    }
                );
                meText.anchor.set(1, 0.5);
                meTip.addChild(meText);
            }

            // 绘制分数
            var scoreText = game.add.text(
                rowWidth - 8, 0,
                data.highest + '',
                {
                    font: 'bold 22px ' + global.fontFamily,
                    fill: color.get('cherry')
                }
            );
            scoreText.anchor.set(1, 0.5);
            row.addChild(scoreText);
        });
    };

    /**
     * 初始化玩偶物件
     *
     * @private
     */
    RankDialog.prototype.initDoll = function () {
        var game = this.game;
        var container = this.container;

        var doll = game.add.image(300, 377, 'dialog-rank-doll');
        doll.anchor.set(0.5, 1);
        doll.angle += 4;
        container.addChild(doll);

        game.add.tween(doll)
            .to({angle: '-8'}, 1000, Easing.Sinusoidal.InOut, true, 0, -1, true);
    };

    return RankDialog;

});
