'use client';
import Link from "next/link";
import styles from "./page.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { createContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Home() {
  const [listdata,setlistdata] = useState([]);
  const [listpagehtml,setlistpagehtml]:any=useState([]);
  const [cartpagedata,setcartpagedata]:any = useState([]);
  const [count,setcount] = useState(0);


  // called on click of add to cart button
  function onAddtoCart(_oEvent: any,id:number){
    let newCartdata:Array<Number> = [];
    setcartpagedata((prev:Array<number>)=>{
      newCartdata = [...prev,id]
      localStorage.setItem('cartdata',JSON.stringify(newCartdata))
      setcount(newCartdata.length);
      return newCartdata;
    });
    toast.success(`Item ${id} added to Cart!` ,{
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }
  //intial JSON file load and setting to use state
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
      setcount(cartarr.length);
    }
    fetchDatafromJSON();
    return;
  },[])
  // HTML preprations with dependent on Data load to rerender on Screen
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
    setlistpagehtml(arr);
  }, [listdata])

  return (
    <>
      <h2 className={styles.App_header}>Welcome to X-Cart
          <Link href={'/mycart'} className={styles.myCart_buttom}>
              <FontAwesomeIcon icon={faCartShopping} />
              {/* <FontAwesomeIcon icon="fa-regular fa-cart-shopping" /> */}
              <span >My Cart</span>
              <span className={styles.count_css}>{count}</span>
          </Link>
      </h2>
      <div className={styles.productlistcontainer}>
          {listpagehtml}
      </div>
    </>
  );
}
