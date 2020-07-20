import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  public constructor (private readonly emailValidator: EmailValidator) {
  }

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!password) {
      return badRequest(new MissingParamError('password'))
    }

    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
