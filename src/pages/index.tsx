import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

interface iDownload {
  title: string;
  link: string;
  duration: number;
  msg: string;
  status: string;
  progress: number;
}

const ERRORS = {
  NULL: "Debe ingresar un video",
  NOT_FOUND: "No se ha encontrado el video.",
  DEFAULT: "Ha acurrido un error, intentelo de nuevo.",
};

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | boolean>(false);
  const [download, setDownload] = useState<iDownload | null>(null);
  const [inputContent, setInputContent] = useState<string>("");

  const durationParse = (decimal: number) => {
    var minutos = Math.floor(decimal / 60);
    var segundos = Math.round(decimal % 60);

    return segundos == 0 ? `${minutos}m` : `${minutos}m ${segundos}s`;
  };

  const getVideo = async () => {
    setIsLoading(true);
    setError(false);
    setDownload(null);
    
    if (inputContent && inputContent.trim().length > 0) {
      const res = await axios.post("/api/convert", {
        id: inputContent.trim(),
      });
      if (res.data.message) {
        setError(res.data.message);
      } else if (res.data.status != "ok") {
        setError(ERRORS.NOT_FOUND);
      } else {
        res.data.link.length > 4
          ? setDownload(res.data)
          : setError(ERRORS.DEFAULT);
      }
    } else setError(ERRORS.NULL);
    
    setIsLoading(false);
  };

  return (
    <>
    <main className="w-full min-h-screen flex flex-col items-center bg-black bg-opacity-50 backdrop-blur-md">
      <section className="flex flex-col m-auto p-6 lg:min-w-[500px]">
        <h1 className="text-4xl lg:text-5xl font-semibold text-white text-center">
          De URL a MP3.
        </h1>
        <span className="text-sm lg:text-base text-center text-gray-300 my-2 max-w-[500px] mt-5">
          Solo ingresa la url de videos de YOUTUBE. Tenes un limite de 200
          canciones por día, cuando lo pases deja de funcionar hasta dentro de
          24 hs. Cualquier cosa mandame por WhatsApp
        </span>
        <div className="flex flex-col lg:flex-row w-full items-center gap-x-2 mt-4 lg:mt-2">
            <div className="flex items-center w-full relative">
              <input
                type="text"
                name=""
                id=""
                value={inputContent}
                onChange={(e) => {
                  setInputContent(e.target.value), setError(false);
                }}
                placeholder="Ingrese URL"
                className="p-4 mt-4 lg:my-4 rounded-sm w-full border-[1px] border-slate-500 focus:border-red-600 outline-0 bg-black text-white pr-14"
              />
              <button
                className="absolute text-white right-4 text-2xl mt-4 lg:mt-0 hover:text-red-600"
                onClick={() => setInputContent("")}
              >
                <IoMdClose />
              </button>
            </div>
            <button
              className="bg-red-600 py-4 px-8 lg:px-4 my-4 rounded-sm text-white font-semibold hover:brightness-110"
              onClick={getVideo}
            >
              Buscar
            </button>
          </div>
        <section className="flex flex-col items-center">
          {isLoading && (
            <h1 className="text-white mt-4 lg:mt-3 text-4xl">
              <BiLoaderAlt className="animate-spin" />
            </h1>
          )}
          {error && (
            <h1 className="text-red-500 font-semibold text-lg mt-4 lg:mt-3">
              ERROR: {error}
            </h1>
          )}
          {download && (
            <div className="text-white flex flex-col gap-y-6 items-center mt-3 lg:min-w-[500px] bg-black px-4 py-6 rounded-md">
              <span className="font-semibold text-center text-sm lg:text-base">
                {download.title}
              </span>
              <span className="text-sm lg:text-base">
                Duración: {durationParse(download.duration)}
              </span>
              <a
                href={download.link}
                className="bg-green-600 text-white font-semibold p-4 rounded-sm mt-3 lg:mt-4"
              >
                Descargar
              </a>
            </div>
          )}
        </section>
      </section>
    </main>
    </>
  );
};

export default Home;
