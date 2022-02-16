import styles from './Main.module.scss'

import Link from 'next/link'

const Main = () => {
  return (
    <div id={styles.container}>
      <h1>eyeVocab</h1>
      <Link href="/creator_view"><a><button>Creator View</button></a></Link>
     <br></br>
     <Link href="/instructor_login"><a><button>Instructor View</button></a></Link>
    </div>
  )
}

export default Main
