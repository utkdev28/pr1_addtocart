'use client';
import styles from "./page.module.css";


import { useEffect, useState } from "react";

export default function Home() {
  const [listdata,setlistdata] = useState([]);
  const [listpage,setlistpage]:any=useState([]);

  useEffect(()=>{
    async function fetchDatafromJSON() {
      //fetcing data from local JSON file present in Public folder
      const res = await fetch('/productList.json')
      let arr = await res.json();
      console.log(arr);
      setlistdata(arr);
    }
    fetchDatafromJSON();
  },[])
  // useEffect with dependent on Data load to rerender on Screen
  useEffect(()=>{
    if(listdata.length ==0)
      return;
    let arr=[]
    let obj = { "width": "100%","height": "200px", "object-fit": "cover"};
    for (let productitem of listdata) {
      arr.push(<div key={productitem['id']} className={styles.card}>
        {productitem['images'][0] && <img src={productitem['images'][0]} style={obj} className="card-image"></img>}
        <div className="card-body">
          <h3 className="card-title">{productitem['title']}</h3>
          <p className="card-content">{productitem['price']}</p>
          <button>Add to Cart</button>
        </div>
      </div>)
    }
    console.log('Reached here')
    console.table(listpage);
    setlistpage(arr);
  }, [listdata])

  return (
    <>
      <h2 className={styles.App_header}>Welcome to X-Cart</h2>
      <div className={styles.productlistcontainer}>
          {listpage}
      </div>
    </>
  );
}
