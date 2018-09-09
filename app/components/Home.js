import React from 'react';
import styles from './Home.scss';

import DragBox from './DragBox';
import FileList from './FileList';

const Home = () => (
  <div className={styles.container}>
    <DragBox />
    <FileList />
  </div>
);

export default Home;
