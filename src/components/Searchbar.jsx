import styled from "styled-components";
import search from "../search.svg";

const SearchbarBlock = styled.div`
    width: 100%;
    background-color: rgba(0,0,0,0.2);
    height: 60px;
    display: flex;
    position: static;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    div {
        gap: 2.5px;
        border-radius: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        background-color: #fff;
        width: 300px;
        img {
            width: 25px;
            height: 25px;
            margin-left: 5px;
        }
        input {
            font-family: "Roboto";
            width: 265px;
            height: 100%;
            box-sizing: border-box;
            border-radius: 0px 25px 25px 0px;
            border: transparent;
            &:focus {
                outline: none;
            }
            &::placeholder {
                font-family: "Roboto";
            }
        }
    }
`;

export default function Searchbar({ arr }) {
    const [setPage, setProps, setList] = arr;
    return <SearchbarBlock>
        <div>
            <img src={search} alt="search" />
            <input onInput={(e) => { e.preventDefault(); setProps(e.target.value); setPage(1); setList([]); }} type="text" placeholder="Search..." />
        </div>
    </SearchbarBlock>
}