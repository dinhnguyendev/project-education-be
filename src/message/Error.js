const ERROR = {
  BATCHREQUEST: {
    statusCode: 400,
    message: "BatchRequest",
  },
  SERVER: {
    statusCode: 400,
    message: "ErrorServerSaveDatabase",
  },
  PHONENUMBEREXIT: {
    statusCode: 400,
    message: "PhoneNumberExit",
  },
  WRONGPASSWORD: {
    statusCode: 400,
    message: "WrongPassWorng",
  },
  TOKENISNOTVALUE: {
    statusCode: 403,
    message: "TokenIsNotValue",
  },
  TOKENERROR: {
    statusCode: 403,
    message: "TokenIsNotError",
  },
  PHONEISEXIST: {
    statusCode: 400,
    message: "PhoneIsExist",
  },
};
module.exports = ERROR;
