var hexToBinary = require('hex-to-binary');
var request = require('request');
// 10101111001100001011

var indexController = function (dayList) {
    var getIndex = function (req, res) {
        res.render('index', {
            dayList: dayList,
        });
    };
    var postIndex = function (req, res) {
        binaryString = hexToBinary(req.body.code);
        decode(binaryString).then((item)=>{
            res.send(item);
        },(error)=>{
            res.send(error);
        });

    };

    return {
        postIndex: postIndex,
        getIndex: getIndex,
    };
};

var header = [
    { length: 96, code: "00110000" },
    { length: 198, code: "00110110" }
];
var filters = [
    "000",
    "001",
    "010",
    "011",
    "100",
    "101",
    "110",
    "111",
];
var partitions96 = [
    { bitsP: 40, code: "000" },
    { bitsP: 37, code: "001" },
    { bitsP: 34, code: "010" },
    { bitsP: 30, code: "011" },
    { bitsP: 27, code: "100" },
    { bitsP: 24, code: "101" },
    { bitsP: 20, code: "110" },
];
var decode = function (binaryString) {
    return new Promise(function (resolve, reject) {
        var item = {
            length: 0,
            filter: -1,
            bitsP: 0,
            bitsR: 0,
            companyPrefix: "",
            itemRef: "",
            serial: ""
        };
        var t = binaryString.substring(0, 8);
        header.forEach(element => {
            if (t === element.code) {
                item.length = element.length;
            }
        });
        if (item.length != 0) {
            if (item.length == 96) {
                t = binaryString.substring(8, 11);
                console.log(t);
                filters.forEach((element, index) => {
                    if (element == t) {
                        item.filter = index;
                    }
                });
                if (item.filter == -1) {
                    reject('Invalid code!');
                } else {
                    t = binaryString.substring(11, 14);
                    console.log(t);
                    partitions96.forEach(element => {
                        if (element.code == t) {
                            console.log('hi');
                            item.bitsP = element.bitsP;
                            item.bitsR = 44 - item.bitsP;
                        }
                    });
                    if (item.bitsP == 0) {
                        reject('Invalid code!');
                    }
                    else {
                        item.companyPrefix = parseInt(binaryString.substring(14, 14 + item.bitsP), 2);
                        item.itemRef = parseInt(binaryString.substring(14 + item.bitsP, 14 + 44), 2);
                        item.serial = parseInt(binaryString.substring(14 + 44, 97), 2);
                        var headers = {
                            'accept': 'application / json',
                            'Accept-Encoding': 'null',
                            'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,hr;q=0.7,bs;q=0.6',
                            'Authorization': 'Basic c2VjcmV0OnRVM2trIT94eHg=',
                            'Connection': 'keep-alive',
                            'Cookie': 'ARRAffinity=375a51caba39ed6403f413cf4baf82e0c5dffdd351dc95f8281971d73556ddef; _ga=GA1.2.328925278.1527153955; _gid=GA1.2.275453726.1527153955',
                            'Host': 'jobfair.tagitsolutions.com',
                            'Referer': 'http://jobfair.tagitsolutions.com/api-help-gRtx!/',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
                        }

                        var options = {
                            url: 'http://jobfair.tagitsolutions.com/q934dr4/' + item.companyPrefix + '/' + item.itemRef,
                            method: 'GET',
                            headers: headers,
                        }

                        // Start the request
                        request(options, function (error, response) {
                            if (!error && response.statusCode == 200) {
                                resolve({ item: item, response: JSON.parse(response.body) });
                            }
                            else{
                                reject('Invalid code!');
                            }
                        });
                    }

                }
            }
            else {
                reject('The encoding is not SGTIN-96!');
            }
        }
        else {
            reject('Invalid code!');
        }
    });
}
module.exports = indexController;