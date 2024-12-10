import { Circle } from "lucide-react"

const Navbar = () => {
  return (
    <section className="w-full flex justify-between items-center p-4">
        <div className="logo text-3xl">M-Arcade</div>
        <div className="flex gap-14 justify-center items-center font-bold">
            <div className="flex gap-2 justify-center items-center"> <Circle className="w-3 h-3" /> Games</div>
            <div className="flex gap-2 justify-center items-center"> <Circle className="w-3 h-3" /> Shop</div>
            <div className="flex gap-2 justify-center items-center"> <Circle className="w-3 h-3 fill-yl" />About</div>
        </div>
        <div className="p-2 px-3 rounded-3xl border border-yl ">Sign Up</div>
    </section>
  )
}

export default Navbar