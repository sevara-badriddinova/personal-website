import type { PostMeta } from "./data/posts";
import type { Route } from "./lib/routes";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PostPage from "./pages/PostPage";
import WritingIndex from "./pages/WritingIndex";

export type AppProps = { route: Route; post?: { meta: PostMeta; html: string } };

export default function App({ route, post }: AppProps) {
  if (route.kind === "writing") return <WritingIndex />;
  if (route.kind === "post") return post ? <PostPage post={post.meta} html={post.html} /> : <NotFound />;
  if (route.kind === "notfound") return <NotFound />;
  return <Home />;
}
