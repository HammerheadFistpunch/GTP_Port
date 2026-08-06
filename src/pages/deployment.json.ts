export const prerender = true;

const commit = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || "local";
const branch = process.env.CF_PAGES_BRANCH || process.env.GITHUB_BRANCH || "local";
const builtAt = new Date().toISOString();

export const GET = () =>
    new Response(JSON.stringify({ commit, branch, builtAt }), {
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    });
