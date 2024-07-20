import fs from "fs";
import path from "path";

import Card from "@mui/joy/Card";

import Image from "next/image";
import { notFound } from "next/navigation";

import React from "react";
import ReactMarkdown from "react-markdown";

type BlogProps = {
  params: {
    id: string;
  };
};

async function getBlogContent(id: string): Promise<string | null> {
  const blogDir = path.join(process.cwd(), "public", "blogs");
  const filePath = path.join(blogDir, `${id}.md`);

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf8");
  } else {
    return null;
  }
}

export default async function BlogPost({ params }: BlogProps) {
  const { id } = params;
  const content = await getBlogContent(id);

  if (!content) {
    notFound();
  }

  return (
    <Card className="mt-8" size="lg">
      <div className="min-h-screen py-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-[rgba(89,59,139,100)] mb-4">
              {id}
            </h1>
          </div>

          <article className="prose prose-lg">
            <ReactMarkdown
              components={{
                img: ({ src, alt }) => (
                  <div className="flex justify-center mb-10">
                    <Image
                      src={src as string}
                      alt={alt || ""}
                      width={800}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </Card>
  );
}
