/**
 * 默认配置
 */
window.globalLan = 'cn';
;(function ($) {
    $(function () {
        // 切换语言
        $('.menu-news-main li').on('click', function () {
            var lan = $(this).attr('lan');
            $.cookie('tf-lan', lan, { expires:  30});
            renderDom();
        });
        // 返回顶部
        $('.tf-backtop').on('click', function () {
            $('body,html').animate({
                scrollTop: 0
            }, 300);
        })
    });
})(jQuery);
// 滑动事件，给header添加样式
window.onscroll = function() {
    //为了保证兼容性，这里取两个值，哪个有值取哪一个
    //scrollTop就是触发滚轮事件时滚轮的高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop) {
        $('.tf-header').addClass('scroll')
    }
    else {
        $('.tf-header').removeClass('scroll')
    }
}
// 通过语言，获取翻译
function renderDom() {
    // 获取所有带data-lan标签的元素，用于翻译
    var allLan = $('[data-lan]');
    var allLanPlace = $('[data-lan-placeholder]');
    // 从cookie里面记录当前语言
    var lan =  $.cookie('tf-lan') || 'cn';
    // 存储缓存30天
    $.cookie('tf-lan', lan, { expires:  30});
    window.globalLan = lan;
    // 从配置中读取语言列表
    var config = lanConfig[lan] || {};
    // 获取元素
    $('.menu-news-main li').removeClass('active');
    var lanLi = $('.menu-news-main li[lan='+lan+']');
    lanLi.addClass('active')
    $('.lan-name').html(lanLi.html());
    // 所有文本替换
    allLan.each(function(i) {
        var lanText = $(this).data('lan').split('.')
        // 判断是否为数据
        var trueText = getTrueText(lanText, 0, config)
        $(this).html(trueText);
    });
    // 所有placeholder 替换
    allLanPlace.each(function(i) {
        var lanText = $(this).data('lan-placeholder').split('.')
        // 判断是否为数据
        var trueText = getTrueText(lanText, 0, config)
        $(this).attr('placeholder', trueText);
    });
}
// 遍历获取最后的词汇
function getTrueText(obj, index, params ) {
    if (obj.length === index + 1) {
        return params[obj[index]] || ''
    }
    params = params[obj[index]];
    index++;
    return getTrueText(obj, index, params)
}

// 加入我们
function sendMessage(result, cb) {
    $.ajax({
        url: 'xxxxx',
        type: 'post',
        dataType: 'json',
        data: result,
        xhrFields:{
            withCredentials: true
        }
    })
    .done(function(res) {
        console.log(res);
        cb && cb(res)
    })
} 