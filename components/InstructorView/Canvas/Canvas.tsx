import styles from './Canvas.module.scss'
import Link from 'next/link';
import Home from 'pages';

const Canvas = () => {

    return (
        <div>
            <section>
               
                <Link href="/"><a className={styles.a}><button className={styles.box}>Export all classes</button></a></Link>
            </section>
            <br></br>
            <section>
                <Link href="/"><a className={styles.a}><button className={styles.box}>My assessments</button></a></Link>
            </section>
            <br></br>
            <section>
                <Link href="/"><a className={styles.a}><button className={styles.box}>Create assessment</button></a></Link>
            </section>
        </div>
    )

}

export default Canvas