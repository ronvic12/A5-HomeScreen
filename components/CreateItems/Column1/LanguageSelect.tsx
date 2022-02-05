import styles from './LanguageSelect.module.scss'

import { Dispatch, SetStateAction } from 'react'
import { ELanguage } from 'interfaces/assets/languages'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface LanguageProps {
  language: ELanguage | undefined
  setLanguage: Dispatch<SetStateAction<ELanguage | undefined>>
}

const LanguageSelect = ({ language, setLanguage }: LanguageProps) => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.lang) setLanguage(+router.query.lang)
  }, [router.isReady])

  return (
    <section id={styles.container}>
      <select id="langSelect" className={styles.selection} onChange={(e) => setLanguage(isNaN(+e.target.value) ? undefined : +e.target.value)} value={language} required>
        <option value={undefined}>Select a Language</option>
        <option value={0}>English</option>
        <option value={1}>Spanish</option>
        <option value={2}>Punjabi</option>
      </select>
      {/* <select id="collectionSelect" className={styles.selection}>
        <option value="">Select a Collection</option>
        <option value="Collection 1">Collection 1</option>
        <option value="Collection 2">Collection 2</option>
        <option value="Collection 3">Collection 3</option>
      </select> */}
    </section>
  )
}

export default LanguageSelect
