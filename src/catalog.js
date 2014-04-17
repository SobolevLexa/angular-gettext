angular.module('gettext').factory('gettextCatalog', ['gettextPlurals', '$interpolate', function (gettextPlurals, $interpolate, $http, $cacheFactory) {
    var catalog;

    var prefixDebug = function (string) {
        if (catalog.debug && catalog.currentLanguage !== catalog.baseLanguage) {
            return "[MISSING]: " + string;
        } else {
            return string;
        }
    };

    catalog = {
        debug: false,
        strings: {},
        baseLanguage: 'en',
        currentLanguage: 'en',
        cache: $cacheFactory('strings'),

        setStrings: function (language, strings) {
            var key, val, _results;
            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            for (key in strings) {
                val = strings[key];
                if (typeof val === 'string') {
                    this.strings[language][key] = [val];
                } else {
                    this.strings[language][key] = val;
                }
            }
        },

        getStringForm: function (string, n, dataObject) {
            var stringTable = this.strings[this.currentLanguage] || {};
            var plurals = stringTable[string] || [];
            return plurals[n];
        },

        getString: function (string, dataObject) {
            var text = this.getStringForm(string, 0, dataObject) || prefixDebug(string);
            if (angular.isObject(dataObject)) {
                return $interpolate(text)(dataObject);
            }
            return text;
        },

        getPlural: function (n, string, stringPlural, dataObject) {
            var form = gettextPlurals(this.currentLanguage, n),
                text = this.getStringForm(string, form, dataObject) || prefixDebug((n === 1 ? string : stringPlural));
            if (angular.isObject(dataObject)) {
                return $interpolate(text)(dataObject);
            }
            return text;
        },

        loadRemote: function (url) {
            return $http({
                method: 'GET',
                url: url,
                cache: catalog.cache
            }).success(function (data) {
                for (var lang in data) {
                    catalog.setStrings(lang, data[lang]);
                }
            });
        }
    };

    return catalog;
}]);
