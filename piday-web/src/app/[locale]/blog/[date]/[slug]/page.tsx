import fs from "fs";
import path from "path";

import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

import Image from "next/image";
import { notFound } from "next/navigation";

import React from "react";
import ReactMarkdown from "react-markdown";

type BlogProps = {
  params: Promise<{
    slug: string;
    date: string;
  }>;
};

async function getBlogContent(slug: string): Promise<string | null> {
  const blogDir = path.join(process.cwd(), "public", "blogs");
  const filePath = path.join(blogDir, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf8");
  } else {
    return null;
  }
}

export default async function BlogPost({ params }: BlogProps) {
  const { slug, date } = await params;
  const content = await getBlogContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <div className="container sm:px-10 lg:px-40 px-2 mb-40">
      <Card className="mt-8" size="lg">
        <div className="min-h-screen py-10">
          <div className="container mx-auto px-0 md:px-12 lg:px-24">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-extrabold text-[rgba(89,59,139,100)] mb-4">
                {slug} | {date}
              </h1>
            </div>

            <article className="prose prose-lg">
              <ReactMarkdown
                components={{
                  img: ({ src, alt }) => (
                    <div className="flex justify-center mb-10">
                      <Image
                        alt={alt || ""}
                        className="rounded-lg shadow-lg"
                        height={400}
                        src={src as string}
                        width={800}
                      />
                    </div>
                  ),
                  h1: ({ children }) => (
                    <Typography
                      aria-label="H1"
                      className="!text-3xl font-semibold !mb-4"
                      level="title-lg"
                    >
                      {children}
                    </Typography>
                  ),
                  h2: ({ children }) => (
                    <Typography
                      aria-label="H2"
                      className="!text-2xl font-semibold !mb-4"
                      level="title-lg"
                    >
                      {children}
                    </Typography>
                  ),
                  h3: ({ children }) => (
                    <Typography
                      aria-label="H3"
                      className="!text-xl font-semibold !mb-4"
                      level="title-lg"
                    >
                      {children}
                    </Typography>
                  ),
                  p: ({ children }) => (
                    <Typography
                      aria-label="P"
                      className="!mb-6 !text-lg"
                      level="body-md"
                    >
                      {children}
                    </Typography>
                  ),
                  ol: ({ children }) => (
                    <ol className="!list-decimal">{children}</ol>
                  ),
                  ul: ({ children }) => (
                    <ul className="!list-disc">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className=" !text-lg !mb-4 !ml-12">{children}</li>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </Card>
    </div>
  );
}
