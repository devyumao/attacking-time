/**
 * @file 微信
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');

    /**
     * 初始化
     */
    function init() {
        var signPackage = global.getSignPackage();
        signPackage.jsApiList = [
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ];

        // debug 解除注释
        // signPackage.debug = true;

        wx.config(signPackage);

        wx.ready(function () {
            updateShare();
        });
    }

    /**
     * 更新分享
     */
    function updateShare() {
        var link = 'http://farm.yiluwan.org/efe-game/index.php';
        var imgUrl = 'http://farm.yiluwan.org/efe-game/asset/img/icon-200.png';

        wx.onMenuShareTimeline({
            title: global.getShareText(),
            link: link,
            imgUrl: imgUrl,
            success: function () {
                global.setShared(1);
            }
        });
        wx.onMenuShareAppMessage({
            title: 'SSGer向前冲',
            desc: global.getShareText(),
            link: link,
            imgUrl: imgUrl
        });
    }

    return {
        init: init,
        updateShare: updateShare
    };

});
