import Image from "next/image";
import styles from './styles/Home.module.scss'
import SideNav from "@/components/layouts/sidenav";

export default function Home() {
  const text = "Sorry, This website under construction";

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <nav>
       <SideNav/>
        </nav>
      </header>

      <div 
        className={styles.digitalTextTyping}
        style={{
          '--character-count': text.length,
          '--typing-duration': `${text.length * 0.15}s`
        } as React.CSSProperties}
      >
        {text}
      </div>
      

      <div className={styles.imageContainer}>
  <Image
    src="/images/banner.png"
    alt="Software Development Setup"
    className={styles.mainImage}
    width={600}
    height={400}
    priority
    quality={100}
    unoptimized
  />
</div>

      <Image width={50} height={50}  src= "/images/arrow.svg" alt="arrow" className={styles.scrollIndicator}/>

    </main>
  );
}