'use client';

export default function Home() {
  function handleClick(oEvent:any){
    window.location.pathname = '/';
  }

  return (
    <>
      <h1>Hello Routed page in next JS</h1>
      <button onClick={handleClick}>Click me</button>
    </>
  );
}
