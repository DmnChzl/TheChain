import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import SimpleCache from "../../src/utils/cache";

interface Post {
  title: string;
  subTitle?: string;
  releaseDate: string;
  categories: string[];
}

describe("SimpleCache", () => {
  let simpleCache: SimpleCache<Post>;

  beforeAll(() => {
    simpleCache = new SimpleCache<Post>(300_000); // 5 Minutes
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterAll(() => {
    simpleCache.clear();
  });

  it("should has one post", () => {
    const wtfIsReactivityPost: Post = {
      title: "WTF Is Reactivity !?",
      subTitle: "Reactivity Models Explained",
      releaseDate: "2024-12-18",
      categories: ["programming", "javascript"],
    };

    simpleCache.set("wtf-is-reactivity", wtfIsReactivityPost);
    expect(simpleCache.has("wtf-is-reactivity")).toBe(true);
  });

  it("should get one post", () => {
    const tupleContextPatternPost: Post = {
      title: "This Is Tuple Context Pattern",
      releaseDate: "2025-04-05",
      categories: ["react", "preact", "javascript", "typescript"],
    };

    simpleCache.set("tuple-context-pattern", tupleContextPatternPost);
    expect(simpleCache.get("tuple-context-pattern")).toEqual(
      tupleContextPatternPost,
    );
  });

  it("should get many posts", () => {
    expect(simpleCache.getAll()).toHaveLength(simpleCache.size());
  });

  it("should expire and purge one post", async () => {
    const nodeCleanArchPost: Post = {
      title: "How To Build An API With Node, Without Additional Framework",
      releaseDate: "2025-07-25",
      categories: ["programming", "node", "sql", "javascript"],
    };

    simpleCache.set("node-clean-arch", nodeCleanArchPost);
    expect(simpleCache.keys().includes("node-clean-arch")).toBe(true);

    simpleCache.expire("node-clean-arch");
    expect(simpleCache.keys().includes("node-clean-arch")).toBe(true);

    vi.advanceTimersByTime(1);
    simpleCache.purge();

    expect(simpleCache.keys().includes("node-clean-arch")).toBe(false);
  });
});
