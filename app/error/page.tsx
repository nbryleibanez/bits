interface Props {
  searchParams: {
    message: string;
  };
}

export default function ErrorPage({ searchParams }: Props) {
  return (
    <div>
      <h1>Sorry something went wrong.</h1>
      <p>We are currently resolving this.</p>
      <p>Message: {searchParams.message}</p>
    </div>
  );
}
