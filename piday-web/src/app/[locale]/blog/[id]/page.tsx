import { notFound } from "next/navigation";

type Blog = {
  id: number;
  title: string;
  content: string;
};

const BlogPost = async ({ params }: { params: { id: string } }) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/blogs.json`);
  const blogs: Blog[] = await res.json();
  const blog = blogs.find((blog) => blog.id.toString() === params.id);

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
    </div>
  );
};

export default BlogPost;
