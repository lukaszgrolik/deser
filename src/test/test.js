let should = require('should');
let commander = require('commander');

commander
.option('-e, --env [type]', 'Environment')
.parse(process.argv);

let deserPath = '../deser' + (commander.env === 'prod' ? '.min' : '');

// console.log('commander.env', commander.env)
// console.log('deserPath', deserPath);

let deser = require(deserPath);

describe('fields only', () => {

  let mapper = deser({
    fields: {
      eventId: 'id_event',
      bar: 'BAR',
      baz: 'BAZ',
    },
  });

  it('should serialize', () => {
    let doc = mapper.serialize({
      eventId: 55,
      foo: 'abc',
      bar: null,
      baz: undefined,
    });

    doc.should.have.property('id_event', 55);
    doc.should.not.have.property('foo');
    doc.should.not.have.property('FOO');
    doc.should.have.property('BAR', null);
    doc.should.not.have.property('BAZ');
    Object.keys(doc).length.should.equal(2);
  });

  it('should deserialize', () => {
    let doc = mapper.deserialize({
      id_event: 123,
      FOO: 'xyz',
      BAR: null,
      BAZ: undefined,
    });

    doc.should.have.property('eventId', 123);
    doc.should.not.have.property('FOO');
    doc.should.not.have.property('foo');
    doc.should.have.property('bar', null);
    doc.should.not.have.property('baz');
    Object.keys(doc).length.should.equal(2);
  });

});

describe('(de)serialize only', () => {

  let mapper = deser({
    deserialize(doc) {
      return {
        items: doc.things.map(function(thing) {
          return {val: thing};
        }),
      };
    },
    serialize(doc) {
      return {
        things: doc.items.map(function(item) {
          return item.val;
        }),
      };
    },
  });

  it('should serialize', () => {
    let doc = mapper.serialize({
      items: [
        {val: 1},
        {val: 2},
      ],
    });

    doc.should.have.property('things');
    doc.should.not.have.property('items');
    Object.keys(doc).length.should.equal(1);
    doc.things.should.be.instanceof(Array).and.have.lengthOf(2);
    doc.things[0].should.equal(1);
    doc.things[1].should.equal(2);
  });

  it('should deserialize', () => {
    let doc = mapper.deserialize({
      things: ['a', 'b', 'c'],
    });

    doc.should.have.property('items');
    doc.should.not.have.property('things');
    Object.keys(doc).length.should.equal(1);
    doc.items.should.be.instanceof(Array).and.have.lengthOf(3);
    doc.items[0].should.have.property('val', 'a');
    doc.items[1].should.have.property('val', 'b');
    doc.items[2].should.have.property('val', 'c');
  });

});

describe('with fields & (de)serialize', () => {

  let mapper = deser({
    fields: {
      eventId: 'id_event',
      bar: 'BAR',
      baz: 'BAZ',
    },
    deserialize(doc) {
      return {
        items: doc.things.map(function(thing) {
          return {val: thing};
        }),
        abc: doc.ABC,
      };
    },
    serialize(doc) {
      return {
        things: doc.items.map(function(item) {
          return item.val;
        }),
        ABC: doc.abc,
      };
    },
  });

  it('should serialize', () => {
    let doc = mapper.serialize({
      eventId: 55,
      foo: 'abc',
      bar: null,
      baz: undefined,
      items: [
        {val: 1},
        {val: 2},
      ],
      abc: undefined,
    });

    doc.should.have.property('id_event', 55);
    doc.should.not.have.property('foo');
    doc.should.not.have.property('FOO');
    doc.should.have.property('BAR', null);
    doc.should.have.not.property('BAZ');
    doc.should.have.property('things');
    doc.should.not.have.property('items');
    doc.should.not.have.property('ABC');
    Object.keys(doc).length.should.equal(3);
    doc.things.should.be.instanceof(Array).and.have.lengthOf(2);
    doc.things[0].should.equal(1);
    doc.things[1].should.equal(2);
  });

  it('should deserialize', () => {
    let doc = mapper.deserialize({
      id_event: 123,
      FOO: 'xyz',
      BAR: null,
      BAZ: undefined,
      things: ['a', 'b', 'c'],
      ABC: undefined,
    });

    doc.should.have.property('eventId', 123);
    doc.should.not.have.property('FOO');
    doc.should.not.have.property('foo');
    doc.should.have.property('bar', null);
    doc.should.not.have.property('baz');
    doc.should.have.property('items');
    doc.should.not.have.property('things');
    doc.should.not.have.property('abc');
    Object.keys(doc).length.should.equal(3);
    doc.items.should.be.instanceof(Array).and.have.lengthOf(3);
    doc.items[0].should.have.property('val', 'a');
    doc.items[1].should.have.property('val', 'b');
    doc.items[2].should.have.property('val', 'c');
  });

});

describe('nested object', () => {

  let mapper = deser({
    deserialize(doc) {
      return {
        id: doc.Description.Id,
        title: doc.Description.Title,
        price: doc.Price.Last,
        currency: doc.Price.Currency,
      };
    },
    serialize(doc) {
      return {
        Description: {
          Id: doc.id,
          Title: doc.title,
        },
        Price: {
          Last: doc.price,
          Currency: doc.currency,
        },
      };
    },
  });

  it('should deserialize', () => {
    let doc = mapper.deserialize({
      Description: {
        Id: 1,
        Title: 'ProductX',
      },
      Price: {
        Last: 12,
        Currency: 3,
      },
    });

    doc.should.have.property('id', 1);
    doc.should.have.property('title', 'ProductX');
    doc.should.have.property('price', 12);
    doc.should.have.property('currency', 3);
    Object.keys(doc).length.should.equal(4);
  });

  it('should serialize', () => {
    let doc = mapper.serialize({
      id: 1,
      title: 'ProductX',
      price: 12,
      currency: 3,
    });

    doc.should.have.property('Description');
    doc.Description.should.have.property('Id', 1);
    doc.Description.should.have.property('Title', 'ProductX');
    doc.should.have.property('Price');
    doc.Price.should.have.property('Last', 12);
    doc.Price.should.have.property('Currency', 3);
    Object.keys(doc).length.should.equal(2);
    Object.keys(doc.Description).length.should.equal(2);
    Object.keys(doc.Price).length.should.equal(2);
  });

});

describe('array of objects', () => {

  let mapper = deser({
    fields: {
      eventId: 'id_event',
    },
    deserialize(doc) {
      return {
        items: doc.items.map(function(item) {
          return {val: item};
        }),
      };
    },
    serialize(doc) {
      return {
        items: doc.items.map(function(item) {
          return item.val;
        }),
      };
    },
  });

  it('should serialize', () => {
    let obj = {
      eventId: 55,
      items: [
        {val: 1},
        {val: 2},
      ],
    };
    let docs = mapper.serialize([obj, obj, obj]);

    docs.should.be.instanceof(Array).and.have.lengthOf(3);

    docs[0].should.have.property('id_event', 55);
    docs[0].should.have.property('items');
    docs[0].items.should.be.instanceof(Array).and.have.lengthOf(2);
    docs[0].items[0].should.equal(1);
    docs[0].items[1].should.equal(2);

    docs[1].should.have.property('id_event', 55);
    docs[1].should.have.property('items');
    docs[1].items.should.be.instanceof(Array).and.have.lengthOf(2);
    docs[1].items[0].should.equal(1);
    docs[1].items[1].should.equal(2);

    docs[2].should.have.property('id_event', 55);
    docs[2].should.have.property('items');
    docs[2].items.should.be.instanceof(Array).and.have.lengthOf(2);
    docs[2].items[0].should.equal(1);
    docs[2].items[1].should.equal(2);
  });

  it('should deserialize', () => {
    let obj = {
      id_event: 123,
      items: ['a', 'b', 'c'],
    };
    let docs = mapper.deserialize([obj, obj, obj]);

    docs.should.be.instanceof(Array).and.have.lengthOf(3);

    docs[0].should.have.property('eventId', 123);
    docs[0].should.have.property('items');
    docs[0].items.should.be.instanceof(Array).and.have.lengthOf(3);
    docs[0].items[0].should.have.property('val', 'a');
    docs[0].items[1].should.have.property('val', 'b');
    docs[0].items[2].should.have.property('val', 'c');

    docs[1].should.have.property('eventId', 123);
    docs[1].should.have.property('items');
    docs[1].items.should.be.instanceof(Array).and.have.lengthOf(3);
    docs[1].items[0].should.have.property('val', 'a');
    docs[1].items[1].should.have.property('val', 'b');
    docs[1].items[2].should.have.property('val', 'c');

    docs[2].should.have.property('eventId', 123);
    docs[2].should.have.property('items');
    docs[2].items.should.be.instanceof(Array).and.have.lengthOf(3);
    docs[2].items[0].should.have.property('val', 'a');
    docs[2].items[1].should.have.property('val', 'b');
    docs[2].items[2].should.have.property('val', 'c');
  });

});