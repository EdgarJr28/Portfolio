import React from 'react'

const SpotifyProfileCard = () => {
    return (
        <div className="max-w-96 mx-auto bg-green-200 dark:bg-transparent backdrop-opacity-40 my-10 rounded-lg overflow-hidden">
            <div className="p-2 mdsm:max-w-full  mdsm:mx-[6%] mx-auto bg-green-200  dark:bg-transparent backdrop-opacity-40">
                <iframe
                    className="w-full drop-shadow-2xl"
                    src="https://spotify-github-profile.vercel.app/api/view?uid=12179838533&cover_image=true&theme=default&show_offline=false&background_color=transparent&interchange=true&bar_color=transparent&bar_color_cover=true"
                    width="300"
                    height="380"
                    frameBorder="0"
                    allowTransparency={true}
                    allow="encrypted-media"
                ></iframe>
            </div>
        </div>
    )
}

export default SpotifyProfileCard
