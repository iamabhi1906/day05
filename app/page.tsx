import Image from 'next/image';
import styles from '@/app/_css/page.module.css';
import Loading from './loading';
import NavigationBar from '@/components/navigation-bar';

export default async function Home() {
  return (
    <div>
      <NavigationBar />
      This is simple page
    </div>
  );
}
