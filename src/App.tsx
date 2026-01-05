// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {VideoPlayer} from "./index.ts";

function App() {

  return (
    <>
        <section className={"w-full h-[100dvh] px-12 flex flex-col gap-12 justify-center items-center"}>
            <h1>Video Preview</h1>
            <div className={"w-full h-1/2 bg-amber-100 rounded-2xl overflow-hidden"}>
                <VideoPlayer
                    poster={"https://sibtorsh.s3.ir-thr-at1.arvanstorage.ir/videos%2F1767026736.jpg?versionId="}
                    src={"https://s3.ir-thr-at1.arvanstorage.ir/sibtorsh/videos%2FFan20tahlil2.m4v?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=94bba519-0172-4acd-8584-38c627e8aa07%2F20260105%2Fir-thr-at1%2Fs3%2Faws4_request&X-Amz-Date=20260105T071839Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&versionId=&X-Amz-Signature=6d1e6e36ef4c9998e6597c75cf9a0331495bd15dbda836e6e20789ca0f4703a2"} name={""} />
            </div>
        </section>
    </>
  )
}

export default App
