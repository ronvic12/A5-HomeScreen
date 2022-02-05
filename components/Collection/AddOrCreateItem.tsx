import styles from './AddOrCreateItem.module.scss'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ELanguage } from 'interfaces/assets/languages'

interface Props {
  lang: ELanguage | undefined
}

const AddOrCreateItem = ({lang}: Props) => {
  const router = useRouter()
  const [link, setLink] = useState(`/add_item?append=true`)

  useEffect(() => {
    if (!router.isReady) return
    if (!lang && lang !== 0) return
    if (router.query.edit === "true") {
      setLink(`/add_item?edit=true&lang=${lang}`)
    } else if (router.query.append === "true") {
      setLink(`/add_item?append=true&lang=${lang}`)
    } else {
      setLink(`/add_item?append=true&lang=${lang}`)
    }
  }, [router.isReady, lang])

  return (
    <section id={styles.container}>
      <Link href={link}>
        <button>Create a new Item</button>
      </Link>
    </section>
  )
}

export default AddOrCreateItem
