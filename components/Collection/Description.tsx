import styles from './Description.module.scss'

import { Dispatch, SetStateAction } from 'react'

interface Props {
  setDescription: Dispatch<SetStateAction<string>>
  description: string
}

const Description = ({ description, setDescription }: Props) => {
  return (
    <section id={styles.container}>
      <label htmlFor="description">Description</label>
      <textarea name="description" id="description" placeholder="Information about the collection" onChange={e => setDescription(e.target.value)} value={description}></textarea>
    </section>
  )
}

export default Description
