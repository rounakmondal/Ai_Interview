import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { BLOG_POSTS, type BlogMeta } from "./BlogIndex";

interface BlogPostLayoutProps {
  slug: string;
  children: React.ReactNode;
}

export default function BlogPostLayout({
  slug,
  children,
}: BlogPostLayoutProps) {
  const navigate = useNavigate();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const postIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | InterviewSathi Blog`;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", post.description);
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) return null;

  const related = BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === post.category
  ).slice(0, 3);

  const prevPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
  const nextPost =
    postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ══ HERO HEADER ══ */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[100px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-12 sm:pb-16">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8"
          >
            <Link
              to="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              to="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground/70 truncate max-w-[250px]">
              {post.category}
            </span>
          </motion.nav>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 gap-2 hover:bg-indigo-500/10 hover:text-indigo-500 rounded-full px-4"
              onClick={() => navigate("/blog")}
            >
              <ArrowLeft className="w-4 h-4" />
              All Articles
            </Button>
          </motion.div>

          {/* Post header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-xs px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 font-semibold border border-indigo-500/20">
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime} read
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-[1.15] mb-5 tracking-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6 max-w-3xl">
              {post.description}
            </p>

            {/* Share + Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-indigo-500/30"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 bg-muted/80 rounded-full text-muted-foreground"
                  >
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* ══ ARTICLE CONTENT ══ */}
      <article className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="
            blog-content
            [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-extrabold [&>h2]:text-foreground
            [&>h2]:mt-12 [&>h2]:mb-5 [&>h2]:tracking-tight
            [&>h2]:border-l-4 [&>h2]:border-indigo-500 [&>h2]:pl-4

            [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-foreground
            [&>h3]:mt-8 [&>h3]:mb-3

            [&>p]:text-base [&>p]:sm:text-lg [&>p]:text-muted-foreground
            [&>p]:leading-[1.8] [&>p]:mb-5

            [&>ul]:mb-6 [&>ul]:space-y-2.5 [&>ul]:ml-1
            [&>ul>li]:text-muted-foreground [&>ul>li]:leading-relaxed
            [&>ul>li]:pl-6 [&>ul>li]:relative
            [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0
            [&>ul>li]:before:top-[10px] [&>ul>li]:before:w-2 [&>ul>li]:before:h-2
            [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-indigo-500/60

            [&>ol]:mb-6 [&>ol]:space-y-3 [&>ol]:ml-1 [&>ol]:list-none [&>ol]:counter-reset-[item]
            [&>ol>li]:text-muted-foreground [&>ol>li]:leading-relaxed
            [&>ol>li]:pl-10 [&>ol>li]:relative [&>ol>li]:counter-increment-[item]
            [&>ol>li]:before:content-[counter(item)] [&>ol>li]:before:absolute
            [&>ol>li]:before:left-0 [&>ol>li]:before:top-0
            [&>ol>li]:before:w-7 [&>ol>li]:before:h-7 [&>ol>li]:before:rounded-lg
            [&>ol>li]:before:bg-indigo-500/10
            [&>ol>li]:before:text-indigo-500 [&>ol>li]:before:text-sm
            [&>ol>li]:before:font-bold [&>ol>li]:before:flex
            [&>ol>li]:before:items-center [&>ol>li]:before:justify-center

            [&_strong]:text-foreground [&_strong]:font-semibold

            [&_a]:text-indigo-500 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2
            [&_a]:decoration-indigo-500/30 [&_a:hover]:decoration-indigo-500

            [&>hr]:my-10 [&>hr]:border-border/50

            [&>blockquote]:my-8 [&>blockquote]:border-l-4 [&>blockquote]:border-indigo-500
            [&>blockquote]:bg-gradient-to-r [&>blockquote]:from-indigo-500/5 [&>blockquote]:to-transparent
            [&>blockquote]:rounded-r-xl [&>blockquote]:px-6 [&>blockquote]:py-5
            [&>blockquote_p]:text-foreground/80 [&>blockquote_p]:mb-0

            [&>table]:w-full [&>table]:my-8 [&>table]:text-sm [&>table]:rounded-xl [&>table]:overflow-hidden
            [&>table]:border [&>table]:border-border/50
            [&_thead]:bg-muted/80
            [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_th]:text-sm
            [&_td]:px-4 [&_td]:py-3 [&_td]:border-t [&_td]:border-border/30 [&_td]:text-muted-foreground
            [&_tbody_tr:hover]:bg-muted/30 [&_tbody_tr]:transition-colors
          "
        >
          {children}
        </motion.div>
      </article>

      {/* ══ CTA SECTION ══ */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydi0ySDE2djJoMTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Ready to Test Your Knowledge?
              </h3>
              <p className="text-white/70 text-sm sm:text-base max-w-lg">
                Practice with real previous year papers in our exam-like
                environment. Timer, scoring, and detailed answer analysis
                included.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl px-5"
                onClick={() => navigate("/question-hub")}
              >
                Question Bank
              </Button>
              <Button
                className="bg-white text-indigo-700 hover:bg-white/90 font-semibold rounded-xl px-5"
                onClick={() => navigate("/govt-practice")}
              >
                Start Practice →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PREV / NEXT NAV ══ */}
      {(prevPost || nextPost) && (
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-border hover:shadow-md transition-all"
              >
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  Previous Article
                </div>
                <h4 className="font-semibold text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2 text-sm">
                  {prevPost.title}
                </h4>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-border hover:shadow-md transition-all text-right"
              >
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1 justify-end">
                  Next Article
                  <ArrowRight className="w-3 h-3" />
                </div>
                <h4 className="font-semibold text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2 text-sm">
                  {nextPost.title}
                </h4>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ══ RELATED POSTS ══ */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              More in {post.category}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((rp) => (
              <Link
                key={rp.slug}
                to={`/blog/${rp.slug}`}
                className="block group"
              >
                <div className="rounded-xl border border-border/50 bg-card p-5 hover:border-indigo-500/30 hover:shadow-md transition-all h-full flex flex-col">
                  <span className="text-2xl mb-3">{rp.icon}</span>
                  <h4 className="font-bold text-sm text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2 mb-2 flex-1">
                    {rp.title}
                  </h4>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {rp.readTime} read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
