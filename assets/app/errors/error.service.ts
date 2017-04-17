import { EventEmitter } from "@angular/core";

import { Error } from "./error.model";

export class ErrorService {
  errorOccurred = new EventEmitter<Error>();

  handleError(error: any) {
      const _errorData = new Error(error.title, error.error.message);
      this.errorOccurred.emit(_errorData);
  }
}
