import profileBackground from '../../assets/prof-background.png';
import profile from '../../assets/profile.png';
import { useLocation, Link } from 'react-router';
import { FiHome } from "react-icons/fi";
import { FaRegPaperPlane } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";
import { FiBell } from "react-icons/fi";
import { RiSearchLine } from "react-icons/ri";
import { TbSettings } from "react-icons/tb";
import { FiSun } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";
import { authClient } from '../../lib/auth-clients';

type Theme = 'light' | 'dark';

type NavbarProps = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const Navbar = ({ theme, setTheme }: NavbarProps) => {
  let location = useLocation()
  let active = `duration-600 ${theme == 'light' ? 'bg-[#D46A4C]' : 'bg-[#E97A56]'} text-white flex items-center gap-[clamp(6px,0.69vw,10px)] px-[clamp(8px,0.9vw,13px)] py-[clamp(6px,0.69vw,10px)] rounded-[clamp(6px,0.69vw,10px)] text-[clamp(8px,0.9vw,13px)] font-bold w-[clamp(120px,13.82vw,199px)]`;
  let inactive = `duration-300 ${theme == 'light' ? 'additional-text' : 'dark-muted-text '} aditional-text flex items-center gap-[clamp(6px,0.69vw,10px)] px-[clamp(8px,0.9vw,13px)] py-[clamp(6px,0.69vw,10px)] rounded-[clamp(6px,0.69vw,10px)] text-[clamp(8px,0.9vw,13px)] font-bold w-[clamp(120px,13.82vw,199px)]`;

  const handleSignOut =  async () => {
    await authClient.signOut()
    alert('Sign out successfull')
  }

  return (
    <div>
      <h2 className={`text-[clamp(20px,2.22vw,32px)] duration-300 vexel ${theme == 'light' ? 'text-[#22201D]' : 'dark-text'}`}>Vexel</h2>
      
      <Link to={'/profile'} className='mt-[clamp(6px,1.11vh,10px)] flex flex-col items-center'>
        <img src={profileBackground} alt="" className={`duration-300 w-[clamp(120px,13.89vw,200px)] aspect-2/1 object-cover rounded-[clamp(6px,0.69vw,10px)] ${theme == 'light' ? 'border-[#E8E2DA]' : 'border-[#353535]' } border-[clamp(1px,0.14vw,2px)]`}/>
        <img src={profile} alt="" className={`duration-300  mt-[clamp(-60px,-4.17vw,-36px)] ${theme == 'light' ? 'border-[#E8E2DA]' : 'border-[#353535]' } border-[clamp(1px,0.14vw,2px)] rounded-full w-[clamp(63px,7.29vw,105px)]`}/>
        <h3 className={`duration-300 ${theme == 'light' ? 'light-text' : 'dark-text'} text-[clamp(11px,1.25vw,18px)] font-bold mt-[clamp(3px,0.35vw,5px)]`}>Lemon Watermelon</h3>
      </Link>

      <div className='flex flex-col gap-[clamp(9px,1.67vh,15px)] mt-[clamp(12px,1.39vw,20px)] items-start'>
        <Link to={'/'} className={location.pathname == '/' ? active : inactive}><FiHome className='text-[clamp(12px,1.39vw,20px)] '/>Home</Link>
        <Link to={'/messages'} className={location.pathname == '/messages' ? active : inactive}><FaRegPaperPlane className='text-[clamp(12px,1.35vw,19px)]'/>Messages</Link>
        <Link to={'/'} className={location.pathname == '/friends' ? active : inactive}><LuUsers className='text-[clamp(12px,1.35vw,19px)]'/>Friends</Link>
        <Link to={'/'} className={location.pathname == '/requests' ? active : inactive}><FiBell className='text-[clamp(12px,1.35vw,19px)]'/>Requests</Link>
        <Link to={'/'} className={location.pathname == '/search' ? active : inactive}><RiSearchLine className='text-[clamp(12px,1.35vw,19px)]'/>Search</Link>
        <Link to={'/'} className={location.pathname == '/setting' ? active : inactive}><TbSettings className='text-[clamp(12px,1.35vw,19px)]'/>Settings</Link>

        <div onClick={() => {setTheme(prev => prev == 'dark' ? 'light' : 'dark'); console.log(theme)}} className={`ml-[clamp(8px,0.9vw,13px)] w-[clamp(36px,4.17vw,60px)] h-[clamp(18px,2.08vw,30px)] flex ${theme == 'light' ? 'bg-[#ECECEC]' : 'bg-[#252525]'} duration-600 rounded-[clamp(6px,0.69vw,10px)] relative  items-center px-[clamp(4px,0.42vw,6px)] gap-[clamp(7px,0.83vw,12px)]`}>
          <div className={`absolute z-1 w-[clamp(18px,2.08vw,30px)] duration-600  h-[clamp(18px,2.08vw,30px)] rounded-[clamp(6px,0.69vw,10px)] left-0 ${theme == 'light' ? 'bg-[#D46A4C]' : 'bg-[#E97A56] translate-x-[clamp(18px,2.08vw,30px)]'}`}></div>
          <FiSun className={`text-[clamp(11px,1.25vw,18px)] ${theme == 'light' ? 'text-[#FFFFFF]' : 'text-[#A7A5A0]'} absolute z-2 left-[clamp(4px,0.42vw,6px)]`}/>
          <FiMoon className={`text-[clamp(11px,1.25vw,18px)] ${theme == 'light' ? 'text-[#77716A]' : 'text-[#202020]'} absolute z-2 right-[clamp(4px,0.42vw,6px)]`}/>
        </div>

        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </div>
  )
}

export default Navbar