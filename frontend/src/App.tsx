import { Blog, BlogRes } from "@nest/shared";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["getBlog", 1],
    queryFn: (): Promise<BlogRes> =>
      fetch("http://localhost:4001/api/v0/blog/1").then((res) => res.json()),
  });

  const blog: Blog | undefined = data?.blog;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  return (
    <>
      <div>Hello</div>
      {blog && <div>{blog?.content}</div>}
    </>
  );
}

export default App;
