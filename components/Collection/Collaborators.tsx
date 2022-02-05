import styles from './Collaborators.module.scss'

import { Dispatch, SetStateAction, useEffect } from 'react'

interface Props {
  setAuthorName: Dispatch<SetStateAction<string>>
  setAuthorEmail: Dispatch<SetStateAction<string>>
  authorName: string
  authorEmail: string
}

const Collaborators = ({ authorName, setAuthorName, authorEmail, setAuthorEmail }: Props) => {

  return (
    <section id={styles.container}>
      <div>
        <label htmlFor="collaborators">Collaborators</label>
        <div>
          <label htmlFor="emailCheck">Send email?</label>
          <input type="checkbox" name="emailCheck" id="emailCheck" />
        </div>
      </div>
      <div>
        <input type="email" placeholder="Email" onChange={e => setAuthorEmail(e.target.value)} value={authorEmail} />
        <input type="text" value={authorName} placeholder="Name" onChange={e => setAuthorName(e.target.value)} />
      </div>
    </section>
  )
}

export default Collaborators
