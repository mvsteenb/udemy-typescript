let userInput: unknown;
let userName: string;
userInput = 5;
userInput = 'Mario';
if (typeof userInput === 'string') {
  userName = userInput;
}

function generateError(message: string, code: number): never {
  throw {message: message, errorCode: code};
}
generateError('An error has occured', 500);