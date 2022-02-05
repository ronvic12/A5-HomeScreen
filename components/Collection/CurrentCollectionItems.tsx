import styles from './CurrentCollectionItems.module.scss'

import { Dispatch, SetStateAction, useEffect } from 'react'
import { IVocab } from '../../interfaces'
import { useRouter } from 'next/router'
import Axios from 'axios'

interface Props {
  setItems: Dispatch<SetStateAction<IVocab[] | undefined>>
  items: IVocab[] | undefined
}

const CurrentCollectionItems = ({ items, setItems }: Props) => {
  const router = useRouter()

  const handleRemove = async (id: string) => {
    console.log(id)
    const newItems = items!.filter(item => item.id !== id)
    // await Axios.delete(`http://localhost:4000/delete/vocab_items/${id}`)
    setItems(newItems)
  }

  const handleEdit = (id: string) => {
    router.push(`/edit_item?id=${id}`)
  }

  const Card = (item: IVocab) => {
    return (
      <article key={item.value}>
        <h3>{item.value}</h3>
        <h3>{item.translation}</h3>
        <button onClick={async () => await handleRemove(item.id)}>REMOVE</button>
        <button onClick={() => handleEdit(item.id)}>EDIT</button>
      </article>
    )
  }

  useEffect(() => {
    if(!router.isReady) return
    console.log(router.query)
    if (Object.keys(router.query).length === 0) {
      // console.log(router)
      console.log("clearing")
      localStorage.clear()
    }
    if (localStorage.getItem("state") != null) {
      console.log(localStorage.getItem("state"))
      setItems(JSON.parse(localStorage.getItem("state")!).items)
    }
  }, [router.isReady])

  return (
    <section id={styles.container}>
      <h2>Current Collection Items</h2>
      <div>
        { items ? items.map(Card) : null }
      </div>
    </section>
  )
}

export default CurrentCollectionItems
