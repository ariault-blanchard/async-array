var AsyncArray = require('./')

var items = new AsyncArray([1, 2, 'three', 4])

items
  .map(function (item, i, next) {
    setTimeout(next, 1000, null, 'did ' + i)
  })
  .done(function (error, results) {
    console.log('map', results)
  })
  .exec()

items
  .mapSerial(function (item, i, next) {
    setTimeout(next, 1000, null, 'did ' + i)
  })
  .done(function (error, results) {
    console.log('mapSerial', results, results.length)
  })
  .exec()

items
  .filter(function (item, i, next) {
    setTimeout(function () {
      if ('string' === typeof item) {
        return next()
      }
      next(null, true)
    }, 1000)
  }) 
  .exec(function (error, results) {
    console.log('filter', results)
  })

items
  .forEachSerial(function (item, i, next) {
    setTimeout(function () {
      console.log('forEachSerial', i, item)
      next()
    }, 1000)
  })
  .exec()

items
  .map(function (item, i, next) {
    if ('string' === typeof item) {
      return next(new Error('stupid'))
    }
    next(null, item)
  })
  .exec(function (error) {
    console.log('error', error)
  })

items
  .filter(function (item, i, next) {
    if ('string' === typeof item) {
      return next()
    }
    next(null, true)
  })
  .done(function (error, results) {
    console.log('chain filter', results)
  })
  .map(function (item, i, next) {
    next(null, 'item ' + i + ': ' + item)
  })
  .exec(function (error, results) {
    console.log('chain map', results)
    results.array()
    console.log('normal array', 'undefined' === typeof results.array)
  })

var op = new AsyncArray.Operation;
op.forEachSerial(function foreach (item, i, next) {
  console.log('forEachSaved', i)
  next()
})
op = op.save()

op([1, 2, 3], function (err) {
  console.log('forEachSaved', 'done')
})
