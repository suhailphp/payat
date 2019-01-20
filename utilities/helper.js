const dateformat = require('dateformat');
module.exports = {

    compare: function (lvalue, operator, rvalue, options) {

        var operators, result;

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }

        operators = {
            '==': function (l, r) {
                return l == r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l != r;
            },
            '!==': function (l, r) {
                return l !== r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            'typeof': function (l, r) {
                return typeof l == r;
            }
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }



    },

    dateToStringTime: function (date) {
        return date.toLocaleTimeString();
    },
    dateToStringDate: function (date) {

        if (!date || typeof date != 'object')
            return null;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var month_ar;
        switch (month) {
            case 1:
                month_ar = "Jan";
                break;
            case 2:
                month_ar = "Feb";
                break;
            case 3:
                month_ar = "Mar";
                break;
            case 4:
                month_ar = "Apr";
                break;
            case 5:
                month_ar = "May";
                break;
            case 6:
                month_ar = "Jun";
                break;
            case 7:
                month_ar = "Jul";
                break;
            case 8:
                month_ar = "Aug";
                break;
            case 9:
                month_ar = "Sep";
                break;
            case 10:
                month_ar = "Oct";
                break;
            case 11:
                month_ar = "Nov";
                break;
            case 12:
                month_ar = "Dec";
                break;
            default:
                month_ar = "";
                break;

        }
        var date_ar = month_ar + " " + day + ", " + year;
        return date_ar;

    },
    dateToChrome: function (date) {
        date = dateformat(date,"yyyy-mm-dd");
        return date;
    },
    dateToDMY: function (date) {
        date = dateformat(date,"dd-mm-yyyy");
        return date;
    },

    currencyFormat: function(amount){
        return (amount.toFixed(2))
    },

    currentDate : function(){
        let date = Date.now();
        date = dateformat(date,"yyyy-mm-dd");
        return date;
    }
}