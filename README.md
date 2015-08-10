# deser

Data (de)serialization

## Example

```js
var mapper = deser({
  fields: {
    // key - prop name after deserialization,
    // value - prop name after serialization
    eventId: 'id_event',
    fooBar: 'foo_bar',
  },
  deserialize: function(doc) {
    return {
      items: doc.things.map(function(thing) {
        return {val: thing};
      }),
    };
  },
  serialize: function(doc) {
    return {
      things: doc.items.map(function(item) {
        return item.val;
      }),
    };
  };
});

mapper.deserialize({
  id_event: 123,
  foo_bar: 'baz',
  things: ['a', 'b', 'c'],
});
// => {
//   eventId: 123,
//   fooBar: 'baz',
//   items: [
//     {val: 'a'},
//     {val: 'b'},
//     {val: 'c'},
//   ],
// }

mapper.serialize({
  eventId: 55,
  fooBar: 'baz',
  items: [
    {val: 1},
    {val: 2},
  ],
});
// => {
//   id_event: 55,
//   foo_bar: 'baz'
//   things: [1, 2],
// }
```
