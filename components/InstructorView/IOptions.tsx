import styles from './IOptions.module.scss'
import Toggle from './Your_Courses/togglesched'
import Menu from './Menu/Menu'
import Link from 'next/link'

const IOptions = () => {
    return (
        <div id={styles.I_container}>
            <a className={styles.box}>
                <h2 className={styles.font}>Your Courses</h2>
            </a>
            <div className={styles.box1}>
                <h2 className={styles.font}>Tools</h2>

                <br></br>
                <div id={styles.box2}>
                    <h1 className={styles.font2}>Classes</h1>
                    <div id={styles.box4}>
                        <Menu />
                    </div>
                </div>
                <div id={styles.box3}>
                    <h3 className={styles.font2}>Canvas</h3>

                </div>


            </div>



        </div>


    )
}

export default IOptions