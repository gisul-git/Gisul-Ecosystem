import Image from "next/image";
import LoginPage from "./login/page";
import SignupPage from "./signup/page";

export default function Home() {
  return (
    <div >
        <LoginPage/>
        <SignupPage/>
    </div>
  );
}
