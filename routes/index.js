var express = require('express');
var router = express.Router();

var url = require('url');
var superagent = require('superagent');
var cheerio = require('cheerio');


var allUrl = [];  //采集过得url保存
var baseUrl = 'http://www.ithome.com/'; //入口初始url

router.post('/', function (req, res, next) {
    console.log('start:')

    function openLink(urlLink) {

        //放到采集过得数组中
        allUrl.push(urlLink);

        superagent.get(urlLink)
            .end(function (err, result) {
                //打开一次url 输出已经遍历的url 和 当前url
                console.log('open:' + urlLink,allUrl.length);
                if (err) {
                    console.error('这个页面出现错误' + err);
                    return;
                } else {
                    var $ = cheerio.load(result.text);
                    $('a').each(function (idx, element) {
                        if (element.attribs.href) {
                            var newUrl = url.resolve(baseUrl, element.attribs.href);
                            var index = newUrl.indexOf(baseUrl);
                            //判断连接是否同一域 和 是否已经打开过
                            if (index >= 0 && allUrl.indexOf(newUrl) == -1) {
                                openLink(newUrl);
                            }
                        }
                    })
                }
                //打开连接返回的新连接

            });
    }

    openLink(baseUrl);

});

module.exports = router;
