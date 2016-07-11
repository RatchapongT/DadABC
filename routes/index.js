var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'ABC'});
});

router.post('/', function (req, res, next) {
    var list = getUniqueCombinationSet();
    var hashMap = {};
    for (var s in list) {
        hashMap[s] = 0;
    }
    var uniqueInput = {};
    var allNumbers = req.body.inputField.split(',');
    //console.log(allNumbers);
    for (var i = 0; i < allNumbers.length; i++) {
        //console.log(allNumbers[i]);
        uniqueInput[allNumbers[i]] = true;
    }
    allNumbers = Object.keys(uniqueInput);
    for (var input in uniqueInput) {
        //console.log(input);
        var number = input;
        if (number) {
            var charArray = getOtherNumbers(number + '').split('');
            var result = [];
            generate(3, charArray, [0, 0, 0], 0, result);
            for (var i = 0; i < result.length; i++) {
                var hashKey = result[i].join('') + '';
                if (hashMap[hashKey] >= 0) {
                    hashMap[hashKey] = hashMap[hashKey] + 1;
                }
            }
        }
    }
    var finalResult = {};
    for (var key in hashMap) {
        var frequency = hashMap[key];
        if (!finalResult[frequency]) {
            finalResult[frequency] = [];
        }
        finalResult[frequency].push(key);
        finalResult[frequency].sort();
    }
    return res.json({
        finalResult: finalResult,
        finalInput: allNumbers
    });
});
function generate(k, charSet, charStr, index, list) {
    if (index == k) {
        list.push(charStr.slice());
    } else {
        for (var i = 0; i < charSet.length; i++) {
            charStr[index] = charSet[i];
            generate(k, charSet, charStr, index + 1, list);
        }
    }
}

function getUniqueCombinationSet() {
    var hashSet = {};
    for (var i = 0; i < 1000; i++) {
        var permutations = permutator(pad(i, 3).split(''));
        permutations.sort();

        var first = permutations[0];
        var found = false;

        for (var j = 0; j < permutations.length; j++) {
            if (hashSet[permutations[j]]) {
                found = true;
            }
        }
        if (!found) {
            hashSet[first] = true;
        }
    }
    return hashSet;

}


function permutator(inputArr) {
    var results = [];

    function permute(arr, memo) {
        var cur, memo = memo || [];
        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
                results.push(memo.concat(cur).join(''));
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
        }
        return results;
    }

    return permute(inputArr);
}
function getOtherNumbers(str) {
    var newStr = '';
    for (var i = 0; i < 10; i++) {

        if (str.indexOf((i + '')) == -1) {
            newStr = newStr + (i + '');
        }
    }

    return newStr;
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
module.exports = router;
