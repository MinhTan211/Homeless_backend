module.exports = {
    multipleMogooseToOject: (mongooseArray) => { 
        return mongooseArray.map(mogoose => mogoose.toObject());
    },
    mogooseToOject: (mongoose) => { 
        return mongoose ? mongoose.toObject() : mongoose
    }
}