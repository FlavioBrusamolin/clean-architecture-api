import { AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../../../data/protocols'
import { AddAccountModel } from '../../../../domain/use-cases/add-account'
import { Account } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  public async add (accountData: AddAccountModel): Promise<Account> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)
    const [accountRecord] = result.ops

    return MongoHelper.map(accountRecord)
  }

  public async loadByEmail (email: string): Promise<Account> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const accountRecord = await accountCollection.findOne({ email })

    return accountRecord && MongoHelper.map(accountRecord)
  }

  public async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.updateOne(
      { _id: id },
      { $set: { accessToken: token } }
    )
  }
}
