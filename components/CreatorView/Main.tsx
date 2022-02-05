import styles from './Main.module.scss'

import Options from './Options'

const Main = () => {
  return (
    <main id={styles.container}>
      <h1>Creator View</h1>
      <Options />
    </main>
  )
}

export default Main
