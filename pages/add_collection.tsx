import AddOrCreateItem from '../components/Collection/AddOrCreateItem'
import Collaborators from '../components/Collection/Collaborators'
import CurrentCollectionItems from '../components/Collection/CurrentCollectionItems'
import Description from '../components/Collection/Description'
import LanguageAndNameInput from '../components/Collection/LanguageAndNameInput'
import PublicCheck from '../components/Collection/PublicCheck'

import styles from '@styles/add_collection.module.scss'

import { ELanguage, ICollection, IVocab } from '../interfaces'

import { useState, useEffect, MouseEvent } from 'react'
import axios, { AxiosResponse } from 'axios'
import { useRouter } from 'next/router'

const add_collection = () => {
  const router = useRouter()
  const [lang, setLang] = useState<ELanguage | undefined>()
  const [name, setName] = useState<string>("")
  const [authorName, setAuthorName] = useState<string>("")
  const [authorEmail, setAuthorEmail] = useState<string>("")
  const [items, setItems] = useState<IVocab[]>()
  const [description, setDescription] = useState<string>("")

  // if form complete, send all necessary info to server
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    // form not complete, leave
    // TODO: front-end should prompt user to finish filling out form
    if (!name || !authorName || !authorEmail || !lang || !items || items.length === 0 || !description) return

    // create collection object to send to server
    const collection: ICollection = {
      author: {
        email: {
          address: ""
        },
        name: "",
        rank: 3, // default to creator for now
        id: "" // ID will get assigned on server
      },
      description,
      items,
      lang,
      name,
      // ID gets assigned on server if this is a new collection, otherwise
      // the existing collection ID should be in the query params
      id: router.query.collection as string ?? "", 
    }

    // create a new collection on server or update existing collection based on
    // query params
    try {
      // this won't work until the backend is implemented
      let response: AxiosResponse
      if (router.query.edit === "true") {
        response = await axios.put(`http://localhost:4000/update/collections/${router.query.collection}`, collection)
      } else {
        response = await axios.post("http://localhost:4000/insert_collection", collection)
      }
      console.log(response)
    } catch (err) {
      console.log(err)
      return
    }
    
    // clear all data on browser now that collection is submitted
    localStorage.clear()
    setAuthorEmail("")
    setAuthorName("")
    setDescription("")
    setItems(undefined)
    setLang(undefined)
    setName("")
    router.push("/creator_view")
  }
  
  // check if any cached data already since we may be coming back from the add
  // items page, then set state of all fields so that they are pre-filled
  useEffect(() => {
    const data = localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")!) : {}
    if (data.name) setName(data.name)
    if (data.lang) setLang(data.lang)
    if (data.authorName) setAuthorName(data.authorName)
    if (data.authorEmail) setAuthorEmail(data.authorEmail)
    if (data.items) setItems(data.items)
    if (data.description) setDescription(data.description)
  }, [])

  // update cached data with field values if changed
  useEffect(() => {
    const data = localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")!) : {}
    console.log(data)
    data.name = name ?? undefined
    data.lang = lang ?? undefined
    data.authorName = authorName ?? undefined
    data.authorEmail =  authorEmail ?? undefined
    data.items = items ?? undefined
    data.description = description ?? undefined

    localStorage.setItem("state", JSON.stringify(data))
  }, [name, lang, authorName, authorEmail, items, description])

  return (
    <main id={styles.container}>
      <div id={styles.row1}>
        <LanguageAndNameInput name={name} setName={setName} lang={lang} setLang={setLang} />
        <div>
          <PublicCheck />
          <Collaborators authorName={authorName} setAuthorName={setAuthorName} authorEmail={authorEmail} setAuthorEmail={setAuthorEmail} />
        </div>
      </div>
      <hr />
      <div id={styles.row2}>
        <AddOrCreateItem lang={lang} />
        <Description description={description} setDescription={setDescription} />
      </div>
      <hr />
      <CurrentCollectionItems items={items} setItems={setItems} />
      <div id={styles.submitRow}>
        <button onClick={() => router.push("/creator_view")}>back</button>
        <button onClick={handleSubmit}>Finish Collection Creation</button>
      </div>
    </main>
  )
}

export default add_collection
