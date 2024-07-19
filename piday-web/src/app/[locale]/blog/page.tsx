import Link from "next/link";

type Blog = {
  id: number;
  title: string;
  content: string;
};

const Home = async () => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/blogs.json`);
  const blogs: Blog[] = await res.json();

  return (
    <div>
      <h1>Blog List</h1>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>
              <h2>{blog.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
