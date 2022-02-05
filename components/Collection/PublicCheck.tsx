import styles from './PublicCheck.module.scss'

const PublicCheck = () => {
  return (
    <section id={styles.container}>
      <div>
        <label htmlFor="public">Public<br />(share with other instructors)</label>
        <input type="checkbox" name="public" id="public" />
      </div>
    </section>
  )
}

export default PublicCheck
