import styles from './Example.module.scss'
import { Dispatch, SetStateAction } from 'react'

interface exampleProps {
  setExample: Dispatch<SetStateAction<string>>
}

const Example = ({ setExample }: exampleProps) => {
  return (
    <section id={styles.container}>
      <label htmlFor="input">Example</label>
      <textarea id="input" rows={5} cols={30} onChange={(e) => setExample(e.target.value)} required></textarea>
    </section>
  )
}

export default Example
