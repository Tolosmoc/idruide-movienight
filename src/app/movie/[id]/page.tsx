import { MovieDetailPage } from '@/components/movie/MovieDetail/MovieDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function FilmPage({ params }: PageProps) {
  const movieId = parseInt(params.id, 10);

  return <MovieDetailPage movieId={movieId} />;
}