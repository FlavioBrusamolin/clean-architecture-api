import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../../protocols/email-validator'
import { Authentication } from '../../../domain/use-cases/authentication'

export class LoginController implements Controller {
  public constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication) {
  }

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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

      await this.authentication.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
