# Cloud Storage Client for NodeJS


| Supported Services: |
| ----------- |
| Google Cloud Storage | 
| ***More to come...   | 

## Features

- Uploading File
- Deleting File
- Retrieving File
- Retrieve as JSON
- Check if File exists
- Check if File is missing
- Retrieve Public URL
- Download File from Cloud

---

## Installation

Run:
`
npm install @akmyradov/cloudstorage multer
`

Example:

```javascript
import { Storage, GoogleProvider} from '@akmyradov/cloudstorage';

let storage = new Storage(new GoogleProvider(
    'project-id',
    'bucket-name',
    'path/to/service-account.json',
    'destination-path'
));
```

To upload a file (You have to pass 'req' from express):
```javascript
storage.put('save-file-name', req.file).then(file => {
    console.log(file.publicUrl());
};
```

Delete file:
```javascript
storage.delete('file-name').then(response => {
    console.log('deleted');
}).catch(error => {
    console.log(error)
});
```

Read File Contents:
```javascript
storage.get('file.txt').then(contents => {
    console.log(contents);
}).catch(error => {
    console.log(error);
});
```

Retrieve File Contents as JSON:
```javascript
storage.json('file.json').then(data => {
    console.log(data);
}).catch(error => {
    console.log(error);
});
```

Check if File exists:
```javascript
storage.exists('file-name').then(response => {
    console.log(response);
})
```

Check if File is missing:
```javascript
storage.missing('file-name').then(response => {
    console.log(response);
})
```

Retrieve File URL:
```javascript
storage.url('file-name').then(url => {
    console.log(url);
}).catch(error => {
    console.log(error);
})
```

Download File:
```javascript
storage.download('file-name').then(file => {
   file.pipe(res.attachment('file-name'));
}).catch(error => {
    console.log(error);
});
```

---
# Contact
Reach out at azat@akmyradov.me