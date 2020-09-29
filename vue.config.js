module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.63.128:2020',
                // target: 'http://localhost:2020',
                changeOrigin: true,
                pathRewrite:{
                    '^/api': '',
                }
            }
        }
    }
}