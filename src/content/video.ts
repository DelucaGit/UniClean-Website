export type VideoContent = {
  /** Sökväg eller adress till videofilen. Tom tills videon finns: då visas inte sektionen. */
  src: string;
  /** Stillbild som visas innan videon startas. */
  poster: string;
};

export const video: VideoContent = {
  src: "",
  poster: "/img/video.jpg",
};
