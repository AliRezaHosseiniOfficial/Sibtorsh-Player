export default function ({children}) {
    return <section>
        <div className={"w-24 h-24 flex justify-center items-center bg-black/40 backdrop-blur-xl rounded-full"}>
            {children}
        </div>
    </section>
}