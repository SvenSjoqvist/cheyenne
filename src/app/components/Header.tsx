export default function Header() {
    return (
        <div className="bg-black h-14 w-full flex items-center justify-center gap-4">
            <span className="text-white font-darker-grotesque">Free US shipping on all orders</span>
            <div className="w-2 h-2 rounded-full bg-[#588FAE]"></div>
            <span className="text-white font-darker-grotesque">Free worldwide shipping on orders $200 and over</span>
        </div>
    )
}