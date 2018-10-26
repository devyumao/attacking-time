/**
 * @file 预加载
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    var loadingImage;

    /**
     * 初始化
     *
     * @param {Object} options 参数项
     * @param {Object} options.loadingImage 载入中图片
     */
    function init(options) {
        loadingImage = options.loadingImage;
    }

    /**
     * 预加载
     */
    function preload() {
        var game = this.game;

        initLoading(game);
        loadResources(game);
    }

    /**
     * 初始化载入画面
     *
     * @inner
     * @param {Phaser.Game} game 游戏
     */
    function initLoading(game) {
        // 绘制话术
        var loadingText = game.add.text(
            game.width / 2, 260,
            'SSGer准备中...',
            {
                font: 'bold 30px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        loadingText.anchor.set(0.5);

        // 绘制跑动的默认英雄
        var hero = game.add.sprite(game.width / 2, game.height / 2, loadingImage);
        hero.anchor.set(0.5);
        hero.scale.set(0.5);
        var action = 'down';
        hero.animations.add(action);
        hero.animations.play(action, 6, true);
    }

    /**
     * 加载资源
     *
     * @inner
     * @param {Phaser.Game} game 游戏
     */
    function loadResources(game) {
        var path = global.path;
        var suffix = global.suffix;

        [
            'bgm', 'ground', 'click', 'stick-lay-down', 'pass',
            'tool', 'spot', 'stick-lengthen', 'wall', 'hero-fly',
            'fly'
        ].forEach(function (name) {
            game.load.audio(name, [global.audioPath + name + '.ogg', global.audioPath + name + '.mp3']);
        });

        // 普通图
        [
            'transparent', 'transparent-2',
            'spot',
            'title-xqc', 'title-xd', 'title-fly', 'title-hero',
            'start', 'start-ring',
            'menu-btn', 'icon-hero', 'icon-podium',
            'scoreboard',
            'popup-edge', 'popup-header',
            'panel-edge-yellow', 'panel-edge-green',
            'me-tip',
            'end-board', 'new-record', 'end-doll', 'copyright',
            'building',
            'dialog-rank', 'dialog-rank-doll',
            'btn-share', 'btn-home', 'btn-restart'
        ].forEach(function (name) {
            game.load.image(name, path + name + suffix);
        });

        // 像素图
        ['black', 'white', 'yellow', 'green'].forEach(function (color) {
            game.load.image('pixel-' + color, path + 'pixel/' + color + suffix);
        });

        // 棒棒精灵图
        ['stick'].forEach(function (name) {
            game.load.spritesheet(name, path + name + suffix, 5, 24);
        });

        global.herosConfig.forEach(function (hero) {
            // 英雄精灵图
            var name = hero.name;
            var actions = hero.actions;
            for (var action in actions) {
                if (actions.hasOwnProperty(action)) {
                    game.load.spritesheet(
                        [name, action].join('-'),
                        path + name + '/' + action + suffix,
                        hero.width, hero.height
                    );
                }
            }

            // 英雄图例
            game.load.image('legend-' + name, path + 'legend/' + name + suffix);

            // 道具
            for (var i = 1; i <= 3; ++i) {
                var fileName = [name, i].join('-');
                game.load.image(['tool', fileName].join('-'), path + 'tool/' + fileName + suffix);
            }
        });

        // 背景精灵图
        [1580].forEach(function (width, index) {
            var no = index + 1;
            var dir = path + 'view-' + no + '/';
            ['bg', 'mg-far', 'mg-near'].forEach(function (name) {
                game.load.spritesheet(name, dir + name + suffix, width, 800);
            });
        });

        // 平台精灵图
        [243, 243, 243].forEach(function (height, index) {
            var name = 'stage-' + (index + 1);
            game.load.spritesheet(name, path + name + suffix, 168, height);
        });
    }

    /**
     * 创建
     */
    function create() {
        var me = this;
        fetchData()
            .then(function () {
                // 与以往不同，menu -> level 是连贯场景，所以实际是同一 state
                me.state.start('level', true, false, global.LEVEL_STATUS.MENU);
            });

        var game = this.game;
        var bgm = game.add.audio('bgm');
        game.sound.setDecodedCallback(
            [bgm],
            function () {
                bgm.loopFull();
            },
            this
        );
    }

    /**
     * 获取数据 线上 OR 本地
     *
     * @inner
     * @return {Promise}
     */
    function fetchData() {
        var keys = ['highest', 'selected', 'unlocks', 'shared', 'hasTool'];
        var storage = global.getStorage(keys);
        var serverKeys = ['nickname'];
        for (var key in storage) {
            if (storage.hasOwnProperty(key) && storage[key] === null) {
                serverKeys.push(key);
            }
        }
        var localKeys = [];
        keys.forEach(function (key) {
            if (serverKeys.indexOf(key) === -1) {
                localKeys.push(key);
            }
        });

        localKeys.length && global.assignStorage(localKeys);

        // if (serverKeys.length) {
        //     var serverData = require('common/serverData');

        //     return new Promise(function (resolve) {
        //         serverData.load(
        //             serverKeys,
        //             function (res) {
        //                 if (!res && global.isDevMode()) {
        //                     global.initStorage(serverKeys);
        //                     resolve();
        //                     return;
        //                 }
        //                 res = JSON.parse(res);
        //                 var missingKeys = [];
        //                 serverKeys.forEach(function (key) {
        //                     if (!res.hasOwnProperty(key)) {
        //                         missingKeys.push(key);
        //                     }
        //                 });
        //                 global.initStorage(missingKeys);
        //                 global.setStorage(res);
        //                 resolve();
        //             },
        //             function (err) {
        //                 if (global.isDevMode() || global.getNickname() === 'devyumao') {
        //                     global.initStorage(serverKeys);
        //                 }
        //                 resolve();
        //             }
        //         );
        //     });
        // }

        return Promise.resolve();
    }

    return {
        init: init,
        preload: preload,
        create: create
    };

});
