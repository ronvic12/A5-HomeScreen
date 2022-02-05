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

    // TODO: add functionality for editing sound and images?
    // const form = new FormData()
    // form.append("language", language)
    // form.append("value", word)
    // form.append("translation", translation)
    // form.append("example", example)
    // form.append("imageDesc", imageDesc)
    // form.append("image", image as Blob)
    // form.append("pronunciation", pronunciation as Blob)

    // const response = await axios.post("http://localhost:4000/insert_cloud_item", form)
    // console.log(response.data)

    // add data
    const newItem: IVocab = {
      lang: language!,
      translation: translation,
      value: word,
      id: router.query.id as string // assigned on server
    }

    // make edit request to server
    const response = await axios.put(`http://localhost:4000/update/vocab_items/${router.query.id}`, newItem)
    console.log(response.data)
    newItem.id = response.data.id as string
    console.log(newItem)

    // get cached data if any
    const data = localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")!) : {}
    console.log(data)

    if (data.items) {
      const idx = data.items.findIndex((item: IVocab) => item.id === newItem.id)
      console.log({ idx })
      data.items[idx] = newItem
    } else {
      data.items = [newItem]
    }

    // update cached data with newly added vocab
    localStorage.setItem("state", JSON.stringify(data))

    // go back to add collection page
    router.back()
  }

  // query the vocab item on server then fill out existing data on front-end
  useEffect(() => {
    if (!router.isReady) return
    async function getVocab() {
      const curr = await axios.get(`http://localhost:4000/get_vocab_item/${router.query.id}`)
      const data: IVocab = curr.data
      console.log(data.value)
      setLanguage(data.lang)
      setWord(data.value)
      setTranslation(data.translation)
    }
    getVocab()
  }, [router.isReady])

  // useEffect(() => {
  //   console.log(word)
  // }, [word])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div id={styles.container}>
          <div id={styles.column1}>
            <LanguageSelect language={language} setLanguage={setLanguage} />
            <CardsSection />
          </div>
          <div id={styles.column2}>
            <WordInput word={word} language={language} setWord={setWord} translation={translation} setTranslation={setTranslation} />
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
