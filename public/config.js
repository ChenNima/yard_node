/**
 * Created by Fan on 2016/6/18.
 */
requirejs.config({
    baseUrl: '/',
    paths: {
        app: '/dist/js_d'
    },
    shim: {
    }
});
requirejs(['app'], function(app) {

});