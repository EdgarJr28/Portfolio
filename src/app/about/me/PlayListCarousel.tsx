import Image from "next/image";
import Slider from "react-slick";

const PlayListCarousel = ({ data }: any) => {
    const settings = {
        className: "center",
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        autoplay: true,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    return (
        <div className="w-full max-w-xs mdsm:max-w-lg mx-auto mt-4">
            <Slider {...settings}>
                {data.map((playlist: any) => (
                    <div key={playlist.id} className="flex flex-col items-center justify-center mx-auto">
                        <div className="inline-block pt-2 mx-6">
                            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={playlist.images[0].url}
                                    alt={playlist.name}
                                    width={300}
                                    height={200}
                                    className="rounded-lg object-cover max-w-full hover:scale-105 shadow-xl shadow-baseBlack rotate-x-20 transition-all duration-700" />
                                <p className="text-center text-lg font-semibold font-mono mt-6">{playlist.name}</p>
                                {playlist.description.length > 0 && <p className="text-center text-xs font-mono">{playlist.description}</p> }
                            </a>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default PlayListCarousel;