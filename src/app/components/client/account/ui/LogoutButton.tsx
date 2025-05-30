import { logout } from "@/app/components/client/account/actions";

export default function LogoutButton () {
    return (
        <div>
            <button className="bg-black text-white p-3 rounded-lg px-8 cursor-pointer" onClick={logout}>
                Log out
            </button>
        </div>
    )
}