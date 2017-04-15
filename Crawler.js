var https = require('https');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');

var url = 'https://www.javbus5.com/';

function filterSEX(html) {
    var $ = cheerio.load(html);
    var sexData = [];
    var sexContainer = $(".movie-box");
    sexContainer.each(function(item) {
        var sexBox = $(this);
        var sexTitle = sexBox.find('.photo-frame > img').attr('title');
        var sexBanner = sexBox.find('.photo-frame > img').attr('src');
        // var sexID = sexBox.attr('href').split('https://www.javbus5.com/')[1];
        var sexUrl = sexBox.attr('href');
        sexData.push({
            sexTitle: sexTitle,
            sexBanner: sexBanner,
            sexUrl: sexUrl
        });
    });

    return sexData;
}

function writeMD(data) {
    // fs.writeFile(filename,data,[options],callback);
    var mdData = '# Nodejs 爬蟲\n\n';
    data.forEach(function(currentValue, index, array) {
        mdData += ('[![' + currentValue.sexTitle + '](' + currentValue.sexBanner + ')](' + currentValue.sexUrl + ')' + '\n');
    });

    var w_data = new Buffer(mdData);
    fs.writeFile(__dirname + '/test.md', w_data, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("写入成功");
        }

    });
}

https.get(url, function(res) {
    var html = '';
    var data = '';
    res.on('data', function(data) {
        html += data;
    });

    res.on('end', function() {
        data = filterSEX(html);
        writeMD(data);

    });
}).on('error', function(err) {
    console.log("获取信息出错" + err);
});