class Storage {
    constructor(cloud_storage) {
        this.storage = cloud_storage;
    }

    put(name, contents) {
        return this.storage.put(name, contents);
    }

    delete(name) {
        return this.storage.delete(name);
    }

    get(name) {
        return this.storage.get(name);
    }

    json(name) {
        return this.storage.json(name);
    }

    exists(name) {
        return this.storage.exists(name);
    }

    missing(name) {
        return this.storage.missing(name);
    }

    url(name) {
        return this.storage.url(name);
    }

    download(name) {
        return this.storage.download(name);
    }
}

module.exports = Storage;