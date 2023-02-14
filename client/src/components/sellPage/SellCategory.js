import React, { useState } from 'react';
import CategoryButton from './CategoryButton.js';
import AdressPickButton from './AdressPickButton.js';
import styles from '../css/sellPage/SellCategory.module.css';
import SellForm from './SellForm.js';

export default function SellCategory() {
  const [state, setState] = useState(false);

  const sellButton = () => {
    console.log('판매버튼');
    setState(true);
  };

  return (
    <>
      {/* 상단 카테고리, 검색 & 판매 버튼 누르면, 판매 글 폼 열림 */}
      {state === false ? (
        <>
          <span className={styles.categoryButtonContainer}>
            <AdressPickButton />
            <CategoryButton text={'전체'} />
            <CategoryButton text={'사료'} />
            <CategoryButton text={'간식'} />
            <CategoryButton text={'용품'} />
          </span>
          <span className={styles.shearchNav}>
            <input type="text" className={styles.shearchInput} />
            <CategoryButton text={'검색'} />
            <button
              className={styles.saleButton}
              onClick={() => {
                sellButton();
              }}
            >
              판매하기
            </button>
          </span>
        </>
      ) : (
        <SellForm />
      )}
    </>
  );
}