import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.NEXT_API_KEY

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;

  try {
    if(id == null || id.length == 0) return res.status(200).json({message: "Debe ingresar una URL"});

    const videoId = id.toString().startsWith("https://youtu.be/") ? id.toString().substring(id.lastIndexOf("/")+1) : id.toString().substring(id.indexOf("v=")+2, id.indexOf("&"))
    
    const response = await axios.get(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
      {
        headers: {
          "X-RapidAPI-Key":
          API_KEY,
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(200).json(error);
  }
}
