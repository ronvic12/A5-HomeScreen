import styles from './LanguageAndNameInput.module.scss'

import { Dispatch, SetStateAction } from 'react'
import { ELanguage } from '../../interfaces/assets/languages'

import { useEffect } from 'react'

interface Props {
  setLang: Dispatch<SetStateAction<ELanguage | undefined>>
  setName: Dispatch<SetStateAction<string>>
  lang: ELanguage | undefined
  name: string
}

const LanguageAndNameInput = ({ lang, setLang, name, setName }: Props) => {
  useEffect(() => {
    console.log("hi", ELanguage['english'])
  }, [])
  return (
    <section id={styles.container}>
      <div>
        <label htmlFor="language">Collection Language</label>
        <select name="language" id="language" onChange={e => setLang(+e.target.value)} value={lang}>
          <option value={undefined}>Select a Language</option>
          <option value={0}>English</option>
          <option value={1}>Spanish</option>
          <option value={2}>Punjabi</option>
        </select>
      </div>
      <div>
        <label htmlFor="name">Collection Name</label>
        <input type="text" name="name" id="name" placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
      </div>
    </section>
  )
}

export default LanguageAndNameInput
