import fetch from 'node-fetch';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export async function getPhoto(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const apikey = process.env.UNSPLASH_API_ACCESS_KEY;
  const { queryText } = req.params;
  try {
    const unsplashPhoto = await fetch(
      `https://api.unsplash.com/photos/random?featured=true&orientation=landscape&query=${queryText}`,
      { headers: { Authorization: `Client-ID ${apikey}` } }
    ).then((result) => result.json());

    const {
      id,
      urls: { raw: imgUrl },
      alt_description: altDescription,
    } = unsplashPhoto;

    const photoObject = { id, imgUrl, altDescription };

    res.status(200).json(photoObject);
  } catch (e) {
    next(e);
  }
}
