angular.module('gettext').filter('translate', function (gettextCatalog, $interpolate, $parse) {
    return function (input, params) {
        return $interpolate(gettextCatalog.getString(input))(params);
    };
});
