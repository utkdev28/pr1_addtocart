'use client';

import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import styles from '@/app/mycart/page.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyCartList() {
  const [checkoutDatacount,setcheckoutDatacount] = useState({});
  const [allData,setallData] = useState([]);
  const [checkoutpageHtml,setcheckoutpageHtml] = useState([]);
  const [total,settotal] =useState(0);


  function onremovefromCart(event,id){
    delete checkoutDatacount[id];
    let bagData = JSON.parse(localStorage.getItem('cartdata'));
    while(bagData.indexOf(id) >= 0)
      bagData.splice(bagData.indexOf(id),1);
    localStorage.setItem('cartdata',JSON.stringify(bagData));
    setcheckoutDatacount(Object.assign({}, checkoutDatacount) );
    toast.success(`Item ${id} removed from Cart!` ,{
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }

  function onAddonQuantity(event,id){
    let obj = Object.assign(checkoutDatacount);
    obj[id]++;
    if(obj[id] == 0)
      onremovefromCart();
    else{
      setcheckoutDatacount(Object.assign({}, obj) );
      let bagData = JSON.parse(localStorage.getItem('cartdata'));
      bagData.push(id);
      localStorage.setItem('cartdata',JSON.stringify(bagData));
    }
  }
  // subtract functionality
  function onSubofQuantity(event,id){
    let obj = Object.assign(checkoutDatacount);
    obj[id]--;
    if(obj[id] == 0)
      onremovefromCart(event,id);
    else{
      setcheckoutDatacount(Object.assign({}, obj) );
      let bagData = JSON.parse(localStorage.getItem('cartdata'));
      bagData.splice(bagData.indexOf(id),1);
      localStorage.setItem('cartdata',JSON.stringify(bagData));
    }
  }
  // inital datafetch and Setting into UseState
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
    }
    fetch('/productlist.json').then(res=>res.json()).then((arr)=>{setallData(arr),setcheckoutDatacount(map)});
  },[])
  // DOM prepration after DataLoad with dependency (waterfall Approach)
  useEffect(()=>{
    let obj= allData.reduce((acc,val)=>{
        acc.set(String(val['id']),val);
        return acc;
    },new Map())
    console.log('came at destination');
    let sum=0;
    Object.keys(checkoutDatacount).forEach(id=>{
      let productObj = obj.get(id);
      sum+=  Number(productObj['price']) * Number(checkoutDatacount[productObj['id']]);
    })
    settotal(sum.toFixed(2));
    // actual check out List html prepration 
    setcheckoutpageHtml(Object.keys(checkoutDatacount).map((id)=>{
      let productObj = obj.get(id);
      if(!productObj)
        return(<div key={Math.random()}>
          Please checkout Element in Home page
        </div>) ;
      return (
        <li className={styles.card_li} key={productObj['id']}>
          <div className={styles.img_title}>
            <img src={productObj['images'][0]} className={styles.cartPage_img}></img>
            <div key={productObj['id']}>{productObj && <div>{productObj['title']} $({productObj['price']}) </div>}</div>
          </div>
          <div className={styles.rightdiv}>
            <div>SubTotal: ${(Number(productObj['price']) * Number(checkoutDatacount[productObj['id']])).toFixed(2)}</div>
            <div>
              <div className={styles.increment_div}>
                <button className={styles.increment_button} onClick={(evnt)=>{onSubofQuantity(evnt,productObj['id'])}}>-</button>
                <div>
                  <input type="text" value={checkoutDatacount[productObj['id']]} className={styles.increment_input} disabled={true}/>
                </div>
                <button className={styles.increment_button} onClick={(evnt)=>{onAddonQuantity(evnt,productObj['id'])}}>+</button>
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
      <p>
        Total Price: ${total}
      </p>
      <ul className={styles.cartPage_ul}>
        {checkoutpageHtml}
        <ToastContainer />
      </ul>
    </>
  );
}


