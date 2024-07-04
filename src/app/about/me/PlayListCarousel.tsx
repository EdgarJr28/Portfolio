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
                        <div className="inline-block pt-2">
                            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={playlist.images[0].url}
                                    alt={playlist.name}
                                    width={300}
                                    height={200}
                                    className="rounded-lg object-cover max-w-full hover:scale-105 hover:shadow-lg hover:shadow-baseBlack transition-all duration-300" />
                                <p className="text-center text-base font-semibold font-mono mt-4">{playlist.name}</p>
                            </a>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default PlayListCarousel;