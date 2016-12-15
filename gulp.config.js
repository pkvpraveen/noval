module.exports = function () {
    return {
        root: './',
        fonts:'./bower_components/font-awesome/fonts/*.*',
        build:'./build/',
        alljs: ['./js/**/*.js',
            './*.js'],
        index: './index.html',
        js: ['./js/**/*.js'],
        images:'./images/**/*.*',
        img:'./img/**/*.*',
        css:['./css/**/*.css'],
        getWiredepDefaultOptions: function () {
            return {
                bowerJson: require('./bower.json'),
                directory: './bower_components/',
                ignorePath: '../..'
            };
        }
    };
};
