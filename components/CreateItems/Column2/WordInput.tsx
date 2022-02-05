import styles from './WordInput.module.scss'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { ELanguage } from 'interfaces/assets/languages'

interface wordProps {
  language: ELanguage | undefined
  word: string
  translation: string
  setWord: Dispatch<SetStateAction<string>>
  setTranslation: Dispatch<SetStateAction<string>>
}

const WordInput = ({ word, language, setWord, translation, setTranslation}: wordProps) => {
  useEffect(() => {
    console.log(typeof language)
  },[language])
  return (
    <section id={styles.container}>
      <div className={`${styles.inputBox} ${styles.blue}`}>
        <label>{ELanguage[language!] ?? "Choose a language"}</label>
        <input type="text" name="spanishWord" id={styles.spanishWord} onChange={(e) => setWord(e.target.value)} value={word} required />
      </div>
      <div className={styles.inputBox}>
        <label>English</label>
        <input type="text" name="englishWord" id={styles.englishWord} onChange={(e) => setTranslation(e.target.value)} value={translation} required />
      </div>
    </section>
  )
}

export default WordInput
