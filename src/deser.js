function deser(config) {
  return {
    serialize: serialize.bind(config),
    deserialize: deserialize.bind(config),
  }
}

function serialize(data) {
  let result = handleData(data, serializeDoc.bind(this));

  return result;
}

function serializeDoc(doc) {
  let result = {};

  for (let key in this.fields) {
    if (this.fields.hasOwnProperty(key)) {
      let val = this.fields[key];

      if (doc[key] !== undefined) {
        result[val] = doc[key];
      }
    }
  }

  if (typeof this.serialize === 'function') {
    let serializedDoc = this.serialize(doc);

    for (let key in serializedDoc) {
      if (serializedDoc.hasOwnProperty(key)) {
        let val = serializedDoc[key];

        if (val !== undefined) {
          result[key] = val;
        }
      }
    }
  }

  return result;
}

function deserialize(data) {
  let result = handleData(data, deserializeDoc.bind(this));

  return result;
}

function deserializeDoc(doc) {
  let result = {};

  for (let key in this.fields) {
    if (this.fields.hasOwnProperty(key)) {
      let val = this.fields[key];

      if (doc[val] !== undefined) {
        result[key] = doc[val];
      }
    }
  }

  if (typeof this.deserialize === 'function') {
    let deserializedDoc = this.deserialize(doc);

    for (let key in deserializedDoc) {
      if (deserializedDoc.hasOwnProperty(key)) {
        let val = deserializedDoc[key];

        if (val !== undefined) {
          result[key] = val;
        }
      }
    }
  }

  return result;
}

function handleData(data, fn) {
  let result = null;

  // array of docs
  if (data && data instanceof Array) {
    result = data.map((doc) => {
      return fn(doc);
    });
  // single doc
  } else if (typeof data === 'object') {
    result = fn(data);
  } else {
    throw new Error('Bad argument: ', data);
  }

  return result;
}