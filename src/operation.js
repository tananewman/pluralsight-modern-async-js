const delayms = 1;

function getCurrentCity(callback) {
  setTimeout(function () {
    const city = "New York, NY";
    callback(null, city);

  }, delayms) 
}

function getWeather(city, callback) {
  setTimeout(function () {

    if (!city) {
      callback(new Error("City required to get weather"));
      return;
    }

    const weather = {
      temp: 50
    };

    callback(null, weather)

  }, delayms)
}

function getForecast(city, callback) {
  setTimeout(function () {

    if (!city) {
      callback(new Error("City required to get forecast"));
      return;
    }

    const fiveDay = {
      fiveDay: [60, 70, 80, 45, 50]
    };

    callback(null, fiveDay)

  }, delayms)
}

function fetchCurrentCity() {
  const operation = {
    successReactions: [],
    errorReactions: [],
    setCallbacks: function (onSuccess, onError) {
      this.successReactions.push(onSuccess);
      this.errorReactions.push(onError);
    },
  };

  getCurrentCity(function(error, result) {
    if (error) {
      operation.errorReactions.forEach(reaction => reaction(error));
      return;
    }
    operation.successReactions.forEach(success => success(result));
  });

  return operation;
}

suite.only("operations");

test("fetchCurrentCity pass the callbacks later on", done => {
  const operation = fetchCurrentCity();
  operation.setCallbacks(
    result => done(), 
    error => done(error));
});

test("pass multiple callbacks = all of them are called", done => {
  const operation = fetchCurrentCity();

  const multiDone = callDone(done).afterTwoCalls();
  
  operation.setCallbacks(result => multiDone());
  operation.setCallbacks(result => multiDone());
});


