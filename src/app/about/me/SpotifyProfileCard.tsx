import React from 'react'

const SpotifyProfileCard = () => {
    return (

        <div className="flex justify-center items-center w-full h-full">
            <iframe
                className="drop-shadow-2xl mr-2"
                src="https://spotify-github-profile.vercel.app/api/view?uid=12179838533&cover_image=true&theme=default&show_offline=false&background_color=transparent&interchange=true&bar_color=transparent&bar_color_cover=true"
                width="300"
                height="380"
                frameBorder="0"
                allow="encrypted-media"
            ></iframe>


        </div>
    )
}

export default SpotifyProfileCard
