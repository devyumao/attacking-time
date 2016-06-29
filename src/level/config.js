/**
 * @file level 配置
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    return {
        // 主题
        THEME: {
            1: {
                OFFSET: -30 // 背景初始偏移
            },
            2: {
                OFFSET: 200
            },
            3: {
                OFFSET: 100
            }
        },

        // 初始地平线高度
        INITIAL_HORIZON: 150,
        // 地平线高度
        HORIZON: 235,
        // 当前边缘水平位置
        CURR_EDGE_X: 110,
        // 食物宽度
        FOOD_WIDTH: 25,

        // 提示信息
        TIP: {
            PLAY: '按住屏幕\n使棒棒变长',
            FOOD: '行走时点击屏幕\n可翻转角色取道具'
        }
    };

});
