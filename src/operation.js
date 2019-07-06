const delayms = 1;

function getCurrentCity(callback) {
  setTimeout(function () {
    const city = "New York, NY";
    callback(null, city);

  }, delayms) 
}

function fetchWeather(city) {
  // I need to make it so it saves (caches) some callback handlers to run them later
  
  const operation = {
    onSuccess: function() {},
    onError: function() {},
    setCallbacks: function(successHandler, errorHandler) {
      this.onSuccess = successHandler;
      this.onError = errorHandler;
    }
  };

  getWeather(city, (error, city) => {
    if (error) {
      operation.onError(error);
      return;
    }
    operation.onSuccess(city);
  });

  return operation;
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
    onCompletion: function(onSuccess, onError) {
      this.successReactions.push(onSuccess || function() {});
      this.errorReactions.push(onError);
    },
    onFailure: function onFailure(onError) {
      this.onCompletion(null, onError);
    }
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

// Weather tests
test.only("fetches the weather", function(done) {
  const op = fetchWeather('Sandy');
  op.setCallbacks(weather => {
    console.log("hey here the weather: " + weather.temp);
  }, error => {
    console.log('yeah we done effed up');
  });
  done();  
});

test("gets the weather", function(done) {
  getWeather('Sandy', (error, weather) => {
    if (error) {
      console.log("There was a huge freaking error " + error);
      return;
    }
    console.log(weather);
  });

  done();
});

test("register only error handler, ignores success", function(done) {
  const operation = fetchCurrentCity();

  operation.onFailure(error => done(error));
  operation.onCompletion(result => done());  
});

test("register only success handler, ignores failure", function(done) {
  const operation = fetchCurrentCity();

  operation.onFailure(error => done());
  operation.onCompletion(result => done(new Error("shouldn't succeed")));  
});

test("fetchCurrentCity pass the callbacks later on", done => {
  const operation = fetchCurrentCity();
  operation.onCompletion(
    result => done(), 
    error => done(error));
});

test("pass multiple callbacks = all of them are called", done => {
  const operation = fetchCurrentCity();

  const multiDone = callDone(done).afterTwoCalls();
  
  operation.onCompletion(result => multiDone());
  operation.onCompletion(result => multiDone());
});


