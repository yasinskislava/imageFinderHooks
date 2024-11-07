import styled from 'styled-components';
import './App.css';
import Searchbar from './components/Searchbar';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import arrowLeft from "./arrow-left.svg";
import arrowRight from "./arrow-right.svg";


const LoadMore = styled.button`
    cursor: pointer;
    width: 140px;
    height: 30px;
    font-family: "Roboto";
    background-color: rgba(0,0,0,0.1);
    transition: 300ms;
    border: transparent;
    display: block;
    margin: auto;
    margin-bottom: 50px;
    &:hover {
      background-color: rgba(0,0,0,0.2);
      transform: scale(1.05);
    }
`;

const Loader = styled.span`
  color: black;
  font-family: Consolas, Menlo, Monaco, monospace;
  font-weight: bold;
  font-size: 78px;
  opacity: 0.8;

  &:before {
    content: "{";
    display: inline-block;
    animation: pulse 0.4s alternate infinite ease-in-out;
  }
  &:after {
    content: "}";
    display: inline-block;
    animation: pulse 0.4s 0.3s alternate infinite ease-in-out;
  }

  @keyframes pulse {
    to {
      transform: scale(0.8);
      opacity: 0.5;
    }
  }
`;
const ImageGallery = styled.ul`
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    li {
      img {
        width: 300px;
        height: auto; 
        transition: 250ms;
        cursor: pointer;
        &:hover {
          transform: scale(1.05);
        }
      } 
    }
   
`;

const Modal = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    position: fixed;
    box-sizing: border-box;
    z-index: 999;
    .image {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: calc(100% - 100px);
      width: auto;
    }
    
`;


function App() {
  const [page, setPage] = useState(1);
  const [props, setProps] = useState("cat");
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const hideButton = useRef(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const checkIs = useCallback((value) => {
    return value !== undefined ? 1 : 0;
  }, []);

  const getData = useCallback(() => {
    setIsDataLoading(true);
    fetch(`https://pixabay.com/api/?page=${page}&key=43085062-83502d00c5fb8aeb01fe37f91&image_type=photo&orientation=horizontal&per_page=13&q=${props}`)
      .then(val => val.json())
      .then(val => {
        const tempRes = val.hits;
        hideButton.current = tempRes.length < 13;
        if (!hideButton.current) tempRes.pop();

        const tempArr = list;
        tempRes.map(image => {
          tempArr.push({ smallUrl: image.webformatURL, largeUrl: image.largeImageURL, key: image.id });
          return true;
        });

        setList(tempArr);
        setIsDataLoading(false);
      });
  }, [page,props]);
  useEffect(() => {
    getData()
  }, [page, props]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setShow(false);
    if (e.key === "ArrowLeft") setActiveIndex((prev) => Math.max(0, prev - 1));
    if (e.key === "ArrowRight") setActiveIndex((prev) => prev + checkIs(list[prev + 1]));
  }, [list, checkIs]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
  
  const galleryItems = useMemo(() => 
  list.map(item => (
    <li onClick={(e) => {
        e.preventDefault();
        for (let i = 0; i < list.length; i++) {
          if (list[i].smallUrl === item.smallUrl) {
            setShow(true);
            setActiveIndex(i);
          }
        } 
    }}
    key={item.key}>
      <img src={item.smallUrl} alt="item" />
    </li>
  ))
);

    return (
      <>
        {show ? <Modal onClick={(e) => { e.preventDefault(); if (e.target.tagName === "DIV") { setShow(false); } }}>
          <img src={arrowLeft} alt="arrow" style={{cursor: "pointer" ,position: "absolute", top: "50%", transform: "translateY(-50%)", left: "5%", width: "50px", height: "auto"}} onClick={() => {setActiveIndex(Math.max(0, activeIndex - 1));}} />
          <Loader style={{color: "white", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}></Loader>
          <img className="image" src={list[activeIndex].largeUrl} alt="activeImage" />
          <img src={arrowRight} alt="arrow" style={{cursor: "pointer" ,position: "absolute", top: "50%", transform: "translateY(-50%)", right: "5%", width: "50px", height: "auto"}} onClick={() => {setActiveIndex(activeIndex + checkIs(list[activeIndex + 1]));}} />
        </Modal> : <></>}
        <Searchbar arr={[setPage, setProps, setList]} />
        {isDataLoading ? (
        <div style={{ display: "flex", justifyContent: "center", width: "100%", height: "100px", alignItems: "center" }}><Loader /></div>
          ) : (<ImageGallery>{list.length === 0 ? <p>No images were found</p> : galleryItems}</ImageGallery>)}
        {(hideButton.current || isDataLoading) ? <></> : <LoadMore onClick={(e) => { e.preventDefault(); setPage(page + 1) }}>Load more</LoadMore >}
      </>
      );
  
}

export default App;
