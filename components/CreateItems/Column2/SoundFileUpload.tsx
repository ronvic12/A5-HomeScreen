import styles from './SoundFileUpload.module.scss'
import { Dispatch, SetStateAction } from 'react'

interface soundProps {
  setPronunciation: Dispatch<SetStateAction<File | null>>
}

const SoundFileUpload = ({ setPronunciation }: soundProps) => {
  return (
    <section id={styles.container}>
      <label htmlFor="soundUpload">Select a sound file</label>
      <br />
      <input type="file" name="soundUpload" id="soundUpload" onChange={(e) => setPronunciation(e.target.files ? e.target.files[0] : null)} accept="audio/*" />
    </section>
  )
}

export default SoundFileUpload
