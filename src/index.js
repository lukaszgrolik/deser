// @todo throw if config.serialize or config.deserialize contain field from config.fields

function deser(config) {
  return {
    serialize: serialize.bind(config),
    deserialize: deserialize.bind(config),
  }
};

module.exports = deser;

function serialize(data) {
  let result = handleData(data, serializeDoc);

  return result;
}

function serializeDoc(doc) {
  let result = {};

  for (let key in this.fields) {
    if (this.fields.hasOwnProperty(key)) {
      let val = this.fields[key];

      result[val] = doc[key];
    }
  }

  for (let key in this.deserialize(doc)) {
    if (this.deserialize.hasOwnProperty(key)) {
      let val = this.fields[key];

      result[key] = doc[key];
    }
  }

  return result;
}

function deserialize(data) {
  let result = handleData(data, deserializeDoc);

  return result;
}

function deserializeDoc(doc) {
  let result = {};
  let props = {};

  extendObject(props, this.fields);
  extendObject(props, this.deserialize(doc));

  for (let key in props) {
    if (props.hasOwnProperty(key)) {
      let val = props[key];

      result[key] = doc[val];
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
    result = fn(data)
  } else {
    throw new Error('Bad argument: ', data);
  }

  return result;
}

function extendObject(obj1, obj2) {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key];
    }
  }
}