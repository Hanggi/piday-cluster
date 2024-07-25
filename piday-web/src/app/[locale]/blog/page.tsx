import fs from "fs";
import path from "path";

import Card from "@mui/joy/Card";

import Link from "next/link";

type Blog = {
  slug: string;
  title: string;
  date: string;
};

async function getBlogs(): Promise<Blog[]> {
  const blogDir = path.join(process.cwd(), "public", "blogs");
  const filenamesAll = fs.readdirSync(blogDir);
  const filenames = filenamesAll.filter((filename) => filename.includes(".md"));

  return filenames.map((filename) => {
    console.log("Reading files ", filename);

    const filePath = path.join(blogDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const date = fileContents.split("\n")[0].replace("# ", "");
    const title = fileContents.split("\n")[2].replace("# ", "");

    return {
      slug: filename.replace(".md", ""),
      title,
      date: date,
    };
  });
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <div className="container max-w-2xl mx-auto p-4 mb-40">
      <h1 className="text-3xl font-bold text-center mb-8">Blog List</h1>
      <div className="list-disc list-inside">
        {blogs.map((blog) => (
          <Card key={blog.slug} className="mb-4">
            <Link href={`/blog/${blog.date}/${blog.slug}`}>
              <h2 className=" hover:underline">{blog.title}</h2>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
