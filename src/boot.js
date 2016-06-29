/**
 * @file 启动
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var loadingImage;

    /**
     * 预加载
     */
    function preload() {
        global.setResource();

        // 资源供 preload state 使用, 故在 boot state 提前加载
        var game = this.game;
        var herosConfig = global.herosConfig;
        var loadingHeroIndex = game.rnd.between(0, herosConfig.length - 1);
        var heroConfig = herosConfig[loadingHeroIndex];
        var heroName = heroConfig.name;
        loadingImage = heroName + '-down';
        game.load.spritesheet(
            loadingImage,
            global.path + heroName + '/down' + global.suffix,
            heroConfig.width, heroConfig.height
        );

        game.load.audio('bgm', [global.audioPath + 'bgm.ogg', global.audioPath + 'bgm.mp3']);
    }

    /**
     * 创建对象
     */
    function create() {
        var game = this.game;

        // 场景设置
        game.stage.backgroundColor = require('common/color').get('bg');

        // 屏幕振动插件设置
        game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);
        game.plugins.screenShake.setup({
            shakeX: false,
            shakeY: true,
            sensCoef: 0.3
        });

        // 比例设置
        var scale = this.scale;
        scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // 保持高宽比铺屏
        scale.pageAlignHorizontally = true;
        scale.pageAlignVertically = true;

        // 避免玩家看到屏幕适应的过程
        setTimeout(
            function () {
                game.state.start('preload', true, false, {loadingImage: loadingImage});
            },
            100
        );
    }

    return {
        preload: preload,
        create: create
    };

});
