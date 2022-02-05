import LanguageSelect from "../components/CreateItems/Column1/LanguageSelect"
import CardsSection from "../components/CreateItems/Column1/CardsSection"
import WordInput from "../components/CreateItems/Column2/WordInput"
import SoundFileUpload from "../components/CreateItems/Column2/SoundFileUpload"
import Notes from "../components/CreateItems/Column2/Notes"
import Example from "../components/CreateItems/Column3/Example"
import ImageSection from "../components/CreateItems/Column3/ImageSection"
import ImageUploadAndInfo from "../components/CreateItems/Column3/ImageUploadAndInfo"

import styles from 'styles/add_item.module.scss'

import { FormEvent, useState, useEffect } from "react"
import { useRouter } from 'next/router'
import axios from 'axios'

import { ELanguage } from "../interfaces/assets/languages"
import { IVocab } from "../interfaces"

const add_item = () => {
  const router = useRouter()
  const [language, setLanguage] = useState<ELanguage>()
  const [word, setWord] = useState("")
  const [translation, setTranslation] = useState("")
  const [example, setExample] = useState("")
  const [imageDesc, setImageDesc] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [pronunciation, setPronunciation] = useState<File | null>(null)
  let vocabWord: IVocab;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // create formdata to send image and sound files
    const form = new FormData()
    // form.append("language", language)
    form.append("value", word)
    // form.append("translation", translation)
    // form.append("example", example)
    form.append("imageDesc", imageDesc)
    form.append("image", image as Blob)
    form.append("pronunciation", pronunciation as Blob)

    // send image/sound data to server
    const formResponse = await axios.post("http://localhost:4000/insert_cloud_item", form)
    console.log(formResponse.data)

    // get s3Key for further use
    const key = formResponse.data.id

    // add vocab item data
    const newItem: IVocab = {
      lang: language!,
      translation: translation,
      value: word,
      s3Key: key,
      id: "" // assigned on server
    }

    // send vocab item to server
    const response = await axios.post("http://localhost:4000/insert_vocab_item", newItem)
    console.log(response.data)
    newItem.id = response.data.id as string

    // check for query param, this means that we came from the add collections
    // page and we want to add to the current collection instead of just
    // creating a new vocab word
    if (router.query.append === "true" || router.query.edit === "true") {
      // get cached data if any
      const data = localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")!) : {}
      console.log(data)

      if (data.items) {
        data.items.push(newItem)
      } else {
        data.items = [newItem]
      }

      // update cached data with newly added vocab
      localStorage.setItem("state", JSON.stringify(data))

      // go back to add collection page
      if (router.query.append) {
        router.push("/add_collection?append=true")
      } else {
        router.back()
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div id={styles.container}>
          <div id={styles.column1}>
            <LanguageSelect language={language} setLanguage={setLanguage} />
            <CardsSection />
          </div>
          <div id={styles.column2}>
            <WordInput word={word} language={language} translation={translation} setWord={setWord} setTranslation={setTranslation} />
            <SoundFileUpload setPronunciation={setPronunciation} />
            <Notes />
          </div>
          <div id={styles.column3}>
            <Example setExample={setExample} />
            <ImageSection />
            <ImageUploadAndInfo setImage={setImage} setImageDesc={setImageDesc} />
          </div>
        </div>
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}

export default add_item
