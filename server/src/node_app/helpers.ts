import * as r from 'rethinkdb'
import { IVocab } from "../interfaces"

// helper method: creates UUIDs
export async function createUUID(name: string, connection: r.Connection): Promise<string> {
    let ID = ""
    try {
        ID = await r.uuid(name).run(connection)
    } catch (err) {
        console.log("couldn't createUUID", err)
    }
    return ID;
}

export const getVocab = async (uuid: string, connection: r.Connection): Promise<IVocab | never> => {
    let result = await r.db('a3').table('vocab_items').get(uuid).run(connection)
    if (!result) {
      throw new Error("invalid ID")
    } else {
      return result as IVocab
    }
}
