class Exception extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode;
    this.name = "InternalServerError"; 
  }

  toString(){
    return('Code: ' + this.statusCode + '-' + this.name +'  Message: ' + this.message)
  }
}

class BadRequest extends Exception {
  constructor(message) {
    super(message, 400); 
    this.name = "BadRequest";
  }
}

class NotFound extends Exception {
  constructor(message) {
    super(message, 404); 
    this.name = "NotFound";
  }
}

Exceptions = {
  Error,
  BadRequest,
  NotFound
}

module.exports = Exceptions