import express from 'express'
import * as r from 'rethinkdb'
import multer from 'multer'
import { join } from 'path'
import { ICollection, ICollection_lw, IVocab, IUser, ELanguage } from "./interfaces"
import cors from 'cors'

// only because items are stored in DB as string[] and not IVocab[]
interface ICollectionAlt {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly lang: ELanguage;
  readonly author: IUser;
  items: string[] | IVocab[];
}

const port = 4000
const app = express()
const upload = multer()

// SOURCE: Stack overflow...(for resolving the XHTML CORS error.)
const corsOptions = {
  origin: '*',
  credentials: true,            // access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(express.static(join(__dirname, "..", "..", "build")))
app.use(express.json())

const fields = [
  {
    name: "image",
    maxCount: 1
  },
  {
    name: "pronunciation",
    maxCount: 1
  }
]

// helper method: creates UUIDs
async function createUUID(name: string): Promise<string> {
  let ID = ""
  try {
    ID = await r.uuid(name).run(connection)
  } catch (err) {
    console.log("couldn't createUUID", err)
  }
  // await r.uuid(name).run(connection, (err, res) => {
  //   if (err) {
  //     console.log('Error creating UUID on: ' + name);
  //     throw err;
  //   } else {
  //     ID = res as string;
  //   }
  // })
  return ID;
}

app.on("ready", () => {
  // Available API Requests:
  // NOTE: create a3 database & vocab_items table, collections table in RDB dashboard first. (use helper API calls listed at the end!)
  // NOTE: We're using primary key (UUID) to retreive row entries...

  // [POST] New CloudItem (Sound/Image)
  // NOTE: separated from vocab_item for convenice, this can later merge with that method.
  app.post("/insert_cloud_item", upload.fields(fields), async (req, res) => {
    let uuidName: string = req.body.value // name of vocab_item
    // multer files...(undefined in interface, will store in its own 'cloud_items' table.)
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const newCloudItem = {
      // multer attributes...
      id: await createUUID(uuidName), // CREATE UUID (same as vocab_item)
      image: {
        mimetype: files?.image[0].mimetype,
        buffer: files?.image[0].buffer,
        originalname: files?.image[0].originalname
      },
      image_desc: req.body.imageDesc,
      pronunciation: {
        mimetype: files?.pronunciation[0].mimetype,
        buffer: files?.pronunciation[0].buffer,
        originalname: files?.pronunciation[0].originalname
      }
    }

    // rdb command
    let result: r.WriteResult
    try {
      result = await r.db('a3').table('cloud_items').insert(newCloudItem).run(connection)
      console.log("Successfully inserted cloud_items! Sending cloud item to frontend...", result)
      console.log("newCloudItem HERE: ", newCloudItem); // data shows rdb return attributes, not the new object.
      res.send(newCloudItem) // send back cloud_items to frontend, so it can be added to list for collection.
    } catch (err) {
      console.log("failed /insert_cloud_item", err)
      res.send("failed!")
    }


    // r.db('a3').table('cloud_items').insert(newCloudItem).run(connection, (err, data) => {
    //   if (err) {
    //     console.log("Failed...")
    //     throw err;
    //   } else {
    //     console.log("Successfully inserted cloud_items! Sending cloud item to frontend...", data)
    //     console.log("newCloudItem HERE: ", newCloudItem); // data shows rdb return attributes, not the new object.
    //     res.send(newCloudItem) // send back cloud_items to frontend, so it can be added to list for collection.
    //   }
    // });
  })

  // [POST] New VocabItem
  app.post("/insert_vocab_item", async (req, res) => {
    // This data matches IVocab interface...
    console.log(req.body)
    let uuidName: string = req.body.value // name of vocab_item
    const newVocabItem: IVocab = {
      id: await createUUID(uuidName), // CREATE UUID
      lang: req.body.lang,
      translation: req.body.translation,
      value: req.body.value,
      s3Key: req.body.s3Key
    }

    // rdb command
    let result: r.WriteResult
    try {
      result = await r.db('a3').table('vocab_items').insert(newVocabItem).run(connection)
      console.log("Successfully inserted vocab_item! Sending vocab item to frontend...", result)
      console.log("newVocabItem HERE: ", newVocabItem); // data shows rdb return attributes, not the new object.
      res.send(newVocabItem) // send back vocab_item to frontend, so it can be added to list for collection.
    } catch (err) {
      console.log("Failed...", err)
    }

    // r.db('a3').table('vocab_items').insert(newVocabItem).run(connection, (err, data) => {
    //   if (err) {
    //     console.log("Failed...")
    //     throw err;
    //   } else {
    //     console.log("Successfully inserted vocab_item! Sending vocab item to frontend...", data)
    //     console.log("newVocabItem HERE: ", newVocabItem); // data shows rdb return attributes, not the new object.
    //     res.send(newVocabItem) // send back vocab_item to frontend, so it can be added to list for collection.
    //   }
    // });
  })

  // [POST] New Collection
  app.post("/insert_collection", async (req, res) => {
    let items: IVocab[] = req.body.items
    let vi_items_list = items.map(item => item.id)
    console.log(vi_items_list)
    let uuidName: string = req.body.name // name of collection
    const newCollectionItem: ICollectionAlt = {
      id: await createUUID(uuidName), // CREATE UUID
      author: req.body.author,
      description: req.body.description,
      items: vi_items_list, // vocab_items list for this collection
      lang: req.body.lang,
      name: req.body.name
    }

    // rdb command
    let result: r.WriteResult
    try {
      result = await r.db('a3').table('collections').insert(newCollectionItem).run(connection)
      console.log("Successfully inserted collections item!", result)
      res.send("Success!")
    } catch (err) {
      console.log("Failed /insert_collection", err)
    }

    // OLD
    // r.db('a3').table('collections').insert(newCollectionItem).run(connection, (err, data) => {
    //   if (err) {
    //     console.log("Failed...")
    //     throw err;
    //   } else {
    //     console.log("Successfully inserted collections item!", data)
    //     res.send("Success!");
    //   }
    // });
  })

  // [UPDATE] Existing Collection or Vocab_Item
  app.put("/update/:tableName/:uuid", async (req, res) => {
    // query for the correct element row by UUID, then update.
    let { uuid } = req.params // UUID identifier...
    let { tableName } = req.params  // "collections" or "vocab_items"
    // For attribute: send in params like {"value": "newVal", "lang": "newlang"} comma-spaced k,v pair.
    // SOURCE: https://rethinkdb.com/api/javascript/update
    // console.log(req.body)
    let attribute: Record<string, unknown>
    if (tableName === "collections") {
      let items = req.body.items as IVocab[]
      attribute = { items: items.map(item => item.id) }// get all attributes from request
    }
    if (tableName === "vocab_items") {
      attribute = req.body
    }
    // rdb command
    let result: r.WriteResult
    try {
      result = await r.db('a3').table(tableName).get(uuid).update(attribute!).run(connection)
      console.log(result)
      res.send({
        message: "Success!",
        id: uuid
      })
    } catch (err) {
      console.log("update failed:", err)
      res.send("failed to update item/collection")
    }

    // OLD
    // r.db('a3').table(tableName).get(uuid).update(attribute).run(connection, (err, data) => {
    //   if (err) {
    //     console.log("Failed...")
    //     throw err
    //   } else {
    //     console.log("Successfully updated item!", data)
    //     res.send("Success!")
    //   }
    // })
  })

  // [DELETE] Existing Collection or Vocab_Item
  app.delete("/delete/:tableName/:uuid", async (req, res) => {
    // query for the correct element row by UUID, then delete.
    let { uuid } = req.params // UUID identifier...
    let { tableName } = req.params // "collections" or "vocab_items"

    // rdb command
    let result: r.WriteResult
    try {
      result = await r.db('a3').table(tableName).get(uuid).delete().run(connection)
      console.log("Successfully deleted item!", result)
      res.send(result)
    } catch (err) {
      console.log("Failed...")
      res.send("failed to delete!")
    }
    // r.db('a3').table(tableName).get(uuid).delete().run(connection, (err, data) => {
    //   if (err) {
    //     console.log("Failed...")
    //     throw err
    //   } else {
    //     console.log("Successfully deleted item!", data)
    //     res.send(data)
    //   }
    // })
  })

  // [GET] Get All Collections
  app.get("/get_all_collections", async (req, res) => {
    console.log("IN GET ALL COLL")
    // rdb command
    const p = await r.db('a3').table('collections').run(connection) // get all collection entries
    // console.log(p)
    const results: any = await p.toArray()
    console.log(results)
    for (const col of results) {
      const fullItems: IVocab[] = await Promise.all(col.items.map(async (id: string) => {
        // console.log({ id })
        const result = await getVocab(id as string)
        return result
      }))
      col.items = fullItems
    }

    // OLD
    // const fullVocab = await Promise.all(results.items)
    // const data = await p.then(async (curs: r.Cursor) => {
    //   console.log("here1")
    //   const results = await curs.toArray()
    //   console.log("here2")
    //   return results
    // })
    console.log("Successfully got all collections!", results)
    res.send(results as IVocab[]) // return them in a 'nicer' array format.
  })

  // [GET] Get Specific Collection
  app.get("/get_collection/:uuid", async (req, res) => {
    const { uuid } = req.params
    let result: any

    try {
      result = await r.db('a3').table('collections').get(uuid).run(connection)
      if (!result) throw new Error("could not get collection!")
      result.items.map(async (id: string) => {
        const result = await getVocab(id)
        return result
      })
    } catch (err) {
      console.log(err)
      res.send("failed to get collection")
    }

    // OLD
    // r.db('a3').table('collections').get(uuid).run(connection, (err, data) => {
    //   if (err) {
    //     console.log("Failed...")
    //     throw err
    //   } else {
    //     console.log("Successfully got collection item!", data)
    //     console.log("Sending to frontend...")
    //     res.send(data)
    //   }
    // })
  })

  const getVocab = async (uuid: string): Promise<IVocab | never> => {
    let result = await r.db('a3').table('vocab_items').get(uuid).run(connection)
    if (!result) {
      throw new Error("invalid ID")
    } else {
      return result as IVocab
    }
  }

  // [GET] Get Specific VocabItem
  app.get("/get_vocab_item/:uuid", async (req, res) => {
    let { uuid } = req.params
    console.log(uuid)
    let result: IVocab

    try {
      result = await getVocab(uuid)
      console.log("Successfully got collection item!", result)
      console.log("Sending to frontend...")
      res.send(result)
    } catch (err) {
      console.log("Failed /get_vocab_item", err)
      res.send("failed to get vocab item!")
    }

    // OLD
    // r.db('a3').table('vocab_items').get(uuid).run(connection, (err, data) => {
    //   if (err) {
    //     console.log("Failed...")
    //     throw err
    //   } else {
    //     console.log("Successfully got collection item!", data)
    //     console.log("Sending to frontend...")
    //     res.send(data)
    //   }
    // })
  })
  // end of main API calls.

  // helper API calls, delete both tables & create them manually when needed to initialize again (for testing!)
  // copy and paste the shortcut links to use them...
  // SHORTCUT LINK; 
  // http://localhost:4000/deleteALL
  app.get("/deleteALL", async (req, res) => {
    r.db('a3').tableDrop('collections').run(connection, (err, data) => {
      if (err) {
        console.log("Failed...")
      } else {
        console.log("Successfully deleted collections table!")
      }
    });
    r.db('a3').tableDrop('vocab_items').run(connection, (err, data) => {
      if (err) {
        console.log("Failed...")
      } else {
        console.log("Successfully deleted vocab_items table!")
      }
    });
    r.db('a3').tableDrop('cloud_items').run(connection, (err, data) => {
      if (err) {
        console.log("Failed...")
      } else {
        console.log("Successfully deleted cloud_items table!")
      }
    });
  })

  // SHORTCUT LINK; 
  // http://localhost:4000/createALL
  app.get("/createALL", async (req, res) => {
    r.db('a3').tableCreate('collections').run(connection, (err, data) => {
      if (err) {
        console.log("Failed...")
      } else {
        console.log("Successfully created collections table!")
      }
    });
    r.db('a3').tableCreate('vocab_items').run(connection, (err, data) => {
      if (err) {
        console.log("Failed...")
      } else {
        console.log("Successfully created vocab_items table!")
      }
    });
    r.db('a3').tableCreate('cloud_items').run(connection, (err, data) => {
      if (err) {
        console.log("Failed...")
      } else {
        console.log("Successfully created cloud_items table!")
      }
    });
  })

  // app.use((req, res) => {
  //   res.sendFile(join(__dirname, "..", "..", "build", "index.html"))
  // })

  app.listen(port, async () => {
    console.log("listening on port " + port)
  })
})

let connection: r.Connection
r.connect({ host: "localhost", port: 28015 }, (err, conn) => {
  if (err) {
    console.log(err)
    throw err
  }
  connection = conn
  console.log("connected to rethinkDB!")
  app.emit("ready")
})
