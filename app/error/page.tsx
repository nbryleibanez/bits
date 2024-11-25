interface Props {
  searchParams: Promise<{
    message: string;
  }>;
}

export default async function ErrorPage(props: Props) {
  const searchParams = await props.searchParams;
  return (
    <div>
      <h1>Sorry something went wrong.</h1>
      <p>We are currently resolving this.</p>
      <p>Message: {searchParams.message}</p>
    </div>
  );
}
