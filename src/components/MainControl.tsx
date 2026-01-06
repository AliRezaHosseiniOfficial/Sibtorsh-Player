export default function ({children}) {
    return <section>
        <div className={"sp:w-[5em] sp:h-[5em] sp:flex sp:justify-center sp:items-center sp:bg-black/40 sp:backdrop-blur-xs sp:rounded-full"}>
            {children}
        </div>
    </section>
}