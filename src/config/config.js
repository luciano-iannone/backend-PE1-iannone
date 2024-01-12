const { connect } = require('mongoose')

exports.connectDb = async () => {
    await connect('mongodb+srv://LuchoIannone:artGpM6vklS6nevJ@cluster0.bmytq5v.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log("Db connected")
}