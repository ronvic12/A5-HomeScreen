import styles from '@styles/view_collection.module.scss'

import { ICollection } from 'interfaces'
import Axios, { AxiosResponse } from 'axios'
import Link from 'next/link'
import { sample, sample2 } from '@components/Samples'

import CollectionsList from '@components/CreatorView/CollectionsView/CollectionsList'


export async function getServerSideProps() {


const serverAddress = 'localhost'
const serverPort = 4000
    // Fetch data from external API
    let response = await Axios.get(`http://${serverAddress}:${serverPort}/verifyUser`)
    
    console.log(response)
    // Pass data to the page via props
    return { props: { response } }
  }


const VerifyUser = () => {
  return (
   <h1>verifying</h1>
  )
}

export default VerifyUser 
