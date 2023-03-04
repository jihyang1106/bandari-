import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import locationIcon from '../assets/Location.png';
import './css/SellCategory.css';

import {
  setStateBasic,
  setSatatePeed,
  setStateSnack,
  setStateProduct,
} from '../store/module/sellCategorySwitch';

import axios from 'axios';

export default function SellCategory(props) {
  const basicBtnRef = useRef();
  const peedBtnRef = useRef();
  const snackBtnRef = useRef();
  const productBtnRef = useRef();

  const [swtichType, setSwitchType] = useState('');
  // 클라이언트의 서치 상태 값
  const [search, setSearch] = useState('');
  // db에서 가져온 서치 값

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [btnState, setBtnState] = useState('');
  const idxBtnState = useSelector((state) => state.typeSwitch.switchState);
  const sellState = useSelector(
    (state) => state.sellCategorySwitch.switchState
  );
  const pets = useSelector((state) => state.pets.pets);
  // console.log(pets);
  const userLocation = useSelector((state) => state.location.userLocation);
  const isLogin = sessionStorage.getItem('userId');

  const sellButton = () => {
    if (isLogin) {
      if (pets.length > 0) {
        navigate('/sellForm', { replace: false });
      } else {
        alert('펫을 등록하셔야 판매할 수 있습니다');
      }
    } else {
      alert('로그인 하셔야 이용이 가능합니다.');
    }
  };

  useEffect(() => {
    if (idxBtnState === 'basic') {
      setBtnState('basic');
    } else if (idxBtnState === 'puppy') {
      setBtnState('puppy');
    } else {
      setBtnState('cat');
    }
  }, [idxBtnState]);

  useEffect(() => {
    if (sellState === 'basic') {
      setSwitchType('전체');
      basicBtnRef.current.classList.add('clicked');
    } else if (sellState === 'peed') {
      setSwitchType('사료');
      peedBtnRef.current.classList.add('clicked');
    } else if (sellState === 'snack') {
      setSwitchType('간식');
      snackBtnRef.current.classList.add('clicked');
    } else {
      setSwitchType('용품');
      productBtnRef.current.classList.add('clicked');
    }
  }, [sellState]);

  const clickedBtn = (e) => {
    const target = e.target;
    if (target.value === 'basic') {
      dispatch(setStateBasic());
      basicBtnRef.current.classList.add('clicked');
      peedBtnRef.current.classList.remove('clicked');
      snackBtnRef.current.classList.remove('clicked');
      productBtnRef.current.classList.remove('clicked');
    } else if (target.value === 'peed') {
      dispatch(setSatatePeed());
      peedBtnRef.current.classList.add('clicked');
      basicBtnRef.current.classList.remove('clicked');
      snackBtnRef.current.classList.remove('clicked');
      productBtnRef.current.classList.remove('clicked');
    } else if (target.value === 'snack') {
      dispatch(setStateSnack());
      snackBtnRef.current.classList.add('clicked');
      basicBtnRef.current.classList.remove('clicked');
      peedBtnRef.current.classList.remove('clicked');
      productBtnRef.current.classList.remove('clicked');
    } else if (target.value === 'product') {
      dispatch(setStateProduct());
      productBtnRef.current.classList.add('clicked');
      basicBtnRef.current.classList.remove('clicked');
      peedBtnRef.current.classList.remove('clicked');
      snackBtnRef.current.classList.remove('clicked');
    }
  };

  // 서치 값
  const onChangeSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };
  // 앤터 버튼
  const onSubmitSearch = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  // db에 검색 값 조회
  const onSearch = () => {
    // console.log('검색값 :', search);
    axios
      .post('supplies/postSearch', {
        searchData: search,
      })
      .then((res) => {
        console.log('검색 결과 값 :', res.data);
        // 검색시 페이지네이션 조절 sellpage setPagination()함수에 값 보냄
        props.setCurrentPosts(res.data);
        props.setPagination(res.data.length);
      });
  };

  const getAllData = () => {
    console.log('위치와 상관없는 모든 값을 가져옵니다');
  };

  return (
    <div className="sellCategory">
      {/* 상단 카테고리, 검색 & 판매 버튼 누르면, 판매 글 폼 열림 */}

      <div className="categoryButtonContainer">
        <button className="getAllBtn" onClick={getAllData}>
          모든 위치 글 가져오기
        </button>
        <div className={`adressPickButton ${btnState}`}>
          <img src={locationIcon} alt="주소지 버튼 아이콘" />
          {userLocation ? (
            <>
              {' '}
              {userLocation.region_2depth_name +
                ' ' +
                userLocation.region_3depth_name}
            </>
          ) : (
            <>전체</>
          )}
        </div>
        <div className={`changeBtn ${btnState}`}>
          <button
            ref={basicBtnRef}
            className="categoryButton basicBtn"
            value="basic"
            onClick={clickedBtn}
          >
            전체
          </button>
          <button
            ref={peedBtnRef}
            className="categoryButton peedBtn"
            value="peed"
            onClick={clickedBtn}
          >
            사료
          </button>
          <button
            ref={snackBtnRef}
            className="categoryButton snackBtn"
            value="snack"
            onClick={clickedBtn}
          >
            간식
          </button>
          <button
            ref={productBtnRef}
            className="categoryButton productBtn"
            value="product"
            onClick={clickedBtn}
          >
            용품
          </button>
        </div>
      </div>
      <div className="searchNav">
        <input
          type="text"
          className="searchInput"
          value={search}
          onChange={onChangeSearch}
          onKeyPress={onSubmitSearch}
        />
        {/* 서치값 sellpage 컴포넌트로 값을 보내는 중 */}
        <button
          className={`searchBtn ${btnState}`}
          onClick={() => {
            onSearch();
          }}
        >
          검색
        </button>

        <button
          className={`saleButton ${btnState}`}
          onClick={() => {
            sellButton();
          }}
        >
          판매하기
        </button>
      </div>
    </div>
  );
}
