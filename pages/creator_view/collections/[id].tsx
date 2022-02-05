// CURRENTLY NOT USED

import Axios, { AxiosResponse } from 'axios'
import { ICollection } from 'interfaces'
import { sample, sample2 } from '@components/Samples'


export const getStaticPaths = async () => {
  let response: AxiosResponse
  let data: ICollection[]
  try {
    response = await Axios.get("/get_all_collections")
    data = response.data
  } catch (err) {
    // for testing without backend
    // console.log(err)
    data = [sample, sample2]
  }

  const paths = data.map(col => {
    return {
      params: {
        id: col.id
      }
    }
  })

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async (context: { params: { id: string } }) => {
  const id = context.params.id
  let response: AxiosResponse
  let data: ICollection[]
  try {
    response = await Axios.get(`/get_collection?id=${id}`)
    data = response.data as ICollection[]
  } catch (err) {
    // for testing without backend
    // console.log(err)
    data = [id === "random" ? sample : sample2]
  }

  return {
    props: {
      collections: data
    }
  }
}

const CollectionDetails = ({ collections }: { collections: ICollection[] }) => {
  return (
    <>
      {collections.map(col => {
        return (
          <div>
            <h2>{col.name}</h2>
            {col.items.map(item => {
              return (
                <p>{item.value}</p>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export default CollectionDetails
