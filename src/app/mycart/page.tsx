'use client';

import Link from "next/link";

export default function Home() {
  function handleClick(oEvent:any){
    window.location.pathname = '/';
  }

  return (
    <>
      <h1>Welcome to Checkoutpage</h1>
      <Link href={'/'} onClick={handleClick}>Click me</Link>
    </>
  );
}
