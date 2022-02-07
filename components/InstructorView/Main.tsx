import styles from './Main.module.scss'

import IOptions from './IOptions'
const Main = () => {
  return (
    <main id={styles.container}>
      <h1>Instructor View</h1>
      <IOptions/>
    </main>
  )
}

export default Main
