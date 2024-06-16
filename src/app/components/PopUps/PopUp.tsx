import Image from "next/image";


export default function PopUp({ onClose, message, status }: any) {

    return (

        <div className="p-7">
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-white dark:bg-dark-100 p-8 rounded-xl shadow-white shadow-sm">
                    <button onClick={onClose} className="ml-48">
                        <svg className="w-6 h-6 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    {status ? (
                        <Image className={'mx-auto'} src={"/gifs/ok.gif"} width={180} height={180} alt="succefull" unoptimized />
                    ) : (
                        <Image className={'mx-auto'} src={"/gifs/error.gif"} width={180} height={180} alt="wrong" unoptimized/>
                    )}
                    <div className="bg-baseBlack/20 border-t m-1 mb-4 divide-black" >
                    </div>
                    {status ? (
                        <p className="text-green-500 text-sm text-center mb-4">{message}</p>
                    ) : (
                        <p className="text-red-500 text-sm text-center mb-4">{message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}