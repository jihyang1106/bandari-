import React, { useRef, useState } from 'react';
import styles from './css/SellForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// slick-carousel css
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

// import $ from 'jquery';
export default function SellForm({ setIsSale }) {
  const [imgState, setImgState] = useState([]);

  const navigate = useNavigate();
  const userLocation = useSelector((state) => state.location.userLocation);
  const petSelectRef = useRef();
  const categorySelectRef = useRef();
  const formInfoRef = useRef();
  const imgRef = useRef();

  // slick-carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  /** 이미지 미리보기 함수 */
  const saveImgFile = () => {
    const imgLists = imgRef.current.files;
    let imageUrlLists = [...imgState];
    if (imgLists.length < 5) {
      for (let i = 0; i < imgLists.length; i++) {
        const currentImageUrl = URL.createObjectURL(imgLists[i]);
        imageUrlLists.push(currentImageUrl);
      }
      setImgState(imageUrlLists);
    } else {
      alert('이미지는 최대 4개 까지 등록 가능');
    }
  };

  /**판매 글쓰기 완료 함수 */
  const onCompleteBtn = async () => {
    console.log('판매 글쓰기 완료 버튼 눌림');
    console.log('imgLists', imgRef.current.files);
    const form = formInfoRef.current;
    const formData = new FormData();

    const img = imgRef.current.files;
    // 파일
    for (var i = 0; i < img.length; i++) {
      formData.append('img', img[i]);
    }

    //데이터
    const datas = {
      title: form.title.value,
      price: form.price.value,
      content: form.content.value,
      location: `${userLocation.region_2depth_name} ${userLocation.region_3depth_name}`,
      category: categorySelectRef.current.value,
      deal: true,
      petId: petSelectRef.current.value,
      userId: 'test@naver.com',
    };
    formData.append('data', JSON.stringify(datas));

    // formData의 value 확인
    for (var value of formData.values()) {
      console.log(value);
    }

    await axios
      .post('/supplies/insert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log('res.data', res.data);
      });
  };

  // 반려동물 번호 로 정보 요청 > name 값 가져오기
  let petData = [{ name: '보리' }, { name: '수남' }, { name: '밤이' }];

  /**업로드 버튼 클릭 시 이전 값 초기화  */
  function onImgUpload() {
    setImgState([]); //
  }

  // 취소 버튼
  function onResetPage() {
    navigate('/sellPage');
  }
  return (
    <>
      {/* 판매글 폼 */}
      <form
        className={styles.sellForm}
        ref={formInfoRef}
        encType="multipart/form-data"
      >
        {/* 업로드 된 이미지 미리보기 슬라이드 */}
        <div className={`${styles.sellImges} ${styles.marginBottom}`}>
          <div>
            <Slider {...settings}>
              {imgState.map((images, index) => {
                return (
                  <img
                    key={index}
                    src={images}
                    alt={`${images}-${index}`}
                    className={`${styles.sellImges} ${styles.marginBottom}`}
                  ></img>
                );
              })}
            </Slider>
          </div>

          {/* 클릭시 이미지 업로드 */}
          <label
            className={styles.imgLabel}
            onClick={() => {
              onImgUpload();
            }}
            htmlFor="inputFile"
          >
            +
          </label>
          <input
            type="file"
            id="inputFile"
            accept="image/*"
            name="img"
            style={{ display: 'none' }}
            onChange={saveImgFile}
            ref={imgRef}
            multiple
          />
        </div>
        {/* 제목, 가격 input */}
        <div className={styles.marginBottom}>
          <p className={styles.formSubTitle}>제목</p>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력해주세요"
            required
          />
        </div>
        <div className={styles.marginBottom}>
          <p className={styles.formSubTitle}>가격</p>
          <input
            type="number"
            name="price"
            placeholder="가격을 입력해주세요"
            // pattern="/[0-9]/"
            required
          />
        </div>
        {/* 선택 selectBox */}
        <label htmlFor="category" className={styles.marginRight}>
          카테고리
        </label>
        <select
          name="sellFormCategory"
          ref={categorySelectRef}
          className={`${styles.selcet} ${styles.marginBottom}`}
        >
          <option value="사료">사료</option>
          <option value="간식">간식</option>
          <option value="용품">용품</option>
        </select>
        <label htmlFor="petSellcet" className={styles.marginRight}>
          사용한 내 새꾸
        </label>
        <select
          name="sellFormPetSellect"
          ref={petSelectRef}
          className={`${styles.selcet} ${styles.marginBottom}`}
        >
          {petData.map((pet, index) => {
            return (
              <option key={index} value={pet.name}>
                {pet.name}
              </option>
            );
          })}
        </select>
        <p className={`${styles.marginRight}`}>설명</p>
        <textarea
          name="content"
          placeholder="내용을 입력해 주세요."
          required
        ></textarea>
        {/* 취소 완료 버튼 */}
        <div className={`${styles.submitButton} ${styles.marginBottom}`}>
          <button
            onClick={() => {
              onResetPage();
            }}
          >
            취소
          </button>
          <button
            onClick={() => {
              onCompleteBtn();
            }}
          >
            완료
          </button>
        </div>
      </form>
    </>
  );
}

// {/* {imgState && (
//   <img
//     src={imgState}
//     alt="미리보기 이미지"
//     className={`${styles.sellImges} ${styles.marginBottom}`}
//   />
// )} */}
// {/* <label
//   className={styles.imgLabel}
//   onClick={() => {
//     onImgUpload();
//   }}
//   htmlFor="inputFile"
// >
//   +
// </label> */}
