class Exception extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode;
    this.name = "InternalServerError"; 
  }

  toString(){
    return('Code: ' + this.statusCode + '-' + this.name +'  Message: ' + this.message)
  }

  toDto(){
    return {
      "statusCode": this.statusCode,
      "error": this.name ,
      "message": this.message
    }
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

class InternalServerError extends Exception {
  constructor(message) {
    super(message, 500); 
    this.name = "InternalServerError";
  }
}

Exceptions = {
  Exception,
  Error,
  BadRequest,
  NotFound
}

module.exports = Exceptions