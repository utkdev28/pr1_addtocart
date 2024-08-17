'use client';
import Link from "next/link";
import styles from "./page.module.css";


import { createContext, useEffect, useState } from "react";

export default function Home() {
  const [listdata,setlistdata] = useState([]);
  const [listpage,setlistpage]:any=useState([]);
  let arr = JSON.parse(localStorage.getItem('cartdata')|| '') || [];
  const [cartpagedata,setcartpagedata]:any = useState(arr);
  const MyContext = createContext({});



  function onAddtoCart(_oEvent: any,id:number){
    setcartpagedata((prev:Array<number>)=>[...prev,id]);
  }

  useEffect(()=>{
    localStorage.setItem('cartdata',JSON.stringify(cartpagedata));
  },[cartpagedata])

  useEffect(()=>{
    async function fetchDatafromJSON() {
      if(listdata.length >0 )
          return;
      console.log('Called Multiole times')
      //fetcing data from local JSON file present in Public folder
      const res = await fetch('/productlist.json')
      let arr = await res.json();
      console.log(arr);
      setlistdata(arr);
    }
    fetchDatafromJSON();
    return;
  },[])
  // useEffect with dependent on Data load to rerender on Screen
  useEffect(()=>{
    if(listdata.length ==0)
      return;
    let arr=[]
    let obj = { "width": "100%","height": "200px"};
    for (let productitem of listdata) {
      arr.push(<div itemID={productitem['id']} key={productitem['id']} className={styles.card}>
        {productitem['images'][0] && <img src={productitem['images'][0]} style={obj} className={styles.card_image}></img>}
        <div className={styles.card_body} key={productitem['id']}>
          <h3 className={styles.card_title}>{productitem['title']}</h3>
          <p className={styles.card_content}>{productitem['price']}</p>
          <button onClick={(evt)=>{onAddtoCart(evt,productitem['id'])}} className={styles.card_button}>Add to Cart</button>
        </div>
      </div>)
    }
    console.log('Reached here')
    console.table(listpage);
    setlistpage(arr);
  }, [listdata])

  function NavtoCartPage(){
    window.location.pathname = '/mycart';
  }

  return (
    <>
      <h2 className={styles.App_header}>Welcome to X-Cart
          <Link href={'/mycart'} className={styles.myCart_buttom}>
            <button onClick={NavtoCartPage}>
              <span >ICON</span>
              <span >Cart</span>
              <span>2</span>
            </button>
          </Link>
      </h2>
      <div className={styles.productlistcontainer}>
          {listpage}
      </div>
    </>
  );
}
