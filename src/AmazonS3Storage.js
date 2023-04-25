const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const request = require('request');

class AmazonS3Storage {
    constructor(region, bucketName, access_key, secretAccessKey, destination) {
        this.storage = new S3Client({
            region: region,
            credentials: {
                accessKeyId: access_key,
                secretAccessKey: secretAccessKey
            }
        });

        this.bucket = bucketName;
        this.destination = destination.endsWith('/') ? destination : destination + '/';
    }

    put(name, contents) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: this.bucket,
                Key: this.destination + name,
                Body: contents.buffer,
            };

            this.storage.send(new PutObjectCommand(params)).then((data) => {
                getSignedUrl(this.storage, new GetObjectCommand(params), {expiresIn: 300}).then(url => {
                    data.publicUrl = () => {
                        return url;
                    };
                    resolve(data);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    delete(name) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: this.bucket,
                Key: this.destination + name,
            };

            this.storage.send(new DeleteObjectCommand(params)).then((response) => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    get(name) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: this.bucket,
                Key: this.destination + name,
            };

            this.storage.send(new GetObjectCommand(params)).then((response) => {
                const streamToString = (stream) =>
                    new Promise((resolve, reject) => {
                        const chunks = [];
                        stream.on("data", (chunk) => chunks.push(chunk));
                        stream.on("error", reject);
                        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
                    });

                streamToString(response.Body).then(data => {
                    resolve(data);
                });
            }).catch(error => {
                reject(error);
            });
        });
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
            const params = {
                Bucket: this.bucket,
                Key: this.destination + name,
            };

            this.storage.send(new HeadObjectCommand(params)).then((response) => {
                resolve(true);
            }).catch(error => {
                if (error.$metadata.httpStatusCode === 404) resolve(false)
                else reject(error);
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
            const params = {
                Bucket: this.bucket,
                Key: this.destination + name,
            };

            getSignedUrl(this.storage, new GetObjectCommand(params), {expiresIn: 300}).then(url => {
                resolve(url);
            }).catch(error => reject(error));
        });
    }

    download(name) {
        return new Promise((resolve, reject) => {
            this.exists(name).then(exists => {
                if (! exists) {
                    reject({
                        message: "file doesn't exist"
                    });
                } else {
                    this.url(name).then(url => {
                        resolve(request.get(url));
                    }).catch(error => reject(error));
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = AmazonS3Storage;