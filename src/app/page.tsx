'use client';
import Link from "next/link";
import styles from "./page.module.css";


import { createContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Home() {
  const [listdata,setlistdata] = useState([]);
  const [listpage,setlistpage]:any=useState([]);
  const [cartpagedata,setcartpagedata]:any = useState([]);
  const MyContext = createContext({});



  function onAddtoCart(_oEvent: any,id:number){
    let newCartdata:Array<Number> = [];
    setcartpagedata((prev:Array<number>)=>{
      newCartdata = [...prev,id]
      localStorage.setItem('cartdata',JSON.stringify(newCartdata))
      return newCartdata;
    });
    toast.success(`Item ${id} added to Cart!` ,{
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  // useEffect(()=>{
  //   localStorage.setItem('cartdata',JSON.stringify(cartpagedata));
  // },[cartpagedata])

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
      let cartarr = JSON.parse(window.localStorage.getItem('cartdata')|| JSON.stringify('')) || [];
      setcartpagedata(cartarr);
      localStorage.setItem('cartdata',JSON.stringify(cartarr));
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
          <ToastContainer />
        </div>
      </div>)
    }
    console.log('Reached here')
    console.table(listpage);
    setlistpage(arr);
  }, [listdata])

  return (
    <>
      <h2 className={styles.App_header}>Welcome to X-Cart
          <Link href={'/mycart'} className={styles.myCart_buttom}>
              <span >ICON</span>
              <span >Cart</span>
              <span>2</span>
          </Link>
      </h2>
      <div className={styles.productlistcontainer}>
          {listpage}
      </div>
    </>
  );
}
