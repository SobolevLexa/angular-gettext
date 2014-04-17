angular.module('gettext').filter('translate', function (gettextCatalog, $interpolate, $parse) {
    return function (input, params) {
        if(angular.isObject(params)){
            return $interpolate(gettextCatalog.getString(input))(params);
        }
        return gettextCatalog.getString(input);

    };
});
