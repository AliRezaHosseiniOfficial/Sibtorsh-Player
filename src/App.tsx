// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import "./index.css"
import {VideoPlayer} from "./index.ts";

function App() {

  return (
    <>
        <section className={"sp:w-[full] sp:aspect-9/8 sp:px-12 sp:flex sp:flex-col sp:gap-12 sp:justify-center sp:items-center"}>
            <h1>Video Preview</h1>
            <div className={"sp:w-full sp:h-1/2 sp:bg-amber-100 sp:rounded-2xl sp:overflow-hidden"}>
                <VideoPlayer
                    poster={"https://sibtorsh.s3.ir-thr-at1.arvanstorage.ir/videos%2F1767026736.jpg?versionId="}
                    src={"https://s3.ir-thr-at1.arvanstorage.ir/sibtorsh/videos%2FFan20tahlil2.m4v?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=94bba519-0172-4acd-8584-38c627e8aa07%2F20260106%2Fir-thr-at1%2Fs3%2Faws4_request&X-Amz-Date=20260106T105154Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&versionId=&X-Amz-Signature=b2b9ff4aceb79a31a37068b467b2849fd987b273dd93afbeda9dcbde29eef935"} name={""} />
            </div>
        </section>
    </>
  )
}

export default App
