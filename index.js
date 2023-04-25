const storage = require('./src/Storage.js');
const GoogleCloudStorage = require('./src/GoogleCloudStorage.js');
const AmazonS3Storage = require('./src/AmazonS3Storage.js');

module.exports = {
    Storage: storage,
    GoogleProvider: GoogleCloudStorage,
    AmazonS3Storage: AmazonS3Storage
}