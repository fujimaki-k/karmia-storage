# karmia-storage
Storage module of Karmia JavaScript library

## Installation
```Shell
npm install karmia-storage
```

## Example
```JavaScript
const karmia_storage = require('karmia-storage');
```

### Memory
#### constructor(options)
```JavaScript
const storage = karmia_storage.memory({size: 100000});
```
##### Options
- size: Max items of buffer (Default: 10000)
- infinite: if true buffer size set to unlimited (Default: false)

#### Promise store(key, value)
Store new value.
```JavaScript
storage.store(key, value);
```

#### Promise count()
Count values in buffer.
```JavaScript
storage.count();
```

#### Promise has(key)
Check is key exists in buffer.
```JavaScript
storage.has(key);
```

#### Promise set(key)
Update existing value
```JavaScript
storage.set(key, value);
```

#### Promise get(key, default_value = undefined)
Get value
```JavaScript
// Default value is undefined
storage.get(key);

// Default value is 'default_value'
storage.get(key, 'default_value');
```
