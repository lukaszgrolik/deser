// @todo throw if config.serialize or config.deserialize contain field from config.fields
// @todo should not copy non-listed fields
// @todo feat - copy keys with null values
// @todo test mapping array of docs

let should = require('should');

let deser = require('../index');

let mapper1 = deser({
  fields: {
    eventId: 'id_event',
  },
  deserialize: function(doc) {
    return {
      items: doc.items.map(function(item) {
        return {val: item};
      }),
    };
  },
  serialize: function(doc) {
    return {
      items: doc.items.map(function(item) {
        return item.val;
      }),
    };
  },
});

describe('example 1', () => {

  it('should serialize', () => {
    let doc = mapper1.serialize({
      eventId: 55,
      items: [
        {val: 1},
        {val: 2},
      ],
    });

    doc.should.have.property('event_id', 55);
    doc.should.have.property('items');
    doc.items.should.be.instanceof(Array).and.have.lengthOf(2);
    doc.items[0].should.equal(1);
    doc.items[1].should.equal(2);
  });

  it('should deserialize', () => {
    let doc = mapper1.deserialize({
      id_event: 123,
      items: ['a', 'b', 'c'],
    });

    doc.should.have.property('eventId', 123);
    doc.should.have.property('items');
    doc.items.should.be.instanceof(Array).and.have.lengthOf(3);
    doc.items[0].should.have.property('val', 'a');
    doc.items[1].should.have.property('val', 'b');
    doc.items[2].should.have.property('val', 'c');
  });

});

let mapper2 = deser({
  deserialize: function(doc) {
    return {
      id: doc.Description.Id,
      title: doc.Description.Title,
      price: doc.Price.Last,
      currency: doc.Price.Currency,
    };
  },
  serialize: function(doc) {
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

describe('example 2', () => {

  it('should deserialize', () => {
    let doc = mapper2.deserialize({
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
  });

  it('should serialize', () => {
    let doc = mapper2.serialize({
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
  });

});