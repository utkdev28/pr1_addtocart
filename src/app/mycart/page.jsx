'use client';

import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import styles from '@/app/mycart/page.module.css'

export default function MyCartList() {
  const [checkoutDatacount,setcheckoutDatacount] = useState({});
  const [allData,setallData] = useState([]);
  const [checkoutpageHtml,setcheckoutpageHtml] = useState([]);


  function onremovefromCart(event,id){
    delete checkoutDatacount[id];
    let bagData = JSON.parse(localStorage.getItem('cartdata'));
    bagData.splice(bagData.indexOf(id),1);
    localStorage.setItem('cartdata',JSON.stringify(bagData));
    setcheckoutDatacount(Object.assign({}, checkoutDatacount) );
  }

  useEffect(()=>{
    let map;
    if(window.localStorage.getItem('cartdata')){
      let bagData = JSON.parse(localStorage.getItem('cartdata') || '');
      console.log(bagData);
      map = bagData.reduce((obj,val)=>{
        if(obj[val])obj[val]++
        else obj[val] = 1;
        return obj
      },{})
      // setcheckoutDatacount(map);
    }
    fetch('/productlist.json').then(res=>res.json()).then((arr)=>{setallData(arr),setcheckoutDatacount(map)});
  },[])

  useEffect(()=>{
    let obj= allData.reduce((acc,val)=>{
        acc.set(String(val['id']),val);
        return acc;
    },new Map())
    console.log('came at destination');
    setcheckoutpageHtml(Object.keys(checkoutDatacount).map((id)=>{
      let productObj = obj.get(id);
      if(!productObj)
        return(<div key={Math.random()}>
          Please checkout Element in Home page
        </div>) ;
      console.log(productObj);
      return (
        <li className={styles.card_li}>
          <div className={styles.img_title}>
            <img src={productObj['images'][0]} className={styles.cartPage_img}></img>
            <div key={productObj['id']}>{productObj && <div> {productObj['title']} </div>}</div>
          </div>
          <div className={styles.rightdiv}>
            <div>{productObj['price']}</div>
            <div>
              <div className={styles.increment_div}>
                <button className={styles.increment_button}>-</button>
                <div>
                  <input type="text" value={checkoutDatacount[productObj['id']]} className={styles.increment_input}/>
                </div>
                <button className={styles.increment_button}>+</button>
              </div>
            </div>
            <button className={styles.removeButton} onClick={(evt)=>{onremovefromCart(evt,productObj['id'])}}>Remove item</button>
          </div>
        </li>
      );
    })) 
  },[allData,checkoutDatacount])

  return (
    <>
      <Link href={'/'}>List Page</Link>
      <h1> CheckOut Items</h1>
      <ul className={styles.cartPage_ul}>
        {checkoutpageHtml}
      </ul>
    </>
  );
}


