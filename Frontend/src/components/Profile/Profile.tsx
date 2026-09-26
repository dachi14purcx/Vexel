import type React from 'react'
import banner from '../../assets/prof-background.png'
import axios from 'axios'
import { useState } from 'react'

const Profile = () => {
    const theme = 'light'
    const [ profile, setProfile ] = useState()

    const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] 

        if(!file) return
        //TODO check if image

        try {
            const { data } = await axios.post(`http://localhost:8000/users/me/avatar/presign`, { contentType: file.type }, { withCredentials: true })
            const upload = await fetch(data.presignUrl, { method: 'PUT', body: file, headers: { 'content-type': file.type } })
            if (!upload.ok) throw new Error('upload error')

            await axios.post(`http://localhost:8000/users/me/avatar`, { publicUrl: data.publicUrl }, { withCredentials: true })
            setProfile(data.publicUrl)
        } catch(err) {
            console.log(err)
        }
    }

  return (
    <div className='px-60'>
      <div className='mt-[clamp(6px,1.11vh,10px)] flex flex-col items-center'>
        <label htmlFor="">
            <img src={banner} alt="" className={`w-screen h-[12vw] duration-300 fw-[clamp(120px,13.89vw,200px)] aspect-2/1 object-cover rounded-[clamp(6px,0.69vw,10px)] ${theme == 'light' ? 'border-[#E8E2DA]' : 'border-[#353535]' } border-[clamp(1px,0.14vw,2px)]`}/>
            <input type="file" onChange={e => handleProfileChange(e)}/>
        </label>
        <img src={`${profile}`} alt="" className={`duration-300 w-[10vw] mt-[clamp(-60px,-8vw,-36px)] ${theme == 'light' ? 'border-[#E8E2DA]' : 'border-[#353535]' } border-[clamp(1px,0.14vw,2px)] rounded-full rw-[clamp(63px,7.29vw,105px)]`}/>
      </div>
    </div>
  )
}

export default Profile