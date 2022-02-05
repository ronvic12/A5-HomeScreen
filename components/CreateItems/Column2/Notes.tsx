import styles from './Notes.module.scss'

const Notes = () => {
  return (
    <section id={styles.container}>
      <label htmlFor="input">Notes</label>
      <br />
      <textarea rows={5} cols={30}></textarea>
    </section>
  )
}

export default Notes
