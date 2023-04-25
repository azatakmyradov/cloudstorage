const {Storage} = require('@google-cloud/storage');
const request = require('request');

class GoogleCloudStorage {
    constructor(projectId, bucketName, keyFileName, destination) {
        this.storage = new Storage({
            projectId: projectId,
            keyFilename: keyFileName
        });

        this.bucket = this.storage.bucket(bucketName);
        this.destination = destination.endsWith('/') ? destination : destination + '/';
    }

    put(name, contents) {
        return new Promise((resolve, reject) => {
            const { buffer } = contents;

            const file = this.bucket.file(this.destination + name);
            const stream = file.createWriteStream();

            stream.on('finish', () => {
                resolve(file);
            });

            stream.on('error', (err) => {
                reject(err);
            });

            stream.end(buffer);
        })
    }

    delete(name) {
        return this.bucket.file(this.destination + name).delete();
    }

    get(name) {
        return new Promise((resolve, reject) => {
            const file = this.bucket.file(this.destination + name).createReadStream();
            let contents = '';
            file.on('data', c => {
                contents += c;
            }).on('end', () => {
                resolve(contents);
            }).on('error', error => {
                reject(error);
            });
        })
    }

    json(name) {
        return new Promise((resolve, reject) => {
            this.get(name).then(contents => {
                try {
                    const json = JSON.parse(contents);
                    resolve(json);
                } catch (error) {
                    reject(error);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    exists(name) {
        return new Promise((resolve, reject) => {
            this.bucket.file(this.destination + name).exists(this.storage).then(response => {
                resolve(response[0]);
            }).catch(error => {
                reject(error);
            });
        });
    }

    missing(name) {
        return new Promise((resolve, reject) => {
            this.exists(name).then(exists => {
                resolve(! exists);
            }).catch(error => {
                reject(error);
            });
        });
    }

    url(name) {
        return new Promise((resolve, reject) => {
            this.exists(name).then(exists => {
                if (! exists) {
                    reject(exists);
                } else {
                    let url = this.bucket.file(this.destination + name).publicUrl();
                    resolve(url);
                }
            }).catch(error => {
                reject(error);
            });
        })
    }

    download(name) {
        return new Promise((resolve, reject) => {
            this.exists(name).then(exists => {
                console.log(exists)
                if (! exists) {
                    reject({
                        message: "file doesn't exist"
                    });
                } else {
                    let url = this.bucket.file(this.destination + name).publicUrl();
                    resolve(request.get(url));
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = GoogleCloudStorage;