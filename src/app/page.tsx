'use client';

export default function Home() {
  function handleClick(oEvent:any){
    window.location.pathname += 'test';
  }

  return (
    <>
      <h1>Hello !!!</h1>
      <button onClick={handleClick}>Click me</button>
    </>
  );
}
