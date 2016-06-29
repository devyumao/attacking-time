/**
 * @file 全局
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var ajax = require('common/ajax');
    var url = require('common/url');
    var util = require('common/util');
    var serverData = require('common/serverData');

    var storagePrefix = 'attackingtime-';
    var storageKey = {
        foodCount: storagePrefix + 'food-count',
        highest: storagePrefix + 'highest',
        selected: storagePrefix + 'selected',
        unlocks: storagePrefix + 'unlocks',
        shared: storagePrefix + 'shared',
        nickname: storagePrefix + 'nickname',
        hasTool: storagePrefix + 'has-tool'
    };

    var global = {};

    function init() {
        handleConst();

        handleMode();
        // handleResource();

        handleHerosConfig();

        handleNameTitle();

        handleStorage();

        handleFoodCount();

        handleHighest();
        handleSelected();
        handleUnlocks();
        handleShared();
        handleHasTool();

        handleNickname();
        handleSignPackage();
        handleShareText();
        handleTryTimes();
        handleNonShareTimes();
    }

    function handleMode() {
        var mode = 'dev';

        global.setMode = function (newMode) {
            mode = newMode;
        };

        global.getMode = function () {
            return mode;
        };

        global.isDevMode = function () {
            return mode === 'dev';
        };

        global.isProdMode = function () {
            return mode === 'prod';
        };
    }

    global.setResource = function () {
        if (global.isProdMode()) {
            global.path = 'http://ishowshao-game.qiniudn.com/efe-game/asset/img/';
            // global.path = 'asset/img/';
            global.suffix = '.png?v=*TIMESTAMP*';

            global.audioPath = 'asset/audio/';
        }
        else {
            global.path = 'src/img/';
            global.suffix = '.png';

            global.audioPath = 'src/audio/';
        }
    };

    function handleConst() {
        global.LEVEL_STATUS = {
            MENU: 0,
            PLAY: 1
        };

        global.fontFamily = '"Helvetica Neue", Helvetica, STHeiTi, sans-serif';
    }

    function handleStorage() {
        global.getStorage = function (keys) {
            var storage = {};
            keys.forEach(function (key) {
                storage[key] = localStorage.getItem(storageKey[key]);
            });
            return storage;
        };

        global.assignStorage = function (keys) {
            keys.forEach(function (key) {
                global['assign' + util.firstToUpperCase(key)]();
            });
        };

        global.initStorage = function (keys) {
            keys.forEach(function (key) {
                // if (key !== 'nickname') {
                //     global['init' + util.firstToUpperCase(key)]();
                // }
                global['init' + util.firstToUpperCase(key)]();
            });
        };

        global.setStorage = function (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    global['set' + util.firstToUpperCase(key)](obj[key], false);
                }
            }
        };

        global.clearStorage = function () {
            for (var key in storageKey) {
                if (storageKey.hasOwnProperty(key)) {
                    localStorage.removeItem(storageKey[key]);
                }
            }
        };
    }

    function handleFoodCount() {
        var foodCount;

        global.initFoodCount = function (count) {
            foodCount = +localStorage.getItem(storageKey.foodCount);
            foodCount = foodCount ? +foodCount : 0;
            // foodCount = 2100;
        };

        global.assignFoodCount = function (count) {
            foodCount = count;
        };

        global.getFoodCount = function () {
            return foodCount;
        };

        global.setFoodCount = function (count, cb) {
            if (count === foodCount) {
                return;
            }

            // 加 优先给玩家看，减 要先保证再给玩家看
            var toBeAdded = count > foodCount;

            function setLocal() {
                foodCount = count;
                localStorage.setItem(storageKey.foodCount, count);
            }

            ajax.get({
                url: toBeAdded ? url.ADD_FOOD : url.USE_FOOD,
                data: {
                    count: Math.abs(count - foodCount)
                },
                success: function (res) {
                    res = JSON.parse(res);
                    if (res.success) {
                        !toBeAdded && setLocal();
                        cb && cb();
                    }
                    res.success && cb && cb();
                }
            });

            toBeAdded && setLocal();
        };
    }

    function handleHighest() {
        var highest;

        global.assignHighest = function () {
            highest = +localStorage.getItem(storageKey.highest);
        };

        global.initHighest = function () {
            global.setHighest(0);
        };

        global.getHighest = function () {
            return highest;
        };

        global.setHighest = function (score, remote) {
            highest = +score;

            if (typeof remote === 'undefined') {
                remote = true;
            }

            remote && serverData.save({
                highest: highest
            });

            localStorage.setItem(storageKey.highest, highest);
        };
    }

    // 被选英雄
    function handleSelected() {
        var selected;

        global.assignSelected = function () {
            selected = +localStorage.getItem(storageKey.selected);
        };

        global.initSelected = function () {
            global.setSelected(0);
        };

        global.getSelected = function () {
            return selected;
        };

        global.setSelected = function (index, remote) {
            selected = +index;

            if (typeof remote === 'undefined') {
                remote = true;
            }

            remote && serverData.save({
                selected: selected
            });

            localStorage.setItem(storageKey.selected, selected);
        };
    }

    function handleShared() {
        var shared;

        global.assignShared = function () {
            shared = +localStorage.getItem(storageKey.shared);
        };

        global.initShared = function () {
            global.setShared(0);
        };

        global.getShared = function () {
            return shared;
        };

        global.setShared = function (newShared, remote) {
            shared = +newShared;

            if (typeof remote === 'undefined') {
                remote = true;
            }
            remote && serverData.save({
                shared: shared
            });

            localStorage.setItem(storageKey.shared, shared);
        };
    }

    function handleHasTool() {
        var hasTool;

        global.assignHasTool = function () {
            hasTool = +localStorage.getItem(storageKey.hasTool);
        };

        global.initHasTool = function () {
            global.setHasTool(0);
        };

        global.getHasTool = function () {
            return hasTool;
        };

        global.setHasTool = function (newValue, remote) {
            hasTool = +newValue;

            if (typeof remote === 'undefined') {
                remote = true;
            }
            remote && serverData.save({
                hasTool: hasTool
            });

            localStorage.setItem(storageKey.hasTool, hasTool);
        };
    }

    // 解锁列
    function handleUnlocks() {
        var unlocks;

        function setUnlock(index, value) {
            unlocks[index] = value;
            saveUnlocks();
        }

        function saveUnlocks(remote) {
            var unlocksStr = JSON.stringify(unlocks);

            if (typeof remote === 'undefined') {
                remote = true;
            }
            remote && serverData.save({
                unlocks: unlocksStr
            });

            localStorage.setItem(storageKey.unlocks, unlocksStr);
        }

        global.assignUnlocks = function () {
            unlocks = JSON.parse(localStorage.getItem(storageKey.unlocks));
        };

        global.initUnlocks = function () {
            unlocks = [1];
            for (var i = 1, len = global.herosConfig.length; i < len; ++i) {
                unlocks.push(0);
            }
            saveUnlocks(unlocks);
        };

        global.getUnlock = function (index) {
            return unlocks[index];
        };

        global.setUnlocks = function (newUnlocks, remote) {
            unlocks = util.isArray(newUnlocks) ? unlocks : JSON.parse(newUnlocks);
            saveUnlocks(remote);
        };

        global.unlock = function (index) {
            setUnlock(index, 1);
        };

        global.lock = function (index) {
            setUnlock(index, 0);
        };
    }

    // 昵称
    function handleNickname() {
        var nickname;

        global.assignNickname = function () {
            nickname = localStorage.getItem(storageKey.nickname);
        };

        global.initNickname = function () {
            global.setNickname('', false);
        };

        global.getNickname = function () {
            return nickname;
        };

        global.setNickname = function (name, remote) {
            nickname = name;

            if (typeof remote === 'undefined') {
                remote = true;
            }
            remote && serverData.save({
                nickname: nickname
            });

            localStorage.setItem(storageKey.nickname, nickname);
        };
    }

    function handleSignPackage() {
        var signPackage;

        global.getSignPackage = function () {
            return signPackage;
        };

        global.setSignPackage = function (obj) {
            signPackage = obj;
        };
    }

    function handleShareText() {
        var shareText;

        global.resetShareText = function () {
            shareText = '【SSG程序员节】进攻时刻，SSGer向前冲！';
        };

        global.getShareText = function () {
            return shareText;
        };

        global.setShareText = function (text) {
            shareText = text;
        };
    }

    function handleTryTimes() {
        var tryTimes = 0;

        global.resetTryTimes = function () {
            tryTimes = 0;
        };

        global.getTryTimes = function () {
            return tryTimes;
        };

        global.addTryTimes = function () {
            ++tryTimes;
        };
    }

    function handleNonShareTimes() {
        var times = 0;

        global.resetNonShareTimes = function () {
            times = 0;
        };

        global.getNonShareTimes = function () {
            return times;
        };

        global.addNonShareTimes = function () {
            ++times;
        };
    }

    function handleHerosConfig() {
        global.herosConfig = [
            {
                id: 0,
                name: 'rd',
                chName: '开发',
                color: 'green',
                width: 207,
                height: 305,
                paddingRight: 8,
                scale: 0.3,
                actions: {
                    down: {fps: 6},
                    // up: {fps: 10},
                    // kick: {fps: 15},
                    walk: {fps: 6}
                },
                unlockType: 'free',
                cost: 0,
                desc: '',
                powerText: '',
                power: {}
            },
            {
                id: 1,
                name: 'ue',
                chName: '设计',
                color: 'yellow',
                width: 209,
                height: 305,
                paddingRight: 8,
                scale: 0.3,
                actions: {
                    down: {fps: 6},
                    // up: {fps: 10},
                    // kick: {fps: 15},
                    walk: {fps: 6}
                },
                unlockType: 'free',
                cost: 0,
                desc: '',
                powerText: '',
                power: {}
            },
            {
                id: 2,
                name: 'sale',
                chName: '销售',
                color: 'yellow',
                width: 335,
                height: 325,
                paddingRight: 8,
                scale: 0.3,
                actions: {
                    down: {fps: 6},
                    // up: {fps: 10},
                    // kick: {fps: 15},
                    walk: {fps: 6}
                },
                unlockType: 'free',
                cost: 0,
                desc: '',
                powerText: '',
                power: {}
            },
            {
                id: 3,
                name: 'service',
                chName: '职能',
                color: 'green',
                width: 207,
                height: 305,
                paddingRight: 8,
                scale: 0.3,
                actions: {
                    down: {fps: 6},
                    // up: {fps: 10},
                    // kick: {fps: 15},
                    walk: {fps: 6}
                },
                unlockType: 'free',
                cost: 0,
                desc: '',
                powerText: '',
                power: {}
            },
            {
                id: 4,
                name: 'pm',
                chName: '产品',
                color: 'green',
                width: 207,
                height: 305,
                paddingRight: 8,
                scale: 0.3,
                actions: {
                    down: {fps: 6},
                    // up: {fps: 10},
                    // kick: {fps: 15},
                    walk: {fps: 6}
                },
                unlockType: 'free',
                cost: 0,
                desc: '',
                powerText: '',
                power: {}
            },
            {
                id: 5,
                name: 'op',
                chName: '运营',
                color: 'yellow',
                width: 241,
                height: 306,
                paddingRight: 16,
                scale: 0.3,
                actions: {
                    down: {fps: 6},
                    // up: {fps: 10},
                    // kick: {fps: 15},
                    walk: {fps: 6}
                },
                unlockType: 'free',
                cost: 0,
                desc: '',
                powerText: '',
                power: {}
            }
        ];

        global.getHeroConfig = function () {
            return global.herosConfig[global.getSelected()];
        };
    }

    function handleNameTitle() {
        var nameTitles = [
            '王牌', '史诗', '屠龙', '超级', '金牌',
            '流浪', '全能', '神圣', '天才', '鬼才',
            '极品', '狼性', '顶尖', '强力', '壮志',
            '无双', '天生', '风云', '倚天', '盖世',
            '绝世', '有爱', '妙手', '雄才', '鬼斧',
            '智勇', '先知', '百战', '鲜肉', '美艳',
            '传说', '大侠', '精英', '魔王', '狂魔',
            '逆天', '暴走', '神级', '天王', '魔性',
            '走心', '神速', '实力', '驰名', '元老',
            '觉醒', '王者', '土豪', '白金', '黄金',
            '激萌', '宗师', '超神', '强者', '无敌',
            '炸天', '核心'
        ];

        var len = nameTitles.length;

        global.getRandomNameTitle = function () {
            return nameTitles[Math.floor(Math.random() * len)];
        };
    }

    init();

    return global;

});
