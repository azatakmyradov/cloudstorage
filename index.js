const storage = require('./Storage.js');
const GoogleCloudStorage = require('./GoogleCloudStorage.js');
const AmazonS3Storage = require('./AmazonS3Storage.js');

module.exports = {
    Storage: storage,
    GoogleProvider: GoogleCloudStorage,
    AmazonS3Storage: AmazonS3Storage
}