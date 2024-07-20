import fs from "fs";
import path from "path";

import Link from "next/link";

type Blog = {
  id: string;
  title: string;
};

async function getBlogs(): Promise<Blog[]> {
  const blogDir = path.join(process.cwd(), "public", "blogs");
  const filenamesAll = fs.readdirSync(blogDir);
  const filenames = filenamesAll.filter((filename) => filename.includes(".md"));

  return filenames.map((filename) => {
    console.log("Reading files ", filename);

    const filePath = path.join(blogDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const title = fileContents.split("\n")[0].replace("# ", "");
    return {
      id: filename.replace(".md", ""),
      title,
    };
  });
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Blog List</h1>
      <ul className="list-disc list-inside">
        {blogs.map((blog) => (
          <li key={blog.id} className="mb-4">
            <Link href={`/blog/${blog.id}`}>
              <h2 className="text-blue-500 hover:underline">{blog.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
