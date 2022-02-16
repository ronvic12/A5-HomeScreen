import styles from './Main.module.scss'
import { useRouter } from 'next/router'
import React,{FC, InputHTMLAttributes} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    name:string;
    label:string;
}


function myFunction() {
    let x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

const Main:FC<InputProps> = ({name,label,...rest}) => 
{ const router = useRouter()

  return (
    <main id={styles.container}>
      <h1>Instructor Login</h1>
      <div className={styles.input}>
      <label htmlFor={name}> Email:{label}</label>
      <input id={name} {...rest} className={styles.emailinput}></input>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <label htmlFor={name}>{label}</label>
      Password:<input id={name} {...rest} className={styles.emailinput}></input>
      <br></br>
      Show Password <input type="checkbox" onClick="myFunction()"></input>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button type="button" className ={styles.button}onClick={() => router.push('/instructor_view')}>
      Submit
    </button>


      </div>
    </main>
  )
}

export default Main