module.exports = {
    devServer: {
        proxy: {
            '/user': {
                // target: 'http://192.168.63.128:2020',
                target: 'http://localhost:2020',
                changeOrigin: true
            }
        }
    }
}