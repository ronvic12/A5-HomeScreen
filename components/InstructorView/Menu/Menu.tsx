import styles from './Menu.module.scss'
import Link from 'next/link';
import Home from 'pages';

const Menu = () => {

    return (
        <div>
            <section>
                <Link href="/create_new_course"><a className={styles.a}><button className={styles.box}>Create New Course</button></a></Link>
            </section>
            <br></br>
            <section>
                <Link href="/"><a className={styles.a}><button className={styles.box}>Course Template</button></a></Link>
            </section>
            <br></br>
            <section>
                <Link href="/"><a className={styles.a}><button className={styles.box}>Archived Courses</button></a></Link>
            </section>
        </div>

    )


}

export default Menu