import styles from './ImageUploadAndInfo.module.scss'
import { Dispatch, SetStateAction } from 'react'

interface imageProps {
  setImage: Dispatch<SetStateAction<File | null>>
  setImageDesc: Dispatch<SetStateAction<string>>
}

const ImageUploadAndInfo = ({ setImage, setImageDesc }: imageProps) => {
  return (
    <div id={styles.container}>
      <section id={styles.imageSelect}>
        <label htmlFor="imageUpload">Select an Image</label>
        <br />
        <input type="file" name="upload" id="upload" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} accept="image/*" />
      </section>
      <section id={styles.imageInfo}>
        <label htmlFor="info">Image Information</label>
        <br />
        <textarea id="info" rows={6} cols={30} onChange={(e) => setImageDesc(e.target.value)}></textarea>
      </section>
    </div>
  )
}

export default ImageUploadAndInfo
